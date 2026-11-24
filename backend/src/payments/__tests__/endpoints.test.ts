import cors from "cors";
import express, { type Router } from "express";
import { once } from "events";
import http from "http";
import type { AddressInfo } from "net";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readCmiConfig, siteOrigins, type CmiConfig } from "../../config/cmi";
import {
  computeHash,
  computeReceivedHash,
  decodeHtmlEntities,
  verifyCallbackHash,
} from "../cmi";
import { createPaymentsRouter } from "../router";
import { MemoryPaymentStore } from "./memoryStore";

const KEY = "TEST_ONLY_KEY";
const SITE = "https://site.example.test";
const API = "https://api.example.test";
const GATEWAY = "https://gateway.example.test/fim/est3Dgate";
const CONFIG: CmiConfig = {
  clientId: "TESTCLIENT01",
  storeKey: KEY,
  gatewayUrl: GATEWAY,
  apiPublicUrl: API,
  siteUrl: SITE,
};
const CREATED_AT = new Date(Date.UTC(2026, 10, 20, 10, 0, 0));
const PAID_AT = new Date(Date.UTC(2026, 10, 20, 10, 5, 0));
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const CHECKOUT: Record<string, string> = {
  formation_slug: "test-paiement-cmi",
  customer_name: "Éric Benjelloun",
  customer_email: "eric@example.test",
  customer_phone: "+212 600 000 000",
  cgv_accepted: "on",
  access_choice: "immediate",
};

// ---------------------------------------------------------------------------
// Harnais : routeur paiements monte AVANT un cors() global qui rejette les
// origines inconnues + express.json(), exactement comme dans index.ts.
// ---------------------------------------------------------------------------

type FormInput = Record<string, string> | Array<[string, string]>;

interface HttpResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

let store: MemoryPaymentStore;
let clock: Date;
let base: string;
let server: http.Server;

async function startServer(router: Router): Promise<void> {
  const app = express();
  app.use("/api/payments", router);
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === SITE) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin not allowed by CORS"));
      },
    }),
  );
  app.use(express.json());
  app.post("/api/other", (req, res) => {
    res.json({ received: req.body });
  });

  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

function request(
  method: string,
  path: string,
  options: { form?: FormInput; json?: unknown; headers?: Record<string, string> } = {},
): Promise<HttpResult> {
  const headers: Record<string, string> = { ...options.headers };
  let payload: string | undefined;

  if (options.form) {
    const entries = Array.isArray(options.form) ? options.form : Object.entries(options.form);
    payload = new URLSearchParams(entries).toString();
    headers["content-type"] = "application/x-www-form-urlencoded";
  } else if (options.json !== undefined) {
    payload = JSON.stringify(options.json);
    headers["content-type"] = "application/json";
  }

  return new Promise((resolve, reject) => {
    const req = http.request(new URL(path, base), { method, headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => {
        body += chunk;
      });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    if (payload !== undefined) {
      req.write(payload);
    }
    req.end();
  });
}

function parseGatewayForm(html: string) {
  const action = decodeHtmlEntities(/<form[^>]*\saction="([^"]*)"/.exec(html)?.[1] ?? "");
  const fields = [...html.matchAll(/<input type="hidden" name="([^"]*)" value="([^"]*)">/g)].map(
    (match): [string, string] => [decodeHtmlEntities(match[1]), decodeHtmlEntities(match[2])],
  );
  return { action, fields, body: Object.fromEntries(fields) };
}

async function initOrder(overrides: Record<string, string> = {}) {
  const res = await request("POST", "/api/payments/cmi/init", {
    form: { ...CHECKOUT, ...overrides },
    headers: { origin: SITE },
  });
  expect(res.status).toBe(200);
  const form = parseGatewayForm(res.body);
  return { res, ...form, oid: form.body.oid };
}

/** Corps de callback/retour tel que CMI l'enverrait, signe avec `key`. */
function cmiBody(
  posted: Record<string, string>,
  extra: Record<string, string>,
  key = KEY,
): Record<string, string> {
  const { HASH: _sentHash, ...echoed } = posted;
  const body = { ...echoed, ...extra };
  return { ...body, HASH: computeReceivedHash(body, key) };
}

