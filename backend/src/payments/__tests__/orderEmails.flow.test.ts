import { Router, type NextFunction, type Request, type Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import type { MailMessage, Mailer } from "../../lib/mailer";
import { createPaymentsRouter } from "../router";
import {
  CONFIG,
  cmiBody,
  parseGatewayForm,
  request,
  startServer,
  type HttpResult,
  type TestServer,
} from "./harness";
import { MemoryPaymentStore } from "./memoryStore";

/*
 * E-mails de commande payee, de bout en bout (routeur reel, store en
 * memoire, mailer factice) : envoyes une seule fois, uniquement sur le
 * passage PENDING -> PAID, toujours APRES la reponse au CMI, sans jamais
 * la modifier.
 */

const CLOCK = new Date("2026-11-24T10:00:00.000Z");
const CONTACT = "contact@example.test";
const NAME = "Éric Benjelloun";
const EMAIL = "eric@example.test";
const PHONE = "+212 600 000 000";

const CHECKOUT: Record<string, string> = {
  formation_slug: "test-paiement-cmi",
  customer_name: NAME,
  customer_email: EMAIL,
  customer_phone: PHONE,
  cgv_accepted: "on",
  access_choice: "immediate",
};

const APPROVED = { ProcReturnCode: "00", Response: "Approved", TransId: "T-0001", AuthCode: "A1" };
const DECLINED = { ProcReturnCode: "05", Response: "Declined", TransId: "T-0002" };

type MailMode = "ok" | "reject" | "throw" | "hang";

/** Mailer scriptable ; journalise chaque tentative dans `timeline`. */
class ScriptedMailer implements Mailer {
  readonly sent: MailMessage[] = [];
  mode: MailMode = "ok";
  readonly failFor = new Set<string>();

  constructor(private readonly timeline: string[]) {}

  send(message: MailMessage): Promise<void> {
    this.timeline.push(`mail ${message.to}`);
    if (this.mode === "throw") {
      // Levee SYNCHRONE (pas une promesse rejetee).
      throw Object.assign(new Error(`boom for ${message.to}`), { code: "EBOOM" });
    }
    if (this.mode === "hang") {
      return new Promise<void>(() => undefined);
    }
    if (this.mode === "reject" || this.failFor.has(message.to)) {
      return Promise.reject(
        Object.assign(new Error(`550 mailbox ${message.to} refused`), {
          code: "EAUTH",
          responseCode: 535,
        }),
      );
    }
    this.sent.push(message);
    return Promise.resolve();
  }
}

/** Note dans `timeline` le moment ou la reponse HTTP est remise a Node. */
function recordReplies(timeline: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const end = res.end as (...args: unknown[]) => Response;
    res.end = function (this: Response, ...args: unknown[]) {
      timeline.push(`reply ${req.path}`);
      return end.apply(this, args);
    } as Response["end"];
    next();
  };
}

let store: MemoryPaymentStore;
let mailer: ScriptedMailer;
let timeline: string[];
let server: TestServer;
let errors: MockInstance<typeof console.error>;
let warns: MockInstance<typeof console.warn>;

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({ slug: "test-paiement-cmi", label: "Test paiement CMI", amount_mad: 10 });
  store.addProduct({
    slug: "bim-foundations-pro",
    label: "BIM Foundations Professional — Pack Professionnels",
    amount_mad: 8500,
    page_slug: "bim-foundations-professional",
  });
  store.addProduct({
    slug: "bim-foundations-etudiant",
    label: "BIM Foundations Professional — Pack Étudiants",
    amount_mad: 5000,
    page_slug: "bim-foundations-professional",
    requires_student_code: true,
  });
  store.addCode({ code: "WL-DSCT-AAAA", kind: "discount", customer_email: EMAIL });
  store.addCode({
    code: "WL-STUD-BBBB",
    kind: "student",
    customer_email: EMAIL,
    product_slug: "bim-foundations-etudiant",
  });

  timeline = [];
  mailer = new ScriptedMailer(timeline);
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
  warns = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  const payments = Router();
  payments.use(recordReplies(timeline));
  payments.use(
    createPaymentsRouter({
      cmi: { enabled: true, config: CONFIG },
      store,
      now: () => CLOCK,
      orderEmails: { mailer, contactRecipient: CONTACT },
    }),
  );
  server = await startServer({ payments });
});

