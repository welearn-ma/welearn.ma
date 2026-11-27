import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CodeRecord } from "../../commerce/types";
import { FORBIDDEN_EMAILS, PLUS_TAG_EMAIL } from "../../lib/__tests__/emailSamples";
import { expireStalePendingOrders, startPendingExpiryTimer } from "../expiry";
import { createPaymentsRouter } from "../router";
import {
  CONFIG,
  SITE,
  cmiBody,
  parseGatewayForm,
  request,
  startServer,
  type TestServer,
} from "./harness";
import { MemoryPaymentStore } from "./memoryStore";

const CREATED_AT = new Date("2026-11-24T10:00:00.000Z");
const PRO = "bim-foundations-pro";
const STUDENT = "bim-foundations-etudiant";
const EMAIL = "client@example.test";

const CHECKOUT: Record<string, string> = {
  formation_slug: PRO,
  customer_name: "Client Test",
  customer_email: EMAIL,
  customer_phone: "",
  cgv_accepted: "on",
};

const APPROVED = { ProcReturnCode: "00", Response: "Approved", TransId: "T-1", AuthCode: "A1" };

let store: MemoryPaymentStore;
let server: TestServer;
let clock: Date;
let discount: CodeRecord;
let student: CodeRecord;

function failure(reason: string): string {
  return `${SITE}/paiement/echec/?reason=${reason}`;
}

const post = (path: string, options: Parameters<typeof request>[3]) =>
  request(server.base, "POST", path, options);

async function init(overrides: Record<string, string> = {}) {
  return post("/api/payments/cmi/init", { form: { ...CHECKOUT, ...overrides } });
}

async function initOk(overrides: Record<string, string> = {}) {
  const res = await init(overrides);
  expect(res.status, res.headers.location).toBe(200);
  const posted = parseGatewayForm(res.body);
  return { posted, oid: posted.oid, order: store.orders.get(posted.oid)! };
}

async function callback(form: Record<string, string>) {
  const res = await post("/api/payments/cmi/callback", { form });
  return res.body;
}

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({ slug: "test-paiement-cmi", label: "Test paiement CMI", amount_mad: 10 });
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
  discount = store.addCode({ code: "WL-DSCT-AAAA", kind: "discount", customer_email: EMAIL });
  student = store.addCode({
    code: "WL-STUD-BBBB",
    kind: "student",
    percent_off: null,
    product_slug: STUDENT,
    customer_email: EMAIL,
  });
  clock = CREATED_AT;
  server = await startServer({
    payments: createPaymentsRouter({ cmi: { enabled: true, config: CONFIG }, store, now: () => clock }),
  });
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await server.close();
});

// ---------------------------------------------------------------------------

describe("e-mail format (shared rule) on /cmi/init and /codes/check", () => {
  it.each(FORBIDDEN_EMAILS)("/cmi/init refuses %s → echec?reason=invalid, no order", async (_label, email) => {
    const res = await init({ customer_email: email });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(failure("invalid"));
    expect(store.orders.size).toBe(0);
  });

  it.each(FORBIDDEN_EMAILS)(
    "/codes/check refuses %s → { valid: false }, even for a code bound to that exact address",
    async (_label, email) => {
      store.addCode({ code: "WL-FRMT-CCCC", kind: "discount", customer_email: email });
      const res = await post("/api/payments/codes/check", {
        json: { product: PRO, code: "WL-FRMT-CCCC", email },
        headers: { origin: SITE },
      });
      expect(res.status).toBe(200);
      expect(res.body).toBe('{"valid":false}');
    },
  );

  it(`${PLUS_TAG_EMAIL} is accepted by /cmi/init and /codes/check`, async () => {
    const { order } = await initOk({ customer_email: PLUS_TAG_EMAIL });
    expect(order.customer_email).toBe(PLUS_TAG_EMAIL);

    store.addCode({ code: "WL-PLUS-CCCC", kind: "discount", customer_email: PLUS_TAG_EMAIL });
    const res = await post("/api/payments/codes/check", {
      json: { product: PRO, code: "WL-PLUS-CCCC", email: PLUS_TAG_EMAIL },
      headers: { origin: SITE },
    });
    expect(JSON.parse(res.body)).toMatchObject({ valid: true, amount_mad: 8075 });
  });
});

// ---------------------------------------------------------------------------

