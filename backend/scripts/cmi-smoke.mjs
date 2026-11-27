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
const CLIENT_EMAIL = "client@example.test";
const CONTACT = "contact@example.test";
const NBSP = " ";

function createMemoryStore() {
  const product = (slug, label, amount_mad, extra = {}) => [
    slug,
    { slug, label, amount_mad, active: true, page_slug: null, requires_student_code: false, ...extra },
  ];
  const products = new Map([
    product("test-paiement-cmi", "Test paiement CMI", 10),
    product("bim-foundations-pro", "BIM Foundations Professional — Pack Professionnels", 8500, {
      page_slug: "bim-foundations-professional",
    }),
    product("bim-foundations-etudiant", "BIM Foundations Professional — Pack Étudiants", 5000, {
      page_slug: "bim-foundations-professional",
      requires_student_code: true,
    }),
  ]);
  const code = (id, value, kind, extra = {}) => [
    id,
    {
      id,
      code: value,
      kind,
      percent_off: kind === "discount" ? 5 : null,
      product_slug: null,
      customer_email: CLIENT_EMAIL,
      max_uses: 1,
      used_count: 0,
      expires_at: "2099-01-01T00:00:00.000Z",
      revoked_at: null,
      created_by: "smoke@example.test",
      student_proof_id: null,
      created_at: "2026-11-24T00:00:00.000Z",
      ...extra,
    },
  ];
  const codes = new Map([
    code("11111111-1111-4111-8111-111111111111", "WL-DSCT-AAAA", "discount"),
    code("22222222-2222-4222-8222-222222222222", "WL-STUD-BBBB", "student", {
      product_slug: "bim-foundations-etudiant",
    }),
  ]);
  const orders = new Map();
  const events = [];
  return {
    orders,
    events,
    codes,
    async getProduct(slug) {
      const found = products.get(slug);
      return found ? { ...found } : null;
    },
    async findCodeByCode(value) {
      const found = [...codes.values()].find((c) => c.code === value);
      return found ? { ...found } : null;
    },
    async consumeCode(id) {
      const c = codes.get(id);
      if (!c || c.used_count >= c.max_uses) return false;
      c.used_count += 1;
      return true;
    },
    async expirePendingOrders(cutoff, now) {
      let count = 0;
      for (const o of orders.values()) {
        if (o.status === "PENDING" && o.created_at < cutoff) {
          Object.assign(o, { status: "FAILED", updated_at: now });
          count += 1;
        }
      }
      return count;
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
        confirmation_email_sent_at: null,
        team_notified_at: null,
        created_at: order.cgv_accepted_at,
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
            code_id: o.code_id,
          }
        : null;
    },
    async markOrderPaid(oid, update) {
      const o = orders.get(oid);
      if (!o || o.status !== "PENDING") return false;
      Object.assign(o, update, { status: "PAID", updated_at: update.paid_at });
      return true;
    },
    async findOrderDetails(oid) {
      const o = orders.get(oid);
      if (!o) return null;
      const { oid: ref, formation_slug, status, amount_mad, list_amount_mad, discount_mad, code_id,
        customer_name, customer_email, customer_phone, access_choice, access_available_at, paid_at,
        cmi_trans_id, cmi_auth_code } = o;
      return { oid: ref, formation_slug, status, amount_mad, list_amount_mad, discount_mad, code_id,
        customer_name, customer_email, customer_phone, access_choice, access_available_at, paid_at,
        cmi_trans_id, cmi_auth_code };
    },
    async findCodeById(id) {
      const c = codes.get(id);
      return c ? { ...c } : null;
    },
    async markOrderEmailSent(oid, column, at) {
      const o = orders.get(oid);
      if (o && o[column] === null) o[column] = at;
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

// --- Mailer factice : garde les e-mails (aucun envoi SMTP) -----------------
const mails = [];
const mailer = {
  async send(message) {
    mails.push(message);
  },
};

// --- Serveur -----------------------------------------------------------------
const store = createMemoryStore();
const app = express();
app.use(
  "/api/payments",
  createPaymentsRouter({
    cmi: { enabled: true, config: CONFIG },
    store,
    orderEmails: { mailer, contactRecipient: CONTACT },
  }),
);
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

function request(method, path, { form, json, headers = {} } = {}) {
  let body;
  if (form) {
    body = new URLSearchParams(form).toString();
    headers["content-type"] = "application/x-www-form-urlencoded";
  } else if (json !== undefined) {
    body = JSON.stringify(json);
    headers["content-type"] = "application/json";
  }
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

/** Attend les 2 e-mails d'une commande payee (horodatages poses), max ~1 s. */
async function emailsDone(oid) {
  for (let i = 0; i < 200; i += 1) {
    const o = store.orders.get(oid);
    if (o?.confirmation_email_sent_at && o?.team_notified_at) return true;
    await new Promise((r) => setTimeout(r, 5));
  }
  return false;
}
/** Laisse passer tout travail differe (aucun e-mail attendu). */
const settle = () => new Promise((r) => setTimeout(r, 50));

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
};

async function init(overrides = {}) {
  const res = await request("POST", "/api/payments/cmi/init", {
    form: { ...CHECKOUT, ...overrides },
    headers: { origin: SITE },
  });
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

  // 2b. E-mails de la commande payee (apres la reponse au CMI)
  const aOid = a.posted.oid;
  check("paid order -> e-mails timestamped (confirmation_email_sent_at, team_notified_at)", await emailsDone(aOid));
  const [aCustomer, aTeam] = mails;
  check("paid order -> exactly 2 e-mails: customer then team",
    mails.length === 2 && aCustomer.to === CLIENT_EMAIL && aTeam.to === CONTACT, mails.map((m) => m.to).join(","));
  check("customer e-mail: [TEST] subject, Reply-To CONTACT_RECIPIENT, ref, amount, access text",
    aCustomer.subject === "[TEST] Confirmation de votre paiement — Welearn" && aCustomer.replyTo === CONTACT &&
      aCustomer.text.includes(`Référence de commande : ${aOid}`) &&
      aCustomer.text.includes("Montant payé : 10,00 MAD TTC") &&
      aCustomer.text.includes("Votre accès à la formation est immédiat : il sera ouvert sous 24 heures ouvrées.") &&
      !aCustomer.text.includes("rétractation") &&
      !aCustomer.text.includes("Prix catalogue"), aCustomer.subject);
  check("customer e-mail: no card / CMI transaction data",
    ![aCustomer.text, aCustomer.html].some((s) => s.includes("SMOKE-TRANS-1") || s.includes("SMOKE1")));
  check("team e-mail: [TEST] subject, Reply-To customer, TransId, AuthCode, opening delay",
    aTeam.subject === `[TEST] [Commande payée] Test paiement CMI — 10,00 MAD — ${aOid}` &&
      aTeam.replyTo === CLIENT_EMAIL && aTeam.text.includes("TransId CMI : SMOKE-TRANS-1") &&
      aTeam.text.includes("Code d'autorisation : SMOKE1") && aTeam.text.includes("Ouvrir l'accès : sous 24 h ouvrées"),
    aTeam.subject);

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
  await settle();
  check("no e-mail on retry, DUPLICATE_APPROVAL, non-00, tampered payload", mails.length === 2, String(mails.length));

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

  // 8. Journal
  check("every CMI request logged in payment_events (hash_valid + reply set)",
    store.events.length === 10 && store.events.every((e) => e.reply && e.hash_valid !== undefined), String(store.events.length));

  // 9. Paiement avec code de reduction 5 % (Pack Professionnels)
  const PRO = { formation_slug: "bim-foundations-pro", customer_email: CLIENT_EMAIL };
  const check1 = await request("POST", "/api/payments/codes/check", {
    json: { product: "bim-foundations-pro", code: "wl-dsct-aaaa", email: CLIENT_EMAIL },
    headers: { origin: SITE },
  });
  check("codes/check -> 8075 / 8500 / 425",
    check1.text === '{"valid":true,"amount_mad":8075,"list_amount_mad":8500,"discount_mad":425}', check1.text);
  const d = await init({ ...PRO, code: "WL-DSCT-AAAA" });
  check("discount init -> amount 8075.00 sent to CMI", d.posted.amount === "8075.00", d.posted.amount);
  check("discount order stores list 8500, discount 425, code_id",
    JSON.stringify((({ amount_mad, list_amount_mad, discount_mad, code_id }) => ({ amount_mad, list_amount_mad, discount_mad, code_id }))(store.orders.get(d.posted.oid))) ===
      JSON.stringify({ amount_mad: 8075, list_amount_mad: 8500, discount_mad: 425, code_id: "11111111-1111-4111-8111-111111111111" }));
  check("discount code not consumed at init", store.codes.get("11111111-1111-4111-8111-111111111111").used_count === 0);
  const dPaid = await callback(cmiSigned(d.posted, { ...APPROVED, TransId: "SMOKE-TRANS-D" }));
  check("discount callback 00 -> POSTAUTH, PAID, code consumed",
    dPaid.text === "ACTION=POSTAUTH" && store.orders.get(d.posted.oid).status === "PAID" &&
      store.codes.get("11111111-1111-4111-8111-111111111111").used_count === 1, dPaid.text);
  const dMailed = await emailsDone(d.posted.oid);
  const [dCustomer, dTeam] = mails.slice(2);
  check("discount order e-mails: no [TEST], discount block, Code row",
    dMailed && mails.length === 4 && dCustomer.subject === "Confirmation de votre paiement — Welearn" &&
      dCustomer.text.includes(`Prix catalogue : 8${NBSP}500,00 MAD TTC — Réduction : −425,00 MAD`) &&
      dCustomer.text.includes(`Montant payé : 8${NBSP}075,00 MAD TTC`) &&
      dTeam.subject === `[Commande payée] BIM Foundations Professional — Pack Professionnels — 8${NBSP}075,00 MAD — ${d.posted.oid}` &&
      dTeam.text.includes("Code : WL-DSCT-AAAA"), String(mails.length));
  const dAgain = await request("POST", "/api/payments/cmi/init", { form: { ...CHECKOUT, ...PRO, code: "WL-DSCT-AAAA" } });
  check("used discount code -> echec/?reason=code_invalid", dAgain.headers.location === `${SITE}/paiement/echec/?reason=code_invalid`, dAgain.headers.location);

  // 10. Paiement Pack Etudiants avec code etudiant
  const STU = { formation_slug: "bim-foundations-etudiant", customer_email: CLIENT_EMAIL };
  const noCode = await request("POST", "/api/payments/cmi/init", { form: { ...CHECKOUT, ...STU } });
  check("student pack without code -> echec/?reason=code_required", noCode.headers.location === `${SITE}/paiement/echec/?reason=code_required`, noCode.headers.location);
  const s = await init({ ...STU, code: "WL-STUD-BBBB" });
  check("student init -> amount 5000.00, no discount",
    s.posted.amount === "5000.00" && store.orders.get(s.posted.oid).discount_mad === 0, s.posted.amount);
  const sPaid = await callback(cmiSigned(s.posted, { ...APPROVED, TransId: "SMOKE-TRANS-S" }));
  check("student callback 00 -> POSTAUTH, PAID, code consumed",
    sPaid.text === "ACTION=POSTAUTH" && store.orders.get(s.posted.oid).status === "PAID" &&
      store.codes.get("22222222-2222-4222-8222-222222222222").used_count === 1, sPaid.text);
  const sMailed = await emailsDone(s.posted.oid);
  const [sCustomer, sTeam] = mails.slice(4);
  check("student order e-mails: no discount block (discount 0), Code row, Réduction aucune",
    sMailed && mails.length === 6 && !sCustomer.text.includes("Prix catalogue") &&
      sTeam.text.includes("Code : WL-STUD-BBBB") && sTeam.text.includes("Réduction : aucune"), String(mails.length));

  // 11. Isolation
  check("Supabase client never loaded", !Object.keys(require.cache).some((k) => k.includes("supabaseClient")));
} finally {
  console.warn = originalWarn;
  server.close();
}

for (const r of results) console.log(r.line);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} smoke checks passed`);
process.exitCode = failed ? 1 : 0;