afterEach(async () => {
  vi.restoreAllMocks();
  await server.close();
});

async function initOrder(overrides: Record<string, string> = {}) {
  const res = await request(server.base, "POST", "/api/payments/cmi/init", {
    form: { ...CHECKOUT, ...overrides },
  });
  expect(res.status, res.headers.location).toBe(200);
  const posted = parseGatewayForm(res.body);
  return { posted, oid: posted.oid };
}

function callback(form: Record<string, string>): Promise<HttpResult> {
  return request(server.base, "POST", "/api/payments/cmi/callback", { form });
}

/** Laisse s'executer tout travail differe (setImmediate + promesses). */
async function settle(): Promise<void> {
  for (let i = 0; i < 5; i += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
  await new Promise((resolve) => setTimeout(resolve, 25));
}

/** Paye une commande et attend ses 2 e-mails ; remet le mailer a zero. */
async function paidOrder(overrides: Record<string, string> = {}) {
  const order = await initOrder(overrides);
  const res = await callback(cmiBody(order.posted, APPROVED));
  expect(res.body).toBe("ACTION=POSTAUTH");
  await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));
  await settle();
  mailer.sent.length = 0;
  timeline.length = 0;
  return order;
}

function allLogs(): string {
  return [...errors.mock.calls, ...warns.mock.calls].map((args) => args.join(" ")).join("\n");
}

function expectNoCustomerDataInLogs(): void {
  const logs = allLogs();
  for (const value of [EMAIL, NAME, PHONE, "Benjelloun"]) {
    expect(logs).not.toContain(value);
  }
}

describe("PENDING → PAID", () => {
  it("sends both e-mails exactly once, after the CMI reply, and timestamps them", async () => {
    const { posted, oid } = await initOrder();
    timeline.length = 0;

    const res = await callback(cmiBody(posted, APPROVED));

    expect(res.status).toBe(200);
    expect(res.body).toBe("ACTION=POSTAUTH");
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));
    await settle();

    expect(mailer.sent).toHaveLength(2);
    expect(timeline).toEqual(["reply /cmi/callback", `mail ${EMAIL}`, `mail ${CONTACT}`]);

    const [customer, team] = mailer.sent;
    expect(customer).toMatchObject({
      to: EMAIL,
      replyTo: CONTACT,
      subject: "[TEST] Confirmation de votre paiement — Welearn",
    });
    expect(team).toMatchObject({
      to: CONTACT,
      replyTo: EMAIL,
      subject: `[TEST] [Commande payée] Test paiement CMI — 10,00 MAD — ${oid}`,
    });
    expect(customer.text).toContain(`Référence de commande : ${oid}`);
    expect(customer.text).toContain("Date du paiement : 24/11/2026 11:00");
    expect(team.text).toContain("TransId CMI : T-0001");
    expect(team.text).toContain("Code d'autorisation : A1");

    expect(store.orders.get(oid)).toMatchObject({
      status: "PAID",
      confirmation_email_sent_at: CLOCK.toISOString(),
      team_notified_at: CLOCK.toISOString(),
    });
    expect(errors).not.toHaveBeenCalled();
  });

  it("discounted order: label, amounts and code read from the database; no [TEST] prefix", async () => {
    const { posted, oid } = await initOrder({
      formation_slug: "bim-foundations-pro",
      code: "WL-DSCT-AAAA",
    });
    await callback(cmiBody(posted, APPROVED));
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));

    const [customer, team] = mailer.sent;
    expect(customer.subject).toBe("Confirmation de votre paiement — Welearn");
    expect(customer.text).toContain(
      "Formation : BIM Foundations Professional — Pack Professionnels",
    );
    expect(customer.text).toContain(
      "Prix catalogue : 8 500,00 MAD TTC — Réduction : −425,00 MAD",
    );
    expect(customer.text).toContain("Montant payé : 8 075,00 MAD TTC");
    expect(team.subject).toBe(
      `[Commande payée] BIM Foundations Professional — Pack Professionnels — 8 075,00 MAD — ${oid}`,
    );
    expect(team.text).toContain("Code : WL-DSCT-AAAA");
    expect(team.text).toContain("Réduction : −425,00 MAD");
  });

  it("student code, after_withdrawal: no discount block, Code row, opening date", async () => {
    const { posted } = await initOrder({
      formation_slug: "bim-foundations-etudiant",
      code: "WL-STUD-BBBB",
      access_choice: "after_withdrawal",
    });
    await callback(cmiBody(posted, APPROVED));
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));

    const [customer, team] = mailer.sent;
    expect(customer.text).not.toContain("Prix catalogue");
    expect(customer.text).toContain("à partir du 01/12/2026");
    expect(team.text).toContain("Code : WL-STUD-BBBB");
    expect(team.text).toContain("Réduction : aucune");
    expect(team.text).toContain("Ouvrir l'accès : à partir du 01/12/2026");
  });
});