describe("POST /cmi/init with codes", () => {
  it("pro pack without code: list price, no discount", async () => {
    const { posted, order } = await initOk();
    expect(posted.amount).toBe("8500.00");
    expect(order).toMatchObject({
      formation_slug: PRO,
      amount_mad: 8500,
      list_amount_mad: 8500,
      discount_mad: 0,
      code_id: null,
    });
  });

  it("5 % discount code: 8 500,00 → 8 075,00 charged, stored, NOT consumed at init", async () => {
    const { posted, order } = await initOk({ code: "WL-DSCT-AAAA" });
    expect(posted.amount).toBe("8075.00");
    expect(order).toMatchObject({
      amount_mad: 8075,
      list_amount_mad: 8500,
      discount_mad: 425,
      code_id: discount.id,
      status: "PENDING",
    });
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("accepts the code typed loosely (case, spaces, no dashes)", async () => {
    const { posted } = await initOk({ code: "  wl dsct aaaa " });
    expect(posted.amount).toBe("8075.00");
  });

  it("email binding is case-insensitive", async () => {
    const { posted } = await initOk({ code: "WL-DSCT-AAAA", customer_email: "Client@Example.TEST" });
    expect(posted.amount).toBe("8075.00");
  });

  it("student pack requires a code → reason=code_required, no order", async () => {
    const res = await init({ formation_slug: STUDENT });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(failure("code_required"));
    expect(store.orders.size).toBe(0);
  });

  it("student pack with its student code: 5 000,00, no discount", async () => {
    const { posted, order } = await initOk({ formation_slug: STUDENT, code: "WL-STUD-BBBB" });
    expect(posted.amount).toBe("5000.00");
    expect(order).toMatchObject({ amount_mad: 5000, list_amount_mad: 5000, discount_mad: 0, code_id: student.id });
  });

  it.each([
    ["a discount code on the student pack", { formation_slug: STUDENT, code: "WL-DSCT-AAAA" }],
    ["a student code on the pro pack", { code: "WL-STUD-BBBB" }],
    ["a discount code on the test product", { formation_slug: "test-paiement-cmi", code: "WL-DSCT-AAAA" }],
    ["an unknown code", { code: "WL-ZZZZ-ZZZZ" }],
    ["a malformed code", { code: "WL-0000" }],
    ["another customer's code", { code: "WL-DSCT-AAAA", customer_email: "other@example.test" }],
  ])("refuses %s → reason=code_invalid, no order", async (_label, overrides) => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const res = await init(overrides);
    expect(res.headers.location).toBe(failure("code_invalid"));
    expect(store.orders.size).toBe(0);
  });

  it.each([
    ["expired", { expires_at: "2026-11-24T09:59:59.000Z" }],
    ["revoked", { revoked_at: "2026-11-24T09:00:00.000Z" }],
    ["used up", { used_count: 1 }],
  ])("refuses an %s code → reason=code_invalid", async (_label, change) => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    Object.assign(store.codes.get(discount.id)!, change);
    const res = await init({ code: "WL-DSCT-AAAA" });
    expect(res.headers.location).toBe(failure("code_invalid"));
  });

  it("the code field may be absent (test page) or empty", async () => {
    await initOk({ formation_slug: "test-paiement-cmi" });
    await initOk({ code: "   " });
  });

  it("a duplicated code field is an invalid form", async () => {
    const res = await post("/api/payments/cmi/init", {
      raw: {
        body: Buffer.from(
          `${new URLSearchParams(CHECKOUT).toString()}&code=WL-DSCT-AAAA&code=WL-DSCT-AAAA`,
        ),
        contentType: "application/x-www-form-urlencoded",
      },
    });
    expect(res.headers.location).toBe(failure("invalid"));
  });

  it("inactive product (BIM packs before activation) → reason=invalid", async () => {
    store.products.get(PRO)!.active = false;
    const res = await init({ code: "WL-DSCT-AAAA" });
    expect(res.headers.location).toBe(failure("invalid"));
  });

  it("never trusts an amount posted by the browser", async () => {
    const { posted } = await initOk({ code: "WL-DSCT-AAAA", amount: "1.00", discount_mad: "8499" });
    expect(posted.amount).toBe("8075.00");
  });
});

// ---------------------------------------------------------------------------

