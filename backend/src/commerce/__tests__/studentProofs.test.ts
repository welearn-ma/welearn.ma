import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryPaymentStore } from "../../payments/__tests__/memoryStore";
import { multipart, request, SITE, startServer, type TestServer } from "../../payments/__tests__/harness";
import { createStudentProofsRouter } from "../studentProofs";
import { FakeMailer, JPEG_BYTES, MemoryProofFiles, PDF_BYTES, PNG_BYTES } from "./fakes";

const ID = "0f8fad5b-d9cb-469f-a165-70867728950e";
const NOTIFY = "contact@example.test";
const FIELDS: Record<string, string> = {
  full_name: "Salma El Idrissi",
  email: "Salma.Student@Example.TEST",
  phone: "+212 600  000 000",
  page_slug: "bim-foundations-professional",
  consent: "on",
  website: "",
  elapsed_ms: "15000",
};

let store: MemoryPaymentStore;
let files: MemoryProofFiles;
let mailer: FakeMailer;
let server: TestServer;

function upload(
  fields: Record<string, string> = FIELDS,
  file: Parameters<typeof multipart>[1] | null = { name: "carte.pdf", type: "application/pdf", bytes: PDF_BYTES },
  headers: Record<string, string> = { origin: SITE },
) {
  return request(server.base, "POST", "/api/students/proofs", {
    raw: multipart(fields, file ?? undefined),
    headers,
  });
}

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({
    slug: "bim-foundations-etudiant",
    amount_mad: 5000,
    page_slug: "bim-foundations-professional",
    requires_student_code: true,
    active: false, // inactif avant activation : le depot reste possible
  });
  files = new MemoryProofFiles();
  mailer = new FakeMailer();
  server = await startServer({
    afterCors: [
      [
        "/api/students",
        createStudentProofsRouter({ store, files, mailer, notifyRecipient: NOTIFY, newId: () => ID }),
      ],
    ],
  });
});

afterEach(async () => {
  vi.restoreAllMocks();
  await server.close();
});