const APPROVED_FIELDS = {
  ProcReturnCode: "00",
  Response: "Approved",
  TransId: "26324TEST0001",
  AuthCode: "TEST01",
  "EXTRA.CARDBRAND": "VISA",
  MaskedPan: "400000***0000",
};
const DECLINED_FIELDS = {
  ProcReturnCode: "05",
  Response: "Declined",
  TransId: "26324TEST0002",
  ErrMsg: "Autorisation de paiement refusee",
};

function failureLocation(reason?: string): string {
  return `${SITE}/paiement/echec/${reason ? `?reason=${reason}` : ""}`;
}

beforeEach(async () => {
  store = new MemoryPaymentStore();
  store.addProduct({ slug: "test-paiement-cmi", label: "Test paiement CMI", amount_mad: 10 });
  store.addProduct({ slug: "inactive-formation", amount_mad: 50, active: false });
  clock = CREATED_AT;
  await startServer(
    createPaymentsRouter({ cmi: { enabled: true, config: CONFIG }, store, now: () => clock }),
  );
});

afterEach(async () => {
  vi.restoreAllMocks();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

// ---------------------------------------------------------------------------
// POST /cmi/init
// ---------------------------------------------------------------------------

describe("POST /api/payments/cmi/init", () => {
  it("creates a PENDING order and returns an auto-submit form to the gateway", async () => {
    const { res, action, fields, body, oid } = await initOrder({ amount: "1.00" });

    expect(res.headers["content-type"]).toMatch(/^text\/html; charset=utf-8/);
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(action).toBe(GATEWAY);
    expect(res.body).toContain('accept-charset="UTF-8"');
    expect(res.body).toMatch(/<button type="submit">Continuer vers le paiement<\/button>/);
    expect(res.body).not.toMatch(/<button[^>]*\sname=/);
    expect(res.body).toContain('document.getElementById("cmi-payment-form").submit()');

    expect(fields.map(([name]) => name)).toEqual([
      "clientid",
      "storetype",
      "trantype",
      "amount",
      "currency",
      "oid",
      "okUrl",
      "failUrl",
      "callbackUrl",
      "CallbackResponse",
      "shopurl",
      "lang",
      "email",
      "BillToName",
      "tel",
      "rnd",
      "hashAlgorithm",
      "encoding",
      "HASH",
    ]);
    expect(body).toMatchObject({
      clientid: "TESTCLIENT01",
      storetype: "3D_PAY_HOSTING",
      trantype: "PreAuth",
      amount: "10.00", // from formation_prices, not from the request
      currency: "504",
      okUrl: `${API}/api/payments/cmi/return`,
      failUrl: `${API}/api/payments/cmi/return`,
      callbackUrl: `${API}/api/payments/cmi/callback`,
      CallbackResponse: "true",
      shopurl: SITE,
      lang: "fr",
      email: "eric@example.test",
      BillToName: "Eric Benjelloun",
      tel: "+212 600 000 000",
      hashAlgorithm: "ver3",
      encoding: "UTF-8",
    });
    expect(oid).toMatch(/^WL20261120100000[A-Z0-9]{8}$/);
    expect(body.rnd).toMatch(/^[A-Za-z0-9]{20}$/);
    expect(body).not.toHaveProperty("total");

    const { HASH, ...posted } = body;
    expect(HASH).toBe(computeHash(posted, KEY));
    expect(verifyCallbackHash(body, KEY)).toBe(true);

    expect(store.orders.get(oid)).toMatchObject({
      oid,
      formation_slug: "test-paiement-cmi",
      amount_mad: 10,
      currency: "504",
      status: "PENDING",
      customer_name: "Éric Benjelloun",
      customer_email: "eric@example.test",
      customer_phone: "+212 600 000 000",
      cgv_accepted_at: CREATED_AT.toISOString(),
      cgv_version: "19/11/2026",
      access_choice: "immediate",
      access_available_at: null,
      paid_at: null,
    });
  });

  it("omits tel when no phone is given", async () => {
    const { body, oid } = await initOrder({ customer_phone: "" });
    expect(body).not.toHaveProperty("tel");
    expect(store.orders.get(oid)?.customer_phone).toBeNull();
  });

  it.each([
    ["missing CGV", { cgv_accepted: "" }],
    ["CGV not 'on'/'true'", { cgv_accepted: "off" }],
    ["bad email", { customer_email: "not-an-email" }],
    ["email over 64 chars", { customer_email: `${"a".repeat(60)}@example.test` }],
    ["empty name", { customer_name: "   " }],
    ["name over 255 chars", { customer_name: "A".repeat(256) }],
    ["bad phone", { customer_phone: "call me" }],
    ["bad access_choice", { access_choice: "later" }],
    ["missing access_choice", { access_choice: "" }],
    ["unknown slug", { formation_slug: "does-not-exist" }],
    ["inactive slug", { formation_slug: "inactive-formation" }],
  ])("%s → 302 echec?reason=invalid, no order", async (_label, overrides) => {
    const res = await request("POST", "/api/payments/cmi/init", {
      form: { ...CHECKOUT, ...overrides },
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(failureLocation("invalid"));
    expect(store.orders.size).toBe(0);
  });

  it("duplicate form keys → invalid", async () => {
    const res = await request("POST", "/api/payments/cmi/init", {
      form: [...Object.entries(CHECKOUT), ["customer_email", "other@example.test"]],
    });
    expect(res.headers.location).toBe(failureLocation("invalid"));
  });

  it("unparseable body (over the size limit) → invalid", async () => {
    const res = await request("POST", "/api/payments/cmi/init", {
      form: { ...CHECKOUT, padding: "x".repeat(200_000) },
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(failureLocation("invalid"));
  });

  it("non-Latin name → reason=name_latin", async () => {
    const res = await request("POST", "/api/payments/cmi/init", {
      form: { ...CHECKOUT, customer_name: "محمد العلوي" },
    });
    expect(res.headers.location).toBe(failureLocation("name_latin"));
    expect(store.orders.size).toBe(0);
  });

  it.each([
    ["email", { customer_email: "Documentation@example.test" }],
    ["name", { customer_name: "Jean Dócument" }],
  ])("'document' in %s → reason=document", async (_label, overrides) => {
    const res = await request("POST", "/api/payments/cmi/init", {
      form: { ...CHECKOUT, ...overrides },
    });
    expect(res.headers.location).toBe(failureLocation("document"));
    expect(store.orders.size).toBe(0);
  });

  it("database error → reason=error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.getProduct = true;
    const res = await request("POST", "/api/payments/cmi/init", { form: CHECKOUT });
    expect(res.headers.location).toBe(failureLocation("error"));
  });

  it("retries once on a duplicate oid", async () => {
    store.duplicateOidsToSimulate = 1;
    const { oid } = await initOrder();
    expect(store.orders.has(oid)).toBe(true);
  });

  it("gives up after two duplicate oids → reason=error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.duplicateOidsToSimulate = 2;
    const res = await request("POST", "/api/payments/cmi/init", { form: CHECKOUT });
    expect(res.headers.location).toBe(failureLocation("error"));
    expect(store.orders.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// POST /cmi/callback
// ---------------------------------------------------------------------------

async function callback(form: FormInput, headers: Record<string, string> = {}) {
  return request("POST", "/api/payments/cmi/callback", { form, headers });
}

describe("POST /api/payments/cmi/callback", () => {
  it("00 → ACTION=POSTAUTH, order PAID, access open immediately, event logged", async () => {
    const { body: posted, oid } = await initOrder();
    clock = PAID_AT;
    const cmi = cmiBody(posted, APPROVED_FIELDS);

    const res = await callback(cmi);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/^text\/plain/);
    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)).toMatchObject({
      status: "PAID",
      paid_at: PAID_AT.toISOString(),
      access_available_at: PAID_AT.toISOString(),
      cmi_trans_id: "26324TEST0001",
      cmi_auth_code: "TEST01",
      cmi_proc_return_code: "00",
      updated_at: PAID_AT.toISOString(),
    });
    expect(store.events).toHaveLength(1);
    expect(store.events[0]).toMatchObject({
      oid,
      source: "callback",
      hash_valid: true,
      reply: "ACTION=POSTAUTH",
      proc_return_code: "00",
      response: "Approved",
      trans_id: "26324TEST0001",
      payload: cmi,
    });
  });

  it("after_withdrawal → access_available_at = paid_at + 7 days", async () => {
    const { body: posted, oid } = await initOrder({ access_choice: "after_withdrawal" });
    clock = PAID_AT;
    await callback(cmiBody(posted, APPROVED_FIELDS));
    expect(store.orders.get(oid)?.access_available_at).toBe(
      new Date(PAID_AT.getTime() + SEVEN_DAYS_MS).toISOString(),
    );
  });

  it("00 again with the SAME TransId (retry) → ACTION=POSTAUTH, nothing changes, no warning", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { body: posted, oid } = await initOrder();
    clock = PAID_AT;
    await callback(cmiBody(posted, APPROVED_FIELDS));
    const paidSnapshot = { ...store.orders.get(oid) };

    clock = new Date(PAID_AT.getTime() + 60_000);
    const res = await callback(cmiBody(posted, APPROVED_FIELDS));

    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)).toEqual(paidSnapshot);
    expect(warn).not.toHaveBeenCalled();
  });

  it("00 with a DIFFERENT TransId on a PAID order → APPROVED, order unchanged, event stored, DUPLICATE_APPROVAL logged", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { body: posted, oid } = await initOrder();
    clock = PAID_AT;
    await callback(cmiBody(posted, APPROVED_FIELDS));
    const paidSnapshot = { ...store.orders.get(oid) };

    clock = new Date(PAID_AT.getTime() + 60_000);
    const second = cmiBody(posted, {
      ...APPROVED_FIELDS,
      TransId: "26324TEST0099",
      AuthCode: "TEST99",
    });
    const res = await callback(second);

    expect(res.status).toBe(200);
    expect(res.body).toBe("APPROVED");
    expect(store.orders.get(oid)).toEqual(paidSnapshot);
    expect(store.orders.get(oid)?.cmi_trans_id).toBe("26324TEST0001");
    expect(store.events[store.events.length - 1]).toMatchObject({
      oid,
      source: "callback",
      hash_valid: true,
      reply: "APPROVED",
      trans_id: "26324TEST0099",
      payload: second,
    });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      `[payments] DUPLICATE_APPROVAL oid=${oid} trans=26324TEST0099`,
    );
    expect(warn.mock.calls.flat().join(" ")).not.toContain("eric@example.test");
  });

  it("race with a concurrent callback: same TransId → POSTAUTH, different TransId → APPROVED", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    for (const [winnerTransId, expected] of [
      [APPROVED_FIELDS.TransId, "ACTION=POSTAUTH"],
      ["26324TEST0777", "APPROVED"],
    ] as const) {
      const { body: posted, oid } = await initOrder();
      // Another callback marks the order PAID between our read and our update.
      vi.spyOn(store, "markOrderPaid").mockImplementationOnce(async () => {
        Object.assign(store.orders.get(oid)!, { status: "PAID", cmi_trans_id: winnerTransId });
        return false;
      });

      const res = await callback(cmiBody(posted, APPROVED_FIELDS));

      expect(res.body).toBe(expected);
      expect(store.orders.get(oid)?.cmi_trans_id).toBe(winnerTransId);
    }
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("tampered payload → FAILURE, status unchanged", async () => {
    const { body: posted, oid } = await initOrder();
    const cmi = { ...cmiBody(posted, APPROVED_FIELDS), amount: "1.00" };

    const res = await callback(cmi);

    expect(res.status).toBe(200);
    expect(res.body).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
    expect(store.events[0]).toMatchObject({ hash_valid: false, reply: "FAILURE" });
  });

  it("payload signed with another key → FAILURE", async () => {
    const { body: posted } = await initOrder();
    const res = await callback(cmiBody(posted, APPROVED_FIELDS, "ABCD1234"));
    expect(res.body).toBe("FAILURE");
  });

  it("non-00 → APPROVED and status unchanged; a later 00 still pays; later non-00 never downgrades", async () => {
    const { body: posted, oid } = await initOrder();

    expect((await callback(cmiBody(posted, DECLINED_FIELDS))).body).toBe("APPROVED");
    expect(store.orders.get(oid)?.status).toBe("PENDING");

    clock = PAID_AT;
    expect((await callback(cmiBody(posted, APPROVED_FIELDS))).body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)?.status).toBe("PAID");

    expect((await callback(cmiBody(posted, DECLINED_FIELDS))).body).toBe("APPROVED");
    expect(store.orders.get(oid)?.status).toBe("PAID");
    expect(store.events.map((event) => event.reply)).toEqual([
      "APPROVED",
      "ACTION=POSTAUTH",
      "APPROVED",
    ]);
  });

  it("missing ProcReturnCode → APPROVED, status unchanged", async () => {
    const { body: posted, oid } = await initOrder();
    const res = await callback(cmiBody(posted, { Response: "Error" }));
    expect(res.body).toBe("APPROVED");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
  });

  it("signed but amount different from the order → FAILURE", async () => {
    const { body: posted, oid } = await initOrder();
    const res = await callback(cmiBody(posted, { ...APPROVED_FIELDS, amount: "11.00" }));
    expect(res.body).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("PENDING");
  });

  it("amount with a comma ('10,00') is accepted", async () => {
    const { body: posted } = await initOrder();
    const res = await callback(cmiBody(posted, { ...APPROVED_FIELDS, amount: "10,00" }));
    expect(res.body).toBe("ACTION=POSTAUTH");
  });

  it("signed but unknown oid → FAILURE", async () => {
    const { body: posted } = await initOrder();
    const res = await callback(
      cmiBody(posted, { ...APPROVED_FIELDS, oid: "WL20261120100000ZZZZZZZZ" }),
    );
    expect(res.body).toBe("FAILURE");
  });

  it("CANCELLED order + 00 → FAILURE, status unchanged", async () => {
    const { body: posted, oid } = await initOrder();
    store.orders.get(oid)!.status = "CANCELLED";
    const res = await callback(cmiBody(posted, APPROVED_FIELDS));
    expect(res.body).toBe("FAILURE");
    expect(store.orders.get(oid)?.status).toBe("CANCELLED");
  });

  it("event insert failure does not block processing", async () => {
    const { body: posted, oid } = await initOrder();
    store.fail.insertEvent = true;
    const res = await callback(cmiBody(posted, APPROVED_FIELDS));
    expect(res.body).toBe("ACTION=POSTAUTH");
    expect(store.orders.get(oid)?.status).toBe("PAID");
  });

  it("database error → FAILURE (still HTTP 200)", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { body: posted } = await initOrder();
    store.fail.findOrderByOid = true;

    const res = await callback(cmiBody(posted, APPROVED_FIELDS));

    expect(res.status).toBe(200);
    expect(res.body).toBe("FAILURE");
    const logged = errors.mock.calls.flat().join(" ");
    expect(logged).not.toContain(KEY);
    expect(logged).not.toContain("26324TEST0001");
    expect(logged).not.toContain("eric@example.test");
  });

  it("duplicate keys → FAILURE", async () => {
    const { body: posted } = await initOrder();
    const cmi = cmiBody(posted, APPROVED_FIELDS);
    const res = await callback([...Object.entries(cmi), ["amount", cmi.amount]]);
    expect(res.body).toBe("FAILURE");
  });

  it("JSON body, empty body, or unparseable body → FAILURE with HTTP 200", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const json = await request("POST", "/api/payments/cmi/callback", { json: { oid: "x" } });
    const empty = await request("POST", "/api/payments/cmi/callback");
    const huge = await callback({ padding: "x".repeat(200_000) });

    for (const res of [json, empty, huge]) {
      expect(res.status).toBe(200);
      expect(res.body).toBe("FAILURE");
    }
  });

  it("is not blocked by the global CORS (foreign Origin)", async () => {
    const { body: posted } = await initOrder();
    const res = await callback(cmiBody(posted, APPROVED_FIELDS), {
      origin: "https://gateway.example.test",
    });
    expect(res.status).toBe(200);
    expect(res.body).toBe("ACTION=POSTAUTH");
  });
});

