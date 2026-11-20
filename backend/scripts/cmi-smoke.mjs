// Smoke test CMI : routeur de paiement COMPILE (dist/) + store en memoire.
// Aucun acces Supabase, aucun appel a la passerelle CMI, cle factice.
//
//   npm run build && npm run smoke:cmi
//
// Le routeur est monte AVANT un cors() global qui rejette les origines
// inconnues + express.json(), comme dans src/index.ts.
import { once } from "node:events";
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");
const { createPaymentsRouter } = require("../dist/payments/router.js");
const {
  computeReceivedHash,
  decodeHtmlEntities,
  verifyCallbackHash,
} = require("../dist/payments/cmi/index.js");

const KEY = "TEST_ONLY_KEY";
const SITE = "https://site.example.test";
const API = "https://api.example.test";
const GATEWAY = "https://gateway.example.test/fim/est3Dgate";
const CONFIG = {
  clientId: "TESTCLIENT01",
  storeKey: KEY,
  gatewayUrl: GATEWAY,
  apiPublicUrl: API,
  siteUrl: SITE,
};

// --- Store en memoire (meme contrat que src/payments/store.ts) -------------
function createMemoryStore() {
  const prices = new Map([["test-paiement-cmi", { amount: 10, active: true }]]);
  const orders = new Map();
  const events = [];
  return {
    orders,
    events,
    async getActivePrice(slug) {
      const price = prices.get(slug);
      return price?.active ? price.amount : null;
    },
    async insertOrder(order) {
      if (orders.has(order.oid)) return "duplicate_oid";
      orders.set(order.oid, {
        ...order,
        status: "PENDING",
        access_available_at: null,
        cmi_trans_id: null,
        cmi_auth_code: null,
        cmi_proc_return_code: null,
        paid_at: null,
      });
      return "inserted";
    },
    async findOrderByOid(oid) {
      const o = orders.get(oid);
      return o
        ? {
            oid: o.oid,
            formation_slug: o.formation_slug,
            amount_mad: o.amount_mad,
            status: o.status,
            access_choice: o.access_choice,
            paid_at: o.paid_at,
            cmi_trans_id: o.cmi_trans_id,
          }
        : null;
    },
    async markOrderPaid(oid, update) {
      const o = orders.get(oid);
      if (!o || o.status !== "PENDING") return false;
      Object.assign(o, update, { status: "PAID", updated_at: update.paid_at });
      return true;
    },
    async insertEvent(event) {
      events.push({ ...event, payload: JSON.parse(JSON.stringify(event.payload)), id: events.length + 1 });
      return events.length;
    },
    async updateEvent(id, outcome) {
      Object.assign(events[id - 1], outcome);
    },
  };
}

// --- Serveur -----------------------------------------------------------------
const store = createMemoryStore();
const app = express();
app.use("/api/payments", createPaymentsRouter({ cmi: { enabled: true, config: CONFIG }, store }));
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || origin === SITE) cb(null, true);
      else cb(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());
const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const { port } = server.address();

