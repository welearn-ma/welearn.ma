import { Router } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryPaymentStore } from "../../payments/__tests__/memoryStore";
import { request, SITE, startServer, type TestServer } from "../../payments/__tests__/harness";
import { createAdminCommerceRouters } from "../adminRouter";
import { CODE_PATTERN } from "../codes";
import { FakeMailer, MemoryProofFiles, PDF_BYTES } from "./fakes";

const NOW = new Date("2026-11-24T10:00:00.000Z");
const ADMIN = "charif@example.test";
const REPLY_TO = "contact@example.test";
const AUTH = { authorization: "Bearer admin-token" };
const STUDENT_EMAIL = "salma@example.test";

let store: MemoryPaymentStore;
let files: MemoryProofFiles;
let mailer: FakeMailer;
let server: TestServer;
let proofId: string;

const call = (method: string, path: string, json?: unknown, headers: Record<string, string> = AUTH) =>
  request(server.base, method, `/api/admin${path}`, {
    json: method === "GET" ? undefined : json,
    headers,
  }).then((res) => ({
    ...res,
    data: res.body ? JSON.parse(res.body) : null,
  }));

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({ slug: "bim-foundations-pro", label: "BIM Foundations Professional — Pack Professionnels", amount_mad: 8500, page_slug: "bim-foundations-professional" });
  store.addProduct({ slug: "bim-foundations-etudiant", label: "BIM Foundations Professional — Pack Étudiants", amount_mad: 5000, page_slug: "bim-foundations-professional", requires_student_code: true });
  proofId = store.addProof({ email: STUDENT_EMAIL, full_name: "Salma El Idrissi", page_slug: "bim-foundations-professional" }).id;
  files = new MemoryProofFiles();
  await files.upload(`${proofId}.pdf`, PDF_BYTES, "application/pdf");
  mailer = new FakeMailer();

  const routers = createAdminCommerceRouters({
    store,
    files,
    mailer,
    siteUrl: SITE,
    replyTo: REPLY_TO,
    now: () => NOW,
    verifyAdmin: async (token) => {
      if (token === "admin-token") return { ok: true, email: ADMIN };
      if (token === "user-token") return { ok: false, reason: "not_admin" };
      return { ok: false, reason: token ? "invalid_token" : "missing_token" };
    },
  });
  const admin = Router();
  admin.use("/student-proofs", routers.studentProofs);
  admin.use("/codes", routers.codes);
  server = await startServer({ afterCors: [["/api/admin", admin]] });
});

afterEach(async () => {
  vi.restoreAllMocks();
  await server.close();
});

describe("admin auth", () => {
  it.each([
    ["no token", {}, 401],
    ["invalid token", { authorization: "Bearer nope" }, 401],
    ["non-admin user", { authorization: "Bearer user-token" }, 403],
  ])("%s → %s on every route", async (_label, headers, status) => {
    for (const [method, path] of [
      ["GET", "/student-proofs"],
      ["GET", `/student-proofs/${proofId}/file`],
      ["POST", `/student-proofs/${proofId}/approve`],
      ["POST", `/student-proofs/${proofId}/reject`],
      ["GET", "/codes"],
      ["POST", "/codes"],
    ]) {
      const res = await call(method, path, {}, headers as Record<string, string>);
      expect(res.status, `${method} ${path}`).toBe(status);
      expect(res.data.success).toBe(false);
    }
    expect(store.proofs.get(proofId)!.status).toBe("PENDING");
    expect(store.codes.size).toBe(0);
  });
});