// ---------------------------------------------------------------------------
// POST /cmi/return
// ---------------------------------------------------------------------------

async function cmiReturn(form: FormInput, origin = "https://gateway.example.test") {
  return request("POST", "/api/payments/cmi/return", { form, headers: { origin } });
}

describe("POST /api/payments/cmi/return", () => {
  it("invalid hash → 302 echec/ without ref, event logged", async () => {
    const { body: posted } = await initOrder();
    const res = await cmiReturn({ ...cmiBody(posted, APPROVED_FIELDS), amount: "1.00" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(`${SITE}/paiement/echec/`);
    expect(store.events[0]).toMatchObject({
      source: "return",
      hash_valid: false,
      reply: "/paiement/echec/",
    });
  });

  it("PAID → succes/?ref=<oid>", async () => {
    const { body: posted, oid } = await initOrder();
    await callback(cmiBody(posted, APPROVED_FIELDS));

    const res = await cmiReturn(cmiBody(posted, APPROVED_FIELDS));

    expect(res.headers.location).toBe(`${SITE}/paiement/succes/?ref=${oid}`);
    expect([...new URL(res.headers.location!).searchParams.keys()]).toEqual(["ref"]);
  });

  it("PENDING + 00 (callback not processed yet) → en-attente/?ref=<oid>", async () => {
    const { body: posted, oid } = await initOrder();
    const res = await cmiReturn(cmiBody(posted, APPROVED_FIELDS));
    expect(res.headers.location).toBe(`${SITE}/paiement/en-attente/?ref=${oid}`);
    expect(store.orders.get(oid)?.status).toBe("PENDING");
  });

  it("PENDING + non-00 → echec/?ref=<oid>", async () => {
    const { body: posted, oid } = await initOrder();
    const res = await cmiReturn(cmiBody(posted, DECLINED_FIELDS));
    expect(res.headers.location).toBe(`${SITE}/paiement/echec/?ref=${oid}`);
  });

  it("works with Origin 'null' and with a foreign Origin (no CORS error)", async () => {
    const { body: posted, oid } = await initOrder();
    for (const origin of ["null", "https://gateway.example.test"]) {
      const res = await cmiReturn(cmiBody(posted, DECLINED_FIELDS), origin);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(`${SITE}/paiement/echec/?ref=${oid}`);
    }
  });

  it("database error with 00 → en-attente/?ref=<oid> rather than a misleading failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { body: posted, oid } = await initOrder();
    store.fail.findOrderByOid = true;
    const res = await cmiReturn(cmiBody(posted, APPROVED_FIELDS));
    expect(res.headers.location).toBe(`${SITE}/paiement/en-attente/?ref=${oid}`);
  });

  it("unparseable body → 302 echec/", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const res = await cmiReturn({ padding: "x".repeat(200_000) });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(`${SITE}/paiement/echec/`);
  });
});