describe("no e-mail outside the PENDING → PAID transition", () => {
  it("retry of a PAID order (same TransId) → POSTAUTH, no e-mail", async () => {
    const { posted } = await paidOrder();

    const res = await callback(cmiBody(posted, APPROVED));
    await settle();

    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(timeline).toEqual(["reply /cmi/callback"]);
  });

  it("DUPLICATE_APPROVAL → APPROVED, no e-mail", async () => {
    const { posted } = await paidOrder();

    const res = await callback(cmiBody(posted, { ...APPROVED, TransId: "T-9999" }));
    await settle();

    expect(res.body).toBe("APPROVED");
    expect(timeline).toEqual(["reply /cmi/callback"]);
    expect(warns).toHaveBeenCalledWith(expect.stringContaining("DUPLICATE_APPROVAL"));
  });

  it("non-00 → APPROVED, no e-mail (PENDING and PAID orders)", async () => {
    const pending = await initOrder();
    const onPending = await callback(cmiBody(pending.posted, DECLINED));
    const paid = await paidOrder();
    const onPaid = await callback(cmiBody(paid.posted, DECLINED));
    await settle();

    expect(onPending.body).toBe("APPROVED");
    expect(store.orders.get(pending.oid)?.status).toBe("PENDING");
    expect(onPaid.body).toBe("APPROVED");
    expect(mailer.sent).toHaveLength(0);
    expect(timeline).toEqual(["reply /cmi/callback"]);
  });

  it("bad hash → FAILURE, no e-mail", async () => {
    const { posted, oid } = await initOrder();

    const res = await callback({ ...cmiBody(posted, APPROVED), HASH: "bm90IHRoZSByaWdodCBoYXNo" });
    await settle();

    expect(res.body).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
    expect(mailer.sent).toHaveLength(0);
  });

  it("amount mismatch → FAILURE, no e-mail", async () => {
    const { posted, oid } = await initOrder();

    const res = await callback(cmiBody(posted, { ...APPROVED, amount: "11.00" }));
    await settle();

    expect(res.body).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
    expect(mailer.sent).toHaveLength(0);
  });

  it("lost race (another callback made the transition) → POSTAUTH, no e-mail from this request", async () => {
    const { posted, oid } = await initOrder();
    // Le gagnant a fait une mise a jour COMPLETE (commande prete pour les
    // e-mails) : seul le drapeau de transition peut empecher l'envoi ici.
    vi.spyOn(store, "markOrderPaid").mockImplementationOnce(async () => {
      Object.assign(store.orders.get(oid)!, {
        status: "PAID",
        paid_at: CLOCK.toISOString(),
        access_available_at: CLOCK.toISOString(),
        cmi_trans_id: APPROVED.TransId,
        cmi_auth_code: APPROVED.AuthCode,
      });
      return false;
    });

    const res = await callback(cmiBody(posted, APPROVED));
    await settle();

    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(mailer.sent).toHaveLength(0);
    expect(timeline).toEqual(["reply /cmi/init", "reply /cmi/callback"]);
    expect(errors).not.toHaveBeenCalled();
  });

  it("CANCELLED order + 00 → FAILURE, no e-mail", async () => {
    const { posted, oid } = await initOrder();
    store.orders.get(oid)!.status = "CANCELLED";

    const res = await callback(cmiBody(posted, APPROVED));
    await settle();

    expect(res.body).toBe("FAILURE");
    expect(mailer.sent).toHaveLength(0);
  });
});