describe("student proofs", () => {
  it("lists proofs with a status filter, never exposing the storage path", async () => {
    store.addProof({ email: "x@example.test", page_slug: "bim-foundations-professional", status: "REJECTED", reviewed_by: ADMIN, reviewed_at: NOW.toISOString(), rejection_reason: "Illisible" });
    const all = await call("GET", "/student-proofs");
    expect(all.data.data).toHaveLength(2);
    const pending = await call("GET", "/student-proofs?status=PENDING");
    expect(pending.data.data.map((p: { id: string }) => p.id)).toEqual([proofId]);
    expect(pending.data.data[0]).toMatchObject({ fullName: "Salma El Idrissi", email: STUDENT_EMAIL, status: "PENDING", code: null });
    expect(JSON.stringify(all.data)).not.toContain(".pdf");
    expect((await call("GET", "/student-proofs?status=bogus")).status).toBe(400);
  });

  it("returns a 60 s signed URL to view the document", async () => {
    const res = await call("GET", `/student-proofs/${proofId}/file`);
    expect(res.status).toBe(200);
    expect(res.data.data).toEqual({
      url: `https://storage.example.test/signed/${proofId}.pdf?token=t&expires=60`,
      expiresInSeconds: 60,
    });
    expect(files.signed).toEqual([{ path: `${proofId}.pdf`, ttlSeconds: 60 }]);
    expect((await call("GET", "/student-proofs/not-a-uuid/file")).status).toBe(404);
  });

  it("approve → student code (30 days, student pack, student's email), proof APPROVED, activity, email", async () => {
    const res = await call("POST", `/student-proofs/${proofId}/approve`);
    expect(res.status).toBe(200);
    const { code, expiresAt, emailSent } = res.data.data;
    expect(code).toMatch(CODE_PATTERN);
    expect(expiresAt).toBe("2026-12-24T10:00:00.000Z");
    expect(emailSent).toBe(true);

    const stored = store.codeByValue(code)!;
    expect(stored).toMatchObject({
      kind: "student",
      percent_off: null,
      product_slug: "bim-foundations-etudiant",
      customer_email: STUDENT_EMAIL,
      max_uses: 1,
      used_count: 0,
      created_by: ADMIN,
      student_proof_id: proofId,
    });
    expect(store.proofs.get(proofId)).toMatchObject({
      status: "APPROVED",
      reviewed_by: ADMIN,
      reviewed_at: NOW.toISOString(),
      code_id: stored.id,
    });
    expect(store.activity).toEqual([
      { entity_type: "student_proof", entity_id: proofId, event_type: "proof_approved", actor_email: ADMIN, note: null },
    ]);

    expect(mailer.sent).toHaveLength(1);
    const mail = mailer.sent[0];
    expect(mail.to).toBe(STUDENT_EMAIL);
    expect(mail.replyTo).toBe(REPLY_TO);
    expect(mail.text).toContain(
      `Votre statut étudiant a été validé. Votre code personnel : ${code}, valable jusqu'au 24/12/2026, à saisir lors du paiement du Pack Étudiants avec cette adresse e-mail : ${SITE}/paiement/?produit=bim-foundations-etudiant.`,
    );
    expect(mail.html).toContain(`href="${SITE}/paiement/?produit=bim-foundations-etudiant"`);
    expect(JSON.stringify(mail)).not.toMatch(/\.pdf|signed/);
  });

  it("approving twice → 409, a single code", async () => {
    await call("POST", `/student-proofs/${proofId}/approve`);
    const again = await call("POST", `/student-proofs/${proofId}/approve`);
    expect(again.status).toBe(409);
    expect(store.codes.size).toBe(1);
  });

  it("retries on a code collision; reopens the proof if the code cannot be created", async () => {
    store.duplicateCodesToSimulate = 2;
    expect((await call("POST", `/student-proofs/${proofId}/approve`)).status).toBe(200);
    expect(store.codes.size).toBe(1);

    const other = store.addProof({ email: "b@example.test", page_slug: "bim-foundations-professional" }).id;
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.insertCode = true;
    expect((await call("POST", `/student-proofs/${other}/approve`)).status).toBe(500);
    expect(store.proofs.get(other)).toMatchObject({ status: "PENDING", reviewed_by: null });
  });

  it("an SMTP failure keeps the approval and reports emailSent: false", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mailer.failing = true;
    const res = await call("POST", `/student-proofs/${proofId}/approve`);
    expect(res.status).toBe(200);
    expect(res.data.data.emailSent).toBe(false);
    expect(store.proofs.get(proofId)!.status).toBe("APPROVED");
  });

  it("reject requires a reason, then emails it", async () => {
    expect((await call("POST", `/student-proofs/${proofId}/reject`, { reason: "  " })).status).toBe(400);
    expect((await call("POST", `/student-proofs/${proofId}/reject`, { reason: "x".repeat(1001) })).status).toBe(400);

    const res = await call("POST", `/student-proofs/${proofId}/reject`, { reason: "Carte expirée." });
    expect(res.status).toBe(200);
    expect(res.data.data.emailSent).toBe(true);
    expect(store.proofs.get(proofId)).toMatchObject({ status: "REJECTED", rejection_reason: "Carte expirée.", reviewed_by: ADMIN });
    expect(store.codes.size).toBe(0);
    expect(store.activity[0]).toMatchObject({ event_type: "proof_rejected", note: "Carte expirée." });
    expect(mailer.sent[0].text).toContain(
      "Votre justificatif n'a pas pu être validé : Carte expirée. Vous pouvez nous envoyer un nouveau justificatif",
    );
    expect(mailer.sent[0].html).toContain(
      `href="${SITE}/etudiant/justificatif/?formation=bim-foundations-professional"`,
    );
    expect((await call("POST", `/student-proofs/${proofId}/reject`, { reason: "Encore" })).status).toBe(409);
  });

  it("escapes user-provided text in emails", async () => {
    store.proofs.get(proofId)!.full_name = '<img src=x onerror="alert(1)">';
    await call("POST", `/student-proofs/${proofId}/reject`, { reason: "<b>non</b>" });
    expect(mailer.sent[0].html).not.toContain("<img");
    expect(mailer.sent[0].html).not.toContain("<b>non</b>");
    expect(mailer.sent[0].html).toContain("&lt;b&gt;non&lt;/b&gt;");
  });
});