// ---------------------------------------------------------------------------
// GET /order-status
// ---------------------------------------------------------------------------

describe("GET /api/payments/order-status", () => {
  it("returns ref, status, formation_slug, amount_mad, paid_at only", async () => {
    const { body: posted, oid } = await initOrder();
    clock = PAID_AT;
    await callback(cmiBody(posted, APPROVED_FIELDS));

    const res = await request("GET", `/api/payments/order-status?ref=${oid}`);

    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(JSON.parse(res.body)).toEqual({
      ref: oid,
      status: "PAID",
      formation_slug: "test-paiement-cmi",
      amount_mad: 10,
      paid_at: PAID_AT.toISOString(),
    });
    expect(res.body).not.toContain("eric@example.test");
  });

  it("400 on a missing or malformed ref, 404 on an unknown ref", async () => {
    expect((await request("GET", "/api/payments/order-status")).status).toBe(400);
    expect((await request("GET", "/api/payments/order-status?ref=..%2Fx")).status).toBe(400);
    expect(
      (await request("GET", "/api/payments/order-status?ref=WL20261120100000ZZZZZZZZ")).status,
    ).toBe(404);
  });

  it("500 on a database error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    store.fail.findOrderByOid = true;
    const res = await request("GET", "/api/payments/order-status?ref=WL1");
    expect(res.status).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ error: "internal" });
  });

  it("CORS: SITE_URL and its www variant only", async () => {
    const { oid } = await initOrder();
    const path = `/api/payments/order-status?ref=${oid}`;

    const site = await request("GET", path, { headers: { origin: SITE } });
    const www = await request("GET", path, { headers: { origin: "https://www.site.example.test" } });
    const other = await request("GET", path, { headers: { origin: "https://evil.example.test" } });

    expect(site.headers["access-control-allow-origin"]).toBe(SITE);
    expect(www.headers["access-control-allow-origin"]).toBe("https://www.site.example.test");
    expect(other.status).toBe(200);
    expect(other.headers["access-control-allow-origin"]).toBeUndefined();

    const preflight = await request("OPTIONS", path, {
      headers: { origin: SITE, "access-control-request-method": "GET" },
    });
    expect(preflight.status).toBe(204);
    expect(preflight.headers["access-control-allow-origin"]).toBe(SITE);
  });
});

