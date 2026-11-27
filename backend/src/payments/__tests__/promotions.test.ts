import { readFileSync } from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { priceOrder } from "../../commerce/codes";
import {
  promotionStatus,
  runningPromotion,
  type PromotionRecord,
} from "../../commerce/promotions";
import type { CodeRecord } from "../../commerce/types";
import { FakeMailer } from "../../commerce/__tests__/fakes";
import { computeHash, verifyCallbackHash } from "../cmi";
import { createPaymentsRouter } from "../router";
import {
  CONFIG,
  KEY,
  SITE,
  cmiBody,
  parseGatewayForm,
  request,
  startServer,
  type TestServer,
} from "./harness";
import { MemoryPaymentStore } from "./memoryStore";

/*
 * Promotion Black Friday (-25 % sur les 2 packs BIM) : fenetre en heure de
 * Casablanca, prix calcule cote serveur, non cumulable avec les codes de
 * reduction, Pack Etudiants toujours verrouille, montant fige dans la
 * commande (callback tardif), e-mails.
 *
 * Fin novembre 2026, Casablanca = UTC+1 (pas de Ramadan) :
 *   27/11/2026 00:00 Casablanca = 26/11/2026 23:00Z (debut, inclus)
 *   01/12/2026 00:00 Casablanca = 30/11/2026 23:00Z (fin, EXCLUE)
 */

const STARTS_AT = "2026-11-26T23:00:00.000Z";
const ENDS_AT = "2026-11-30T23:00:00.000Z";

const BEFORE = new Date("2026-11-26T22:59:59.999Z"); // 26/11 23:59:59.999 Casa
const FIRST_INSTANT = new Date(STARTS_AT); //            27/11 00:00:00 Casa
const UTC_DAY_BEFORE = new Date("2026-11-26T23:30:00.000Z"); // 27/11 00:30 Casa, 26/11 en UTC
const DURING = new Date("2026-11-28T10:00:00.000Z");
const LAST_SECOND = new Date("2026-11-30T22:59:59.000Z"); // 30/11 23:59:59 Casa
const END = new Date(ENDS_AT); //                       01/12 00:00:00 Casa
const UTC_SAME_DAY_AFTER = new Date("2026-11-30T23:30:00.000Z"); // 01/12 00:30 Casa, 30/11 en UTC

const PRO = "bim-foundations-pro";
const STUDENT = "bim-foundations-etudiant";
const TEST_PRODUCT = "test-paiement-cmi";
const EMAIL = "client@example.test";
const CONTACT = "contact@example.test";
const NBSP = " ";

const CHECKOUT: Record<string, string> = {
  formation_slug: PRO,
  customer_name: "Client Test",
  customer_email: EMAIL,
  customer_phone: "",
  cgv_accepted: "on",
};

const APPROVED = { ProcReturnCode: "00", Response: "Approved", TransId: "T-BF-1", AuthCode: "A1" };