describe("« Renvoyer l'e-mail » — existing code only", () => {
  it("approved proof: re-sends the same student code, creates nothing", async () => {
    const approved = await call("POST", `/student-proofs/${proofId}/approve`);
    const code = approved.data.data.code;
    mailer.sent.length = 0;

    store.activity.length = 0;
    const res = await call("POST", `/student-proofs/${proofId}/resend`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ success: true, data: { emailSent: true } });
    expect(store.codes.size).toBe(1);
    expect(store.activity).toEqual([
      { entity_type: "student_proof", entity_id: proofId, event_type: "proof_email_resent", actor_email: ADMIN, note: null },
    ]);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].to).toBe(STUDENT_EMAIL);
    expect(mailer.sent[0].text).toContain(`Votre code personnel : ${code}, valable jusqu'au 24/12/2026`);
  });

  it("refuses a pending or rejected proof (no code)", async () => {
    expect((await call("POST", `/student-proofs/${proofId}/resend`)).status).toBe(409);
    await call("POST", `/student-proofs/${proofId}/reject`, { reason: "Illisible" });
    expect((await call("POST", `/student-proofs/${proofId}/resend`)).status).toBe(409);
  });

  it.each([
    ["revoked", { revoked_at: "2026-11-24T09:00:00.000Z" }, "Ce code a été révoqué : il ne peut pas être renvoyé."],
    ["used", { used_count: 1 }, "Ce code a déjà été utilisé : il ne peut pas être renvoyé."],
    ["expired", { expires_at: "2026-11-24T09:00:00.000Z" }, "Ce code a expiré : il ne peut pas être renvoyé."],
  ])("refuses to re-send a %s student code", async (_label, change, message) => {
    const approved = await call("POST", `/student-proofs/${proofId}/approve`);
    Object.assign(store.codeByValue(approved.data.data.code)!, change);
    mailer.sent.length = 0;
    const res = await call("POST", `/student-proofs/${proofId}/resend`);
    expect(res.status).toBe(409);
    expect(res.data.message).toBe(message);
    expect(mailer.sent).toHaveLength(0);
  });

  it("SMTP failure → 502 with a clear message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    await call("POST", `/student-proofs/${proofId}/approve`);
    mailer.failing = true;
    store.activity.length = 0;
    const res = await call("POST", `/student-proofs/${proofId}/resend`);
    expect(res.status).toBe(502);
    expect(res.data.message).toBe("L'e-mail n'a pas pu être envoyé. Merci de réessayer.");
    expect(store.activity).toEqual([]);
  });

  it("active discount code: re-sends the same code", async () => {
    const created = await call("POST", "/codes", { email: "client@example.test" });
    store.activity.length = 0;
    const res = await call("POST", `/codes/${created.data.data.id}/resend`);
    expect(res.status).toBe(200);
    expect(store.codes.size).toBe(1);
    expect(store.activity).toEqual([
      { entity_type: "code", entity_id: created.data.data.id, event_type: "code_email_resent", actor_email: ADMIN, note: null },
    ]);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].text).toContain(created.data.data.code);
    expect(mailer.sent[0].text).toContain(`${SITE}/paiement/?produit=bim-foundations-pro`);
  });

  it("discount resend refuses revoked codes and student codes", async () => {
    const created = await call("POST", "/codes", { email: "client@example.test" });
    await call("POST", `/codes/${created.data.data.id}/revoke`);
    expect((await call("POST", `/codes/${created.data.data.id}/resend`)).status).toBe(409);

    const approved = await call("POST", `/student-proofs/${proofId}/approve`);
    const studentId = store.codeByValue(approved.data.data.code)!.id;
    const res = await call("POST", `/codes/${studentId}/resend`);
    expect(res.status).toBe(409);
    expect(res.data.message).toBe("Un code étudiant se renvoie depuis « Justificatifs étudiants ».");
  });

  it("requires admin auth", async () => {
    expect((await call("POST", `/student-proofs/${proofId}/resend`, {}, {})).status).toBe(401);
    expect((await call("POST", "/codes/00000000-0000-4000-8000-000000000000/resend", {}, {})).status).toBe(401);
  });
});