// ---------------------------------------------------------------------------
// Paiement desactive (variables CMI manquantes)
// ---------------------------------------------------------------------------

describe("payments disabled (missing CMI env vars)", () => {
  beforeEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    const cmi = readCmiConfig({ SITE_URL: SITE });
    expect(cmi.enabled).toBe(false);
    await startServer(createPaymentsRouter({ cmi, store }));
  });

  it("init → echec?reason=unavailable, callback → FAILURE, return → echec/, order-status → 503", async () => {
    const init = await request("POST", "/api/payments/cmi/init", { form: CHECKOUT });
    const cb = await callback({ oid: "WL1", ProcReturnCode: "00" });
    const ret = await cmiReturn({ oid: "WL1" });
    const status = await request("GET", "/api/payments/order-status?ref=WL1");

    expect(init.status).toBe(302);
    expect(init.headers.location).toBe(failureLocation("unavailable"));
    expect(cb.status).toBe(200);
    expect(cb.body).toBe("FAILURE");
    expect(ret.headers.location).toBe(`${SITE}/paiement/echec/`);
    expect(status.status).toBe(503);
    expect(store.orders.size).toBe(0);
    expect(store.events).toHaveLength(0);
  });

  it("other routes keep working", async () => {
    const res = await request("POST", "/api/other", { json: { ok: true } });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ received: { ok: true } });
  });
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