describe("callback: code consumption on PENDING → PAID", () => {
  it("consumes the code once; a replayed callback does not consume again", async () => {
    const { posted, oid } = await initOk({ code: "WL-DSCT-AAAA" });
    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)!.status).toBe("PAID");
    expect(store.codes.get(discount.id)!.used_count).toBe(1);

    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.codes.get(discount.id)!.used_count).toBe(1);
  });

  it("a declined callback does not consume the code", async () => {
    const { posted } = await initOk({ code: "WL-DSCT-AAAA" });
    await callback(cmiBody(posted, { ProcReturnCode: "05", Response: "Declined", TransId: "T-2" }));
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("race: two orders with the same single-use code — the second stays PAID and logs CODE_OVERUSE", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const first = await initOk({ code: "WL-DSCT-AAAA" });
    const second = await initOk({ code: "WL-DSCT-AAAA" }); // valide : pas consomme a l'init

    expect(await callback(cmiBody(first.posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(await callback(cmiBody(second.posted, { ...APPROVED, TransId: "T-9" }))).toBe(
      "ACTION=POSTAUTH",
    );

    expect(store.orders.get(first.oid)!.status).toBe("PAID");
    expect(store.orders.get(second.oid)!.status).toBe("PAID");
    expect(store.codes.get(discount.id)!.used_count).toBe(1);
    expect(warn).toHaveBeenCalledWith(
      `[payments] CODE_OVERUSE code_id=${discount.id} oid=${second.oid}`,
    );
  });

  it("a database error while consuming still answers POSTAUTH (money taken)", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { posted, oid } = await initOk({ code: "WL-DSCT-AAAA" });
    store.fail.consumeCode = true;
    expect(await callback(cmiBody(posted, APPROVED))).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)!.status).toBe("PAID");
    expect(errorLog.mock.calls.flat().join(" ")).toContain("code consumption");
  });
});

// ---------------------------------------------------------------------------

describe("PENDING expiry (45 min)", () => {
  it("each /init expires stale PENDING orders; younger ones are kept", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const stale = await initOk({ code: "WL-DSCT-AAAA" });
    clock = new Date(CREATED_AT.getTime() + 30 * 60 * 1000);
    const recent = await initOk();

    clock = new Date(CREATED_AT.getTime() + 46 * 60 * 1000);
    await initOk();

    expect(store.orders.get(stale.oid)).toMatchObject({ status: "FAILED", updated_at: clock.toISOString() });
    expect(store.orders.get(recent.oid)!.status).toBe("PENDING");
    expect(log).toHaveBeenCalledWith("[payments] expired 1 stale PENDING order(s)");
  });

  it("a late 00 callback on an expired order gets FAILURE; the code is not consumed", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { posted, oid } = await initOk({ code: "WL-DSCT-AAAA" });
    clock = new Date(CREATED_AT.getTime() + 46 * 60 * 1000);
    await initOk();

    expect(await callback(cmiBody(posted, APPROVED))).toBe("FAILURE");
    expect(store.orders.get(oid)!.status).toBe("FAILED");
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("an expiry failure never blocks /init", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.expirePendingOrders = true;
    await initOk();
  });

  it("expireStalePendingOrders returns 0 and logs on error", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.expirePendingOrders = true;
    await expect(expireStalePendingOrders(store, CREATED_AT)).resolves.toBe(0);
    expect(errorLog).toHaveBeenCalledWith("[payments] pending expiry failed: simulated db error");
  });

  it("the timer runs every 10 min and is unref'd", async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(store, "expirePendingOrders");
    const timer = startPendingExpiryTimer(store, undefined, () => CREATED_AT);
    expect(timer.hasRef()).toBe(false);
    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
    expect(spy).toHaveBeenCalledWith("2026-11-24T09:15:00.000Z", "2026-11-24T10:00:00.000Z");
    clearInterval(timer);
  });
});

// ---------------------------------------------------------------------------