function casablanca(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function promo(overrides: Partial<PromotionRecord> = {}): PromotionRecord {
  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    label: "Black Friday",
    percent_off: 25,
    starts_at: STARTS_AT,
    ends_at: ENDS_AT,
    active: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Fenetre (logique pure)
// ---------------------------------------------------------------------------

describe("promotion window (Africa/Casablanca)", () => {
  it("test instants are the intended Casablanca local times", () => {
    expect(casablanca(BEFORE)).toBe("26/11/2026 23:59:59");
    expect(casablanca(FIRST_INSTANT)).toBe("27/11/2026 00:00:00");
    expect(casablanca(UTC_DAY_BEFORE)).toBe("27/11/2026 00:30:00");
    expect(casablanca(LAST_SECOND)).toBe("30/11/2026 23:59:59");
    expect(casablanca(END)).toBe("01/12/2026 00:00:00");
    expect(casablanca(UTC_SAME_DAY_AFTER)).toBe("01/12/2026 00:30:00");
  });

  it("migration seeds exactly this window, computed by Postgres in Africa/Casablanca", () => {
    const sql = readFileSync(
      path.join(__dirname, "../../../migrations/20261127005000_promotions.sql"),
      "utf8",
    );
    expect(sql).toContain("timestamp '2026-11-27 00:00:00' at time zone 'Africa/Casablanca'");
    expect(sql).toContain("timestamp '2026-12-01 00:00:00' at time zone 'Africa/Casablanca'");
    expect(sql).toMatch(/'Black Friday',\s+25\.00,/);
    expect(sql).toContain("values ('bim-foundations-pro'), ('bim-foundations-etudiant')");
  });

  it.each([
    ["26/11 23:59:59.999 (before)", BEFORE, "scheduled"],
    ["27/11 00:00:00 (first instant)", FIRST_INSTANT, "running"],
    ["27/11 00:30 Casablanca, still 26/11 in UTC", UTC_DAY_BEFORE, "running"],
    ["28/11 (during)", DURING, "running"],
    ["30/11 23:59:59 (last second)", LAST_SECOND, "running"],
    ["01/12 00:00:00 (end, excluded)", END, "ended"],
    ["01/12 00:30 Casablanca, still 30/11 in UTC", UTC_SAME_DAY_AFTER, "ended"],
  ])("%s → %s", (_label, at, status) => {
    expect(promotionStatus(promo(), at)).toBe(status);
    expect(runningPromotion([promo()], at)).toEqual(status === "running" ? promo() : null);
  });

  it("deactivated → never running, even inside the window", () => {
    expect(promotionStatus(promo({ active: false }), DURING)).toBe("disabled");
    expect(runningPromotion([promo({ active: false })], DURING)).toBeNull();
  });

  it("overlapping promotions → the best percent for the customer; unusable percents ignored", () => {
    const ten = promo({ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", percent_off: 10 });
    const broken = promo({ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", percent_off: 100 });
    expect(runningPromotion([ten, promo(), broken], DURING)?.percent_off).toBe(25);
    expect(runningPromotion([broken], DURING)).toBeNull();
  });

  it("unreadable dates → ended (never running)", () => {
    expect(promotionStatus(promo({ ends_at: "not a date" }), DURING)).toBe("ended");
  });
});

// ---------------------------------------------------------------------------
// Prix (logique pure, centimes)
// ---------------------------------------------------------------------------

describe("priceOrder with a promotion", () => {
  const discountCode = { kind: "discount", percent_off: 5 } as CodeRecord;
  const studentCode = { kind: "student", percent_off: null } as CodeRecord;

  it("-25 %: 8 500 → 6 375 ; 5 000 → 3 750 ; 10 → 7,50", () => {
    expect(priceOrder(8500, null, promo())).toEqual({
      list_amount_mad: 8500,
      discount_mad: 2125,
      amount_mad: 6375,
    });
    expect(priceOrder(5000, studentCode, promo())).toEqual({
      list_amount_mad: 5000,
      discount_mad: 1250,
      amount_mad: 3750,
    });
    expect(priceOrder(10, null, promo())).toEqual({
      list_amount_mad: 10,
      discount_mad: 2.5,
      amount_mad: 7.5,
    });
  });

  it("never stacks: a discount code adds nothing to the promotion", () => {
    expect(priceOrder(8500, discountCode, promo()).amount_mad).toBe(6375);
    expect(priceOrder(8500, discountCode, null).amount_mad).toBe(8075);
  });
});

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

let store: MemoryPaymentStore;
let mailer: FakeMailer;
let server: TestServer;
let clock: Date;
let blackFriday: PromotionRecord;
let discount: CodeRecord;
let student: CodeRecord;

const post = (urlPath: string, options: Parameters<typeof request>[3]) =>
  request(server.base, "POST", urlPath, options);

function failure(reason: string): string {
  return `${SITE}/paiement/echec/?reason=${reason}`;
}

async function init(overrides: Record<string, string> = {}) {
  return post("/api/payments/cmi/init", { form: { ...CHECKOUT, ...overrides } });
}

async function initOk(overrides: Record<string, string> = {}) {
  const res = await init(overrides);
  expect(res.status, res.headers.location).toBe(200);
  const posted = parseGatewayForm(res.body);
  return { posted, oid: posted.oid, order: store.orders.get(posted.oid)! };
}

async function product(slug: string) {
  const res = await request(server.base, "GET", `/api/payments/products/${slug}`, {
    headers: { origin: SITE },
  });
  return { status: res.status, body: JSON.parse(res.body) as Record<string, unknown> };
}

async function checkCode(productSlug: string, code: string) {
  const res = await post("/api/payments/codes/check", {
    json: { product: productSlug, code, email: EMAIL },
    headers: { origin: SITE },
  });
  return { status: res.status, body: res.body };
}

async function callback(form: Record<string, string>) {
  return (await post("/api/payments/cmi/callback", { form })).body;
}

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({ slug: TEST_PRODUCT, label: "Test paiement CMI", amount_mad: 10 });
  store.addProduct({
    slug: PRO,
    label: "BIM Foundations Professional — Pack Professionnels",
    amount_mad: 8500,
    page_slug: "bim-foundations-professional",
  });
  store.addProduct({
    slug: STUDENT,
    label: "BIM Foundations Professional — Pack Étudiants",
    amount_mad: 5000,
    page_slug: "bim-foundations-professional",
    requires_student_code: true,
  });
  blackFriday = store.addPromotion({ starts_at: STARTS_AT, ends_at: ENDS_AT }, [PRO, STUDENT]);
  discount = store.addCode({ code: "WL-DSCT-AAAA", kind: "discount", customer_email: EMAIL });
  student = store.addCode({
    code: "WL-STUD-BBBB",
    kind: "student",
    percent_off: null,
    product_slug: STUDENT,
    customer_email: EMAIL,
  });
  mailer = new FakeMailer();
  clock = DURING;
  server = await startServer({
    payments: createPaymentsRouter({
      cmi: { enabled: true, config: CONFIG },
      store,
      now: () => clock,
      orderEmails: { mailer, contactRecipient: CONTACT },
    }),
  });
});

afterEach(async () => {
  vi.restoreAllMocks();
  await server.close();
});

describe("GET /products/:slug (runtime promotion for the static site)", () => {
  it("during the window → promo price, list price, discount, public promotion", async () => {
    expect(await product(PRO)).toEqual({
      status: 200,
      body: {
        slug: PRO,
        label: "BIM Foundations Professional — Pack Professionnels",
        amount_mad: 6375,
        list_amount_mad: 8500,
        discount_mad: 2125,
        requires_student_code: false,
        promotion: { label: "Black Friday", percent_off: 25, ends_at: ENDS_AT },
      },
    });
    expect((await product(STUDENT)).body).toMatchObject({
      amount_mad: 3750,
      list_amount_mad: 5000,
      discount_mad: 1250,
      requires_student_code: true,
    });
  });

  it.each([
    ["before the window", BEFORE],
    ["at the end instant", END],
    ["after the window", UTC_SAME_DAY_AFTER],
  ])("%s → catalogue price, promotion null (no deploy needed)", async (_label, at) => {
    clock = at;
    expect((await product(PRO)).body).toMatchObject({
      amount_mad: 8500,
      list_amount_mad: 8500,
      discount_mad: 0,
      promotion: null,
    });
  });

  it("deactivated early → catalogue price immediately", async () => {
    store.promotions.get(blackFriday.id)!.active = false;
    expect((await product(PRO)).body).toMatchObject({ amount_mad: 8500, promotion: null });
  });

  it("product not linked to the promotion → catalogue price", async () => {
    expect((await product(TEST_PRODUCT)).body).toMatchObject({ amount_mad: 10, promotion: null });
  });

  it("promotions unreadable → 500, never a wrong price", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.findPromotions = true;
    expect((await product(PRO)).status).toBe(500);
  });
});

describe("POST /codes/check during the promotion (no stacking)", () => {
  it("5 % code → { valid: false, reason: not_cumulative }; code untouched", async () => {
    expect(await checkCode(PRO, "WL-DSCT-AAAA")).toEqual({
      status: 200,
      body: '{"valid":false,"reason":"not_cumulative"}',
    });
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("an invalid code is still just { valid: false } (no reason)", async () => {
    expect((await checkCode(PRO, "WL-ZZZZ-ZZZZ")).body).toBe('{"valid":false}');
  });

  it("same 5 % code after the window → valid again, 8 075", async () => {
    clock = END;
    expect(JSON.parse((await checkCode(PRO, "WL-DSCT-AAAA")).body)).toEqual({
      valid: true,
      amount_mad: 8075,
      list_amount_mad: 8500,
      discount_mad: 425,
      promotion: null,
    });
  });

  it("student code on the student pack → promo price 3 750", async () => {
    expect(JSON.parse((await checkCode(STUDENT, "WL-STUD-BBBB")).body)).toEqual({
      valid: true,
      amount_mad: 3750,
      list_amount_mad: 5000,
      discount_mad: 1250,
      promotion: { label: "Black Friday", percent_off: 25, ends_at: ENDS_AT },
    });
  });
});

describe("POST /cmi/init: server-side promo price", () => {
  it("Pack Professionnels during the window → 6375.00 sent to CMI, hash valid, order audited", async () => {
    const { posted, oid, order } = await initOk();

    expect(posted.amount).toBe("6375.00");
    const { HASH, ...signed } = posted;
    expect(HASH).toBe(computeHash(signed, KEY));
    expect(verifyCallbackHash(posted, KEY)).toBe(true);

    expect(order).toMatchObject({
      oid,
      amount_mad: 6375,
      list_amount_mad: 8500,
      discount_mad: 2125,
      promotion_id: blackFriday.id,
      code_id: null,
      status: "PENDING",
    });
  });

  it("ignores any price or promo field posted by the browser", async () => {
    const { posted, order } = await initOk({
      amount: "1.00",
      amount_mad: "1",
      promotion_id: "11111111-1111-4111-8111-111111111111",
      promo: "BLACKFRIDAY",
    });
    expect(posted.amount).toBe("6375.00");
    expect(order.promotion_id).toBe(blackFriday.id);
  });

  it.each([
    ["26/11 23:59:59.999 (before)", BEFORE, "8500.00"],
    ["27/11 00:00:00 (first instant)", FIRST_INSTANT, "6375.00"],
    ["27/11 00:30 Casablanca (26/11 in UTC)", UTC_DAY_BEFORE, "6375.00"],
    ["30/11 23:59:59 (last second)", LAST_SECOND, "6375.00"],
    ["01/12 00:00:00 (end, excluded)", END, "8500.00"],
    ["01/12 00:30 Casablanca (30/11 in UTC)", UTC_SAME_DAY_AFTER, "8500.00"],
  ])("%s → amount %s", async (_label, at, amount) => {
    clock = at;
    const { posted, order } = await initOk();
    expect(posted.amount).toBe(amount);
    expect(order.promotion_id).toBe(amount === "6375.00" ? blackFriday.id : null);
    expect(order.amount_mad).toBe(order.list_amount_mad - order.discount_mad);
  });

  it("5 % code during the window → echec?reason=code_not_cumulative, no order, code not consumed", async () => {
    const res = await init({ code: "WL-DSCT-AAAA" });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(failure("code_not_cumulative"));
    expect(store.orders.size).toBe(0);
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("5 % code after the window → 8075.00 as before", async () => {
    clock = END;
    const { posted, order } = await initOk({ code: "WL-DSCT-AAAA" });
    expect(posted.amount).toBe("8075.00");
    expect(order).toMatchObject({ code_id: discount.id, promotion_id: null, discount_mad: 425 });
  });

  it("Pack Étudiants without a code during the window → still locked (code_required)", async () => {
    const res = await init({ formation_slug: STUDENT });
    expect(res.headers.location).toBe(failure("code_required"));
    expect(store.orders.size).toBe(0);
  });

  it("Pack Étudiants with a 5 % code during the window → still locked (code_invalid)", async () => {
    const res = await init({ formation_slug: STUDENT, code: "WL-DSCT-AAAA" });
    expect(res.headers.location).toBe(failure("code_invalid"));
    expect(store.orders.size).toBe(0);
  });

  it("Pack Étudiants with the student code → 3750.00, student code kept, promotion recorded", async () => {
    const { posted, order } = await initOk({ formation_slug: STUDENT, code: "WL-STUD-BBBB" });
    expect(posted.amount).toBe("3750.00");
    expect(order).toMatchObject({
      amount_mad: 3750,
      list_amount_mad: 5000,
      discount_mad: 1250,
      code_id: student.id,
      promotion_id: blackFriday.id,
    });
  });

  it("promotions unreadable → echec?reason=error, no order, nothing charged", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.findPromotions = true;
    const res = await init();
    expect(res.headers.location).toBe(failure("error"));
    expect(store.orders.size).toBe(0);
  });
});

describe("callback: the amount is the order's, never the current promotion's", () => {
  it("order created on 30/11 23:59:59, callback after the end → promo amount accepted, PAID", async () => {
    clock = LAST_SECOND;
    const { posted, oid } = await initOk();
    clock = new Date(END.getTime() + 10 * 60 * 1000); // 01/12 00:10 Casablanca

    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)).toMatchObject({ status: "PAID", amount_mad: 6375 });
  });

  it("same late order, callback claiming today's price (8500.00) → FAILURE, stays PENDING", async () => {
    clock = LAST_SECOND;
    const { posted, oid } = await initOk();
    clock = new Date(END.getTime() + 10 * 60 * 1000);

    expect(await callback(cmiBody({ ...posted, amount: "8500.00" }, APPROVED))).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
  });

  it("promotion deactivated between init and callback → promo order still PAID at its amount", async () => {
    const { posted, oid } = await initOk();
    store.promotions.get(blackFriday.id)!.active = false;

    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)?.status).toBe("PAID");
  });

  it("order created after the window → catalogue amount, PAID, no promotion", async () => {
    clock = new Date(END.getTime() + 60 * 60 * 1000);
    const { posted, oid } = await initOk();
    expect(posted.amount).toBe("8500.00");

    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)).toMatchObject({
      status: "PAID",
      amount_mad: 8500,
      discount_mad: 0,
      promotion_id: null,
    });
  });

  it("student promo order → PAID, student code consumed", async () => {
    const { posted, oid } = await initOk({ formation_slug: STUDENT, code: "WL-STUD-BBBB" });
    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)?.status).toBe("PAID");
    expect(store.codes.get(student.id)!.used_count).toBe(1);
  });
});