describe("readCmiConfig / siteOrigins", () => {
  const FULL_ENV = {
    CMI_CLIENT_ID: "TESTCLIENT01",
    CMI_STORE_KEY: KEY,
    CMI_GATEWAY_URL: GATEWAY,
    API_PUBLIC_URL: `${API}/`,
    SITE_URL: `${SITE}//`,
  };

  it("enabled when every variable is set; trailing slashes stripped", () => {
    expect(readCmiConfig(FULL_ENV)).toEqual({ enabled: true, config: CONFIG });
  });

  it("lists missing / invalid variable NAMES, never values", () => {
    const result = readCmiConfig({
      CMI_STORE_KEY: "DUMMY_SECRET_VALUE",
      CMI_GATEWAY_URL: "not a url",
      SITE_URL: "ftp://site.example.test",
    });
    expect(result).toEqual({
      enabled: false,
      problems: [
        "CMI_CLIENT_ID (missing)",
        "CMI_GATEWAY_URL (invalid URL)",
        "API_PUBLIC_URL (missing)",
        "SITE_URL (invalid URL)",
      ],
      fallbackSiteUrl: "https://welearn.ma",
    });
    expect(JSON.stringify(result)).not.toContain("DUMMY_SECRET_VALUE");
  });

  it("siteOrigins adds or removes www.", () => {
    expect(siteOrigins("https://welearn.ma")).toEqual([
      "https://welearn.ma",
      "https://www.welearn.ma",
    ]);
    expect(siteOrigins("https://www.welearn.ma/")).toEqual([
      "https://www.welearn.ma",
      "https://welearn.ma",
    ]);
  });
});