describe("codes", () => {
  it("creates a 5 % discount code (default +30 days) and optionally emails it", async () => {
    const res = await call("POST", "/codes", { email: " Client@Example.TEST ", sendEmail: true });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({
      kind: "discount",
      percentOff: 5,
      productSlug: null,
      customerEmail: "client@example.test",
      usedCount: 0,
      maxUses: 1,
      expiresAt: "2026-12-24T10:00:00.000Z",
      status: "active",
      emailSent: true,
    });
    expect(res.data.data.code).toMatch(CODE_PATTERN);
    expect(store.activity[0]).toMatchObject({ entity_type: "code", event_type: "code_created", actor_email: ADMIN });
    expect(mailer.sent[0].to).toBe("client@example.test");
    expect(mailer.sent[0].text).toContain(res.data.data.code);
    expect(mailer.sent[0].text).toContain("5 % de réduction, valable jusqu'au 24/12/2026");
    expect(mailer.sent[0].text).toContain(`${SITE}/paiement/?produit=bim-foundations-pro`);
  });

  it("does not email unless asked", async () => {
    const res = await call("POST", "/codes", { email: "client@example.test" });
    expect(res.data.data.emailSent).toBe(false);
    expect(mailer.sent).toHaveLength(0);
  });

  it("refuses a second active discount code for the same email, with a clear message", async () => {
    const first = await call("POST", "/codes", { email: "client@example.test" });
    const second = await call("POST", "/codes", { email: "CLIENT@example.test" });
    expect(second.status).toBe(409);
    expect(second.data.message).toBe(
      `Un code de réduction actif existe déjà pour cette adresse e-mail : ${first.data.data.code} (valable jusqu'au 24/12/2026). Révoquez-le avant d'en créer un nouveau.`,
    );
    // Apres revocation : nouveau code possible.
    expect((await call("POST", `/codes/${first.data.data.id}/revoke`)).status).toBe(200);
    expect((await call("POST", "/codes", { email: "client@example.test" })).status).toBe(201);
  });

  it("an expired or used code does not block a new one", async () => {
    store.addCode({ code: "WL-AAAA-AAAA", kind: "discount", customer_email: "a@example.test", expires_at: "2026-11-01T00:00:00.000Z" });
    store.addCode({ code: "WL-BBBB-BBBB", kind: "discount", customer_email: "b@example.test", used_count: 1 });
    expect((await call("POST", "/codes", { email: "a@example.test" })).status).toBe(201);
    expect((await call("POST", "/codes", { email: "b@example.test" })).status).toBe(201);
  });

  it("validates email and expiry", async () => {
    expect((await call("POST", "/codes", { email: "nope" })).status).toBe(400);
    expect((await call("POST", "/codes", { email: "c@example.test", expiresAt: "2026-11-23T10:00:00.000Z" })).status).toBe(400);
    expect((await call("POST", "/codes", { email: "c@example.test", expiresAt: "2028-01-01T00:00:00.000Z" })).status).toBe(400);
    expect((await call("POST", "/codes", { email: "c@example.test", expiresAt: "garbage" })).status).toBe(400);
    expect((await call("POST", "/codes", { email: "c@example.test", sendEmail: "yes" })).status).toBe(400);
    const custom = await call("POST", "/codes", { email: "c@example.test", expiresAt: "2026-12-31T22:59:59.000Z" });
    expect(custom.data.data.expiresAt).toBe("2026-12-31T22:59:59.000Z");
  });

  it("lists codes with status and product label, running the lazy PENDING expiry", async () => {
    const spy = vi.spyOn(store, "expirePendingOrders");
    store.addCode({ code: "WL-AAAA-AAAA", kind: "student", percent_off: null, product_slug: "bim-foundations-etudiant", customer_email: "s@example.test" });
    store.addCode({ code: "WL-BBBB-BBBB", kind: "discount", customer_email: "d@example.test", revoked_at: "2026-11-20T00:00:00.000Z" });
    const res = await call("GET", "/codes");
    expect(spy).toHaveBeenCalledWith("2026-11-24T09:15:00.000Z", NOW.toISOString());
    const byCode = Object.fromEntries(res.data.data.map((c: { code: string }) => [c.code, c]));
    expect(byCode["WL-AAAA-AAAA"]).toMatchObject({ status: "active", productLabel: "BIM Foundations Professional — Pack Étudiants" });
    expect(byCode["WL-BBBB-BBBB"]).toMatchObject({ status: "revoked", productLabel: null });
    expect((await call("GET", "/codes?kind=student")).data.data).toHaveLength(1);
  });

  it("revoke → logged; revoking twice → 409", async () => {
    const created = await call("POST", "/codes", { email: "client@example.test" });
    const res = await call("POST", `/codes/${created.data.data.id}/revoke`);
    expect(res.data.data).toMatchObject({ status: "revoked", revokedAt: NOW.toISOString() });
    expect(store.activity.map((a) => a.event_type)).toEqual(["code_created", "code_revoked"]);
    expect((await call("POST", `/codes/${created.data.data.id}/revoke`)).status).toBe(409);
    expect((await call("POST", "/codes/00000000-0000-4000-8000-000000000000/revoke")).status).toBe(404);
  });
});