describe("the CMI reply never depends on the mailer", () => {
  it("identical reply, event and order whether the mailer succeeds, rejects, throws or hangs", async () => {
    const outcomes: Record<string, unknown> = {};

    for (const mode of ["ok", "reject", "throw", "hang"] as const) {
      mailer.mode = mode;
      const { posted, oid } = await initOrder();
      timeline.length = 0;

      const res = await callback(cmiBody(posted, APPROVED));
      await settle();

      // La reponse est remise a Node AVANT toute tentative d'envoi.
      expect(timeline[0], mode).toBe("reply /cmi/callback");
      expect(timeline.slice(1), mode).toEqual([`mail ${EMAIL}`, `mail ${CONTACT}`]);

      const order = store.orders.get(oid)!;
      const callbacks = store.events.filter((e) => e.oid === oid && e.source === "callback");
      const event = callbacks[callbacks.length - 1];
      outcomes[mode] = {
        status: res.status,
        contentType: res.headers["content-type"],
        contentLength: res.headers["content-length"],
        etag: res.headers.etag,
        body: res.body,
        eventReply: event.reply,
        eventHashValid: event.hash_valid,
        orderStatus: order.status,
        paidAt: order.paid_at,
        accessAvailableAt: order.access_available_at,
        transId: order.cmi_trans_id,
        authCode: order.cmi_auth_code,
      };
    }

    expect(outcomes.ok).toMatchObject({ status: 200, body: "ACTION=POSTAUTH", orderStatus: "PAID" });
    expect(outcomes.reject).toEqual(outcomes.ok);
    expect(outcomes.throw).toEqual(outcomes.ok);
    expect(outcomes.hang).toEqual(outcomes.ok);
    expectNoCustomerDataInLogs();
  });
});

describe("timestamps and logs", () => {
  it("*_sent_at set only for the e-mail that was sent; failure logged with code and oid only", async () => {
    mailer.failFor.add(EMAIL);
    const first = await initOrder();
    await callback(cmiBody(first.posted, APPROVED));
    await vi.waitFor(() => expect(store.orders.get(first.oid)?.team_notified_at).not.toBeNull());
    await settle();

    expect(store.orders.get(first.oid)).toMatchObject({
      confirmation_email_sent_at: null,
      team_notified_at: CLOCK.toISOString(),
    });
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-confirmation not sent: EAUTH smtp 535 oid=${first.oid}`,
    );

    mailer.failFor.clear();
    mailer.failFor.add(CONTACT);
    const second = await initOrder();
    await callback(cmiBody(second.posted, APPROVED));
    await vi.waitFor(() =>
      expect(store.orders.get(second.oid)?.confirmation_email_sent_at).not.toBeNull(),
    );
    await settle();

    expect(store.orders.get(second.oid)).toMatchObject({
      confirmation_email_sent_at: CLOCK.toISOString(),
      team_notified_at: null,
    });
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-team-notify not sent: EAUTH smtp 535 oid=${second.oid}`,
    );

    mailer.failFor.clear();
    mailer.mode = "reject";
    const third = await initOrder();
    await callback(cmiBody(third.posted, APPROVED));
    await settle();

    expect(store.orders.get(third.oid)).toMatchObject({
      status: "PAID",
      confirmation_email_sent_at: null,
      team_notified_at: null,
    });
    expectNoCustomerDataInLogs();
  });

  it("timestamp update failure: e-mails still sent, 'sent but not recorded' logged", async () => {
    store.fail.markOrderEmailSent = true;
    const { posted, oid } = await initOrder();

    const res = await callback(cmiBody(posted, APPROVED));
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));
    await settle();

    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)).toMatchObject({
      status: "PAID",
      confirmation_email_sent_at: null,
      team_notified_at: null,
    });
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-confirmation sent but not recorded: unknown error oid=${oid}`,
    );
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-team-notify sent but not recorded: unknown error oid=${oid}`,
    );
  });

  it("order lookup failure after the reply: nothing sent, both logged, reply unchanged", async () => {
    store.fail.findOrderDetails = true;
    const { posted, oid } = await initOrder();

    const res = await callback(cmiBody(posted, APPROVED));
    await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(2));
    await settle();

    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)?.status).toBe("PAID");
    expect(mailer.sent).toHaveLength(0);
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-confirmation not sent: order lookup failed (unknown error) oid=${oid}`,
    );
    expect(errors).toHaveBeenCalledWith(
      `[mail] order-team-notify not sent: order lookup failed (unknown error) oid=${oid}`,
    );
  });
});