function request(method, path, { form, headers = {} } = {}) {
  const body = form ? new URLSearchParams(form).toString() : undefined;
  if (body) headers["content-type"] = "application/x-www-form-urlencoded";
  return new Promise((resolve, reject) => {
    const r = http.request({ host: "127.0.0.1", port, method, path, headers }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (text += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, text }));
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}

const results = [];
function check(label, ok, detail = "") {
  results.push({ ok: Boolean(ok), line: `${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  [${detail}]` : ""}` });
}

const CHECKOUT = {
  formation_slug: "test-paiement-cmi",
  customer_name: "Éric Benjelloun-Çalı",
  customer_email: "client@example.test",
  customer_phone: "+212 600 000 000",
  cgv_accepted: "on",
  access_choice: "immediate",
};

async function init() {
  const res = await request("POST", "/api/payments/cmi/init", { form: CHECKOUT, headers: { origin: SITE } });
  const action = decodeHtmlEntities(/<form[^>]*\saction="([^"]*)"/.exec(res.text)?.[1] ?? "");
  const fields = [...res.text.matchAll(/<input type="hidden" name="([^"]*)" value="([^"]*)">/g)].map((m) => [
    decodeHtmlEntities(m[1]),
    decodeHtmlEntities(m[2]),
  ]);
  return { res, action, fields, posted: Object.fromEntries(fields) };
}

/** Simule CMI : renvoie les champs postes + reponse, signes avec la cle factice. */
function cmiSigned(posted, extra) {
  const { HASH: _ignored, ...echoed } = posted;
  const body = { ...echoed, ...extra };
  return { ...body, HASH: computeReceivedHash(body, KEY) };
}

const APPROVED = { ProcReturnCode: "00", Response: "Approved", TransId: "SMOKE-TRANS-1", AuthCode: "SMOKE1" };
const DECLINED = { ProcReturnCode: "05", Response: "Declined", TransId: "SMOKE-TRANS-2" };
const callback = (form) => request("POST", "/api/payments/cmi/callback", { form });
const cmiReturn = (form) =>
  request("POST", "/api/payments/cmi/return", { form, headers: { origin: "https://gateway.example.test" } });

const warnings = [];
const originalWarn = console.warn;
console.warn = (...args) => warnings.push(args.join(" "));

try {
  // 1. /init -> formulaire signe vers la passerelle
  const a = await init();
  const names = a.fields.map(([n]) => n);
  const required = ["clientid", "storetype", "trantype", "amount", "currency", "oid", "okUrl", "failUrl",
    "callbackUrl", "CallbackResponse", "shopurl", "lang", "email", "BillToName", "tel", "rnd",
    "hashAlgorithm", "encoding", "HASH"];
  check("init -> 200 text/html", a.res.status === 200 && /^text\/html/.test(a.res.headers["content-type"]));
  check("init form action = gateway", a.action === GATEWAY, a.action);
  check("init posts every field + HASH", required.every((n) => names.includes(n)), names.join(","));
  check("init never posts 'total'", !names.includes("total"));
  check("init amount from DB = 10.00", a.posted.amount === "10.00", a.posted.amount);
  check("init BillToName sanitized", a.posted.BillToName === "Eric Benjelloun-Cali", a.posted.BillToName);
  check("init HASH verifies with the dummy key", verifyCallbackHash(a.posted, KEY));
  check("init submit button has no name", !/<button[^>]*\sname=/.test(a.res.text));
  check("order created PENDING", store.orders.get(a.posted.oid)?.status === "PENDING");

  // 2. callback 00 signe -> ACTION=POSTAUTH + PAID
  const cb1 = await callback(cmiSigned(a.posted, APPROVED));
  const paid = store.orders.get(a.posted.oid);
  check("callback 00 -> 200 text/plain ACTION=POSTAUTH",
    cb1.status === 200 && /^text\/plain/.test(cb1.headers["content-type"]) && cb1.text === "ACTION=POSTAUTH", cb1.text);
  check("order PAID with paid_at, TransId, AuthCode, access_available_at",
    paid.status === "PAID" && paid.paid_at && paid.cmi_trans_id === "SMOKE-TRANS-1" &&
      paid.cmi_auth_code === "SMOKE1" && paid.access_available_at === paid.paid_at);

  // 3. rejeu meme TransId -> POSTAUTH ; TransId different -> APPROVED + alerte
  const snapshot = JSON.stringify(paid);
  const retry = await callback(cmiSigned(a.posted, APPROVED));
  check("retry same TransId -> ACTION=POSTAUTH, no change",
    retry.text === "ACTION=POSTAUTH" && JSON.stringify(store.orders.get(a.posted.oid)) === snapshot, retry.text);
  const dup = await callback(cmiSigned(a.posted, { ...APPROVED, TransId: "SMOKE-TRANS-9" }));
  check("different TransId on PAID -> APPROVED, no change",
    dup.text === "APPROVED" && JSON.stringify(store.orders.get(a.posted.oid)) === snapshot, dup.text);
  check("DUPLICATE_APPROVAL warning logged",
    warnings.includes(`[payments] DUPLICATE_APPROVAL oid=${a.posted.oid} trans=SMOKE-TRANS-9`), warnings.join(" | "));

  // 4. non-00 sur commande PAID -> APPROVED, reste PAID
  const declinedPaid = await callback(cmiSigned(a.posted, DECLINED));
  check("non-00 on PAID -> APPROVED, still PAID",
    declinedPaid.text === "APPROVED" && store.orders.get(a.posted.oid).status === "PAID", declinedPaid.text);

  // 5. Nouvelle commande : altere -> FAILURE ; non-00 -> APPROVED ; statut inchange
  const b = await init();
  const tampered = { ...cmiSigned(b.posted, APPROVED), amount: "1.00" };
  const cbTampered = await callback(tampered);
  check("tampered payload -> FAILURE, still PENDING",
    cbTampered.text === "FAILURE" && store.orders.get(b.posted.oid).status === "PENDING", cbTampered.text);
  const cbDeclined = await callback(cmiSigned(b.posted, DECLINED));
  check("non-00 -> APPROVED, still PENDING",
    cbDeclined.text === "APPROVED" && store.orders.get(b.posted.oid).status === "PENDING", cbDeclined.text);

  // 6. Retours navigateur (Origin etrangere)
  const r1 = await cmiReturn(cmiSigned(a.posted, APPROVED));
  check("return PAID -> succes/?ref", r1.status === 302 && r1.headers.location === `${SITE}/paiement/succes/?ref=${a.posted.oid}`, r1.headers.location);
  const r2 = await cmiReturn(cmiSigned(b.posted, APPROVED));
  check("return PENDING + 00 -> en-attente/?ref", r2.headers.location === `${SITE}/paiement/en-attente/?ref=${b.posted.oid}`, r2.headers.location);
  const r3 = await cmiReturn(cmiSigned(b.posted, DECLINED));
  check("return PENDING + non-00 -> echec/?ref", r3.headers.location === `${SITE}/paiement/echec/?ref=${b.posted.oid}`, r3.headers.location);
  const r4 = await cmiReturn(tampered);
  check("return tampered -> echec/ (no ref)", r4.headers.location === `${SITE}/paiement/echec/`, r4.headers.location);

  // 7. order-status
  const st = await request("GET", `/api/payments/order-status?ref=${a.posted.oid}`, { headers: { origin: SITE } });
  const json = JSON.parse(st.text);
  check("order-status -> exactly ref,status,formation_slug,amount_mad,paid_at",
    st.status === 200 && Object.keys(json).join(",") === "ref,status,formation_slug,amount_mad,paid_at" && json.status === "PAID",
    st.text);
  check("order-status CORS for SITE_URL", st.headers["access-control-allow-origin"] === SITE);

  // 8. Journal + isolation
  check("every CMI request logged in payment_events (hash_valid + reply set)",
    store.events.length === 10 && store.events.every((e) => e.reply && e.hash_valid !== undefined), String(store.events.length));
  check("Supabase client never loaded", !Object.keys(require.cache).some((k) => k.includes("supabaseClient")));
} finally {
  console.warn = originalWarn;
  server.close();
}

for (const r of results) console.log(r.line);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} smoke checks passed`);
process.exitCode = failed ? 1 : 0;