describe("paid-order e-mails show the promotion discount line", () => {
  async function paidPromoOrder(overrides: Record<string, string> = {}) {
    const { posted } = await initOk(overrides);
    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));
    const customer = mailer.sent.find((message) => message.to === EMAIL)!;
    const team = mailer.sent.find((message) => message.to === CONTACT)!;
    return { customer, team };
  }

  it("Pack Professionnels: customer and team e-mails", async () => {
    const { customer, team } = await paidPromoOrder();

    expect(customer.text).toContain(`Montant payé : 6${NBSP}375,00 MAD TTC`);
    expect(customer.text).toContain(
      `Prix catalogue : 8${NBSP}500,00 MAD TTC — Réduction Black Friday (−25${NBSP}%) : −2${NBSP}125,00 MAD`,
    );
    expect(team.text).toContain(`Prix catalogue : 8${NBSP}500,00 MAD TTC`);
    expect(team.text).toContain(`Réduction : −2${NBSP}125,00 MAD — Black Friday (−25${NBSP}%)`);
    expect(team.text).toContain(`Montant payé : 6${NBSP}375,00 MAD TTC`);
    expect(team.subject).toContain(`6${NBSP}375,00 MAD`);
    // Pas de code : pas de ligne « Code ».
    expect(team.text).not.toMatch(/^Code :/m);
  });

  it("Pack Étudiants: promotion line + student code row", async () => {
    const { customer, team } = await paidPromoOrder({ formation_slug: STUDENT, code: "WL-STUD-BBBB" });
    expect(customer.text).toContain(
      `Prix catalogue : 5${NBSP}000,00 MAD TTC — Réduction Black Friday (−25${NBSP}%) : −1${NBSP}250,00 MAD`,
    );
    expect(team.text).toContain(`Réduction : −1${NBSP}250,00 MAD — Black Friday (−25${NBSP}%)`);
    expect(team.text).toContain("Code : WL-STUD-BBBB");
  });

  it("promotion deactivated before the callback → e-mail still shows the order's discount", async () => {
    const { posted } = await initOk();
    store.promotions.get(blackFriday.id)!.active = false;
    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    await vi.waitFor(() => expect(mailer.sent).toHaveLength(2));
    expect(mailer.sent.find((message) => message.to === EMAIL)!.text).toContain(
      `Réduction Black Friday (−25${NBSP}%) : −2${NBSP}125,00 MAD`,
    );
  });
});