describe("POST /codes/check", () => {
  const check = (json: unknown, headers: Record<string, string> = { origin: SITE }) =>
    post("/api/payments/codes/check", { json, headers });

  it("valid discount code → server-computed amounts", async () => {
    const res = await check({ product: PRO, code: "wl-dsct-aaaa", email: EMAIL });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      valid: true,
      amount_mad: 8075,
      list_amount_mad: 8500,
      discount_mad: 425,
    });
    expect(res.headers["access-control-allow-origin"]).toBe(SITE);
    expect(store.codes.get(discount.id)!.used_count).toBe(0);
  });

  it("valid student code on the student pack → no discount", async () => {
    const res = await check({ product: STUDENT, code: "WL-STUD-BBBB", email: EMAIL });
    expect(JSON.parse(res.body)).toEqual({
      valid: true,
      amount_mad: 5000,
      list_amount_mad: 5000,
      discount_mad: 0,
    });
  });

  it.each([
    ["wrong email", { product: PRO, code: "WL-DSCT-AAAA", email: "other@example.test" }],
    ["wrong product", { product: STUDENT, code: "WL-DSCT-AAAA", email: EMAIL }],
    ["test product", { product: "test-paiement-cmi", code: "WL-DSCT-AAAA", email: EMAIL }],
    ["unknown product", { product: "nope", code: "WL-DSCT-AAAA", email: EMAIL }],
    ["unknown code", { product: PRO, code: "WL-ZZZZ-ZZZZ", email: EMAIL }],
    ["malformed code", { product: PRO, code: "hello", email: EMAIL }],
    ["missing email", { product: PRO, code: "WL-DSCT-AAAA" }],
    ["invalid email", { product: PRO, code: "WL-DSCT-AAAA", email: "nope" }],
    ["non-string fields", { product: [PRO], code: 1, email: true }],
  ])("%s → exactly { valid: false }, no detail", async (_label, body) => {
    const res = await check(body);
    expect(res.status).toBe(200);
    expect(res.body).toBe('{"valid":false}');
  });

  it("inactive product → { valid: false }", async () => {
    store.products.get(PRO)!.active = false;
    const res = await check({ product: PRO, code: "WL-DSCT-AAAA", email: EMAIL });
    expect(res.body).toBe('{"valid":false}');
  });

  it("malformed JSON → 400 { valid: false }", async () => {
    const res = await post("/api/payments/codes/check", {
      raw: { body: Buffer.from("{not json"), contentType: "application/json" },
    });
    expect(res.status).toBe(400);
    expect(res.body).toBe('{"valid":false}');
  });

  it("answers the CORS preflight for the site only", async () => {
    const ok = await request(server.base, "OPTIONS", "/api/payments/codes/check", {
      headers: { origin: SITE, "access-control-request-method": "POST", "access-control-request-headers": "content-type" },
    });
    expect(ok.headers["access-control-allow-origin"]).toBe(SITE);
    const other = await request(server.base, "OPTIONS", "/api/payments/codes/check", {
      headers: { origin: "https://evil.example.test", "access-control-request-method": "POST" },
    });
    expect(other.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("rate limit: 10 requests per IP per 10 min, then 429 { valid: false }", async () => {
    const body = { product: PRO, code: "WL-DSCT-AAAA", email: EMAIL };
    const fromIp = (ip: string) => check(body, { origin: SITE, "x-forwarded-for": `198.51.100.7, ${ip}` });

    for (let i = 0; i < 10; i += 1) {
      expect((await fromIp("203.0.113.5")).status).toBe(200);
    }
    const limited = await fromIp("203.0.113.5");
    expect(limited.status).toBe(429);
    expect(limited.body).toBe('{"valid":false}');

    // Une autre IP n'est pas concernee ; l'entree forgee en tete est ignoree.
    expect((await fromIp("203.0.113.6")).status).toBe(200);
  });

  it("without a client IP (no X-Forwarded-For, loopback) the limit is not applied", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    for (let i = 0; i < 12; i += 1) {
      expect((await check({ product: PRO, code: "WL-DSCT-AAAA", email: EMAIL })).status).toBe(200);
    }
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------

describe("GET /products/:slug", () => {
  it("active product → label, amount, requires_student_code", async () => {
    const res = await request(server.base, "GET", `/api/payments/products/${STUDENT}`, {
      headers: { origin: SITE },
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      slug: STUDENT,
      label: "BIM Foundations Professional — Pack Étudiants",
      amount_mad: 5000,
      requires_student_code: true,
    });
    expect(res.headers["access-control-allow-origin"]).toBe(SITE);
  });

  it.each([["inactive", PRO], ["unknown", "nope"], ["invalid slug", "NOT_A_SLUG"]])(
    "%s → 404",
    async (label, slug) => {
      if (label === "inactive") store.products.get(PRO)!.active = false;
      const res = await request(server.base, "GET", `/api/payments/products/${slug}`);
      expect(res.status).toBe(404);
      expect(JSON.parse(res.body)).toEqual({ error: "not_found" });
    },
  );
});

describe("payments disabled", () => {
  it("products and code check answer 503", async () => {
    await server.close();
    server = await startServer({
      payments: createPaymentsRouter({
        cmi: { enabled: false, problems: ["CMI_STORE_KEY"], fallbackSiteUrl: SITE },
        store,
      }),
    });
    expect((await request(server.base, "GET", `/api/payments/products/${PRO}`)).status).toBe(503);
    const check = await post("/api/payments/codes/check", { json: {} });
    expect(check.status).toBe(503);
    expect(check.body).toBe('{"valid":false}');
  });
});