describe("POST /api/students/proofs", () => {
  it("stores the file privately, creates the row, emails the student and the team", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const res = await upload();
    expect(res.status).toBe(201);
    expect(JSON.parse(res.body)).toEqual({ ok: true });

    expect([...files.objects.keys()]).toEqual([`${ID}.pdf`]);
    expect(files.objects.get(`${ID}.pdf`)!.mime).toBe("application/pdf");
    expect(store.proofs.get(ID)).toMatchObject({
      full_name: "Salma El Idrissi",
      email: "salma.student@example.test",
      phone: "+212 600 000 000",
      page_slug: "bim-foundations-professional",
      file_path: `${ID}.pdf`,
      file_mime: "application/pdf",
      file_size: PDF_BYTES.length,
      status: "PENDING",
    });

    expect(mailer.sent.map((mail) => mail.to).sort()).toEqual([NOTIFY, "salma.student@example.test"]);
    const ack = mailer.sent.find((mail) => mail.to !== NOTIFY)!;
    expect(ack.text).toContain("Nous avons bien reçu votre justificatif. Il sera examiné par notre équipe.");
    for (const mail of mailer.sent) {
      // Jamais le document, son chemin ni une URL de fichier.
      expect(JSON.stringify(mail)).not.toContain(ID);
      expect(JSON.stringify(mail)).not.toMatch(/storage|signed|\.pdf/i);
    }
  });

  it.each([
    ["PNG", { name: "carte.png", type: "image/png", bytes: PNG_BYTES }, "png"],
    ["JPEG", { name: "carte.jpg", type: "image/jpeg", bytes: JPEG_BYTES }, "jpg"],
    ["JPEG declared image/jpg", { name: "carte.jpg", type: "image/jpg", bytes: JPEG_BYTES }, "jpg"],
  ])("accepts %s", async (_label, file, ext) => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const res = await upload(FIELDS, file);
    expect(res.status).toBe(201);
    expect(store.proofs.get(ID)!.file_path).toBe(`${ID}.${ext}`);
  });

  it.each([
    ["declared PDF but PNG bytes", { name: "x.pdf", type: "application/pdf", bytes: PNG_BYTES }],
    ["declared PNG but PDF bytes", { name: "x.png", type: "image/png", bytes: PDF_BYTES }],
    ["HTML renamed .pdf", { name: "x.pdf", type: "application/pdf", bytes: Buffer.from("<html><script>alert(1)</script>") }],
    ["unsupported type", { name: "x.txt", type: "text/plain", bytes: Buffer.from("hello") }],
    ["GIF", { name: "x.gif", type: "image/gif", bytes: Buffer.from("GIF89a....") }],
  ])("refuses %s (type + magic bytes)", async (_label, file) => {
    const res = await upload(FIELDS, file);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, message: "Formats acceptés : PDF, JPG ou PNG." });
    expect(files.objects.size).toBe(0);
    expect(store.proofs.size).toBe(0);
  });

  it("refuses files over 5 MB", async () => {
    const big = Buffer.concat([PDF_BYTES, Buffer.alloc(5 * 1024 * 1024)]);
    const res = await upload(FIELDS, { name: "big.pdf", type: "application/pdf", bytes: big });
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).message).toBe("Le fichier ne doit pas dépasser 5 Mo.");
    expect(files.objects.size).toBe(0);
  });

  it("accepts a file of exactly 5 MB", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const exact = Buffer.concat([PDF_BYTES, Buffer.alloc(5 * 1024 * 1024 - PDF_BYTES.length)]);
    expect((await upload(FIELDS, { name: "ok.pdf", type: "application/pdf", bytes: exact })).status).toBe(201);
  });

  it.each([
    ["no file", FIELDS, null, "Merci de joindre votre justificatif."],
    ["empty file", FIELDS, { name: "e.pdf", type: "application/pdf", bytes: Buffer.alloc(0) }, "Merci de joindre votre justificatif."],
    ["missing consent", { ...FIELDS, consent: "" }, undefined, "Merci d'accepter le traitement de votre justificatif."],
    ["missing name", { ...FIELDS, full_name: "  " }, undefined, "Merci de renseigner votre nom et prénom."],
    ["invalid email", { ...FIELDS, email: "nope" }, undefined, "Merci de saisir une adresse e-mail valide."],
    ["email over 64", { ...FIELDS, email: `${"a".repeat(60)}@x.ma` }, undefined, "Merci de saisir une adresse e-mail valide."],
    ["invalid phone", { ...FIELDS, phone: "abc" }, undefined, "Merci de saisir un numéro de téléphone valide."],
    ["unknown formation", { ...FIELDS, page_slug: "autre-formation" }, undefined, "Formation inconnue."],
  ])("refuses %s", async (_label, fields, file, message) => {
    const res = await upload(fields, file === undefined ? undefined : file);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, message });
    expect(store.proofs.size).toBe(0);
    expect(mailer.sent).toHaveLength(0);
  });

  it("refuses a second file field", async () => {
    const body = multipart(FIELDS, { field: "other", name: "x.pdf", type: "application/pdf", bytes: PDF_BYTES });
    const res = await request(server.base, "POST", "/api/students/proofs", { raw: body });
    expect(res.status).toBe(400);
    expect(files.objects.size).toBe(0);
  });

  it("honeypot filled → fake success, nothing stored or sent", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const res = await upload({ ...FIELDS, website: "https://spam.example" });
    expect(res.status).toBe(201);
    expect(files.objects.size + store.proofs.size + mailer.sent.length).toBe(0);
  });

  it("time trap (< 3 s) → fake success, nothing stored or sent", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const res = await upload({ ...FIELDS, elapsed_ms: "800" });
    expect(res.status).toBe(201);
    expect(files.objects.size + store.proofs.size + mailer.sent.length).toBe(0);
  });

  it("database failure → 500 and the uploaded file is removed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.insertStudentProof = true;
    const res = await upload();
    expect(res.status).toBe(500);
    expect(files.objects.size).toBe(0);
    expect(mailer.sent).toHaveLength(0);
  });

  it("an SMTP failure does not fail the submission and logs no address", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mailer.failing = true;
    const res = await upload();
    expect(res.status).toBe(201);
    expect(store.proofs.size).toBe(1);
    const logged = errorLog.mock.calls.flat().join(" ");
    expect(logged).toContain("ECONNECTION");
    expect(logged).not.toContain("@");
  });

  it("rate limit: 5 uploads per IP per hour, then 429", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    let counter = 0;
    await server.close();
    server = await startServer({
      afterCors: [
        [
          "/api/students",
          createStudentProofsRouter({
            store,
            files,
            mailer,
            notifyRecipient: NOTIFY,
            newId: () => `0f8fad5b-d9cb-469f-a165-7086772895${String(counter++).padStart(2, "0")}`,
          }),
        ],
      ],
    });
    const headers = { origin: SITE, "x-forwarded-for": "203.0.113.20" };
    for (let i = 0; i < 5; i += 1) {
      expect((await upload(FIELDS, undefined, headers)).status).toBe(201);
    }
    const limited = await upload(FIELDS, undefined, headers);
    expect(limited.status).toBe(429);
    expect(JSON.parse(limited.body).ok).toBe(false);
    expect(store.proofs.size).toBe(5);
  });
});
