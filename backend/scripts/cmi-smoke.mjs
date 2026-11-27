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
const BLACK_FRIDAY_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
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
    // Section 11 (Black Friday) : codes encore inutilises.
    code("33333333-3333-4333-8333-333333333333", "WL-DSCT-CCCC", "discount"),
    code("44444444-4444-4444-8444-444444444444", "WL-STUD-DDDD", "student", {
      product_slug: "bim-foundations-etudiant",
    }),
  ]);
  // Black Friday : 27/11/2026 00:00 -> 01/12/2026 00:00 (exclu), Casablanca (UTC+1).
  const promotions = new Map([
    [
      BLACK_FRIDAY_ID,
      {
        id: BLACK_FRIDAY_ID,
        label: "Black Friday",
        percent_off: 25,
        starts_at: "2026-11-26T23:00:00.000Z",
        ends_at: "2026-11-30T23:00:00.000Z",
        active: true,
      },
    ],
  ]);
  const promotionProducts = new Map([
    [BLACK_FRIDAY_ID, new Set(["bim-foundations-pro", "bim-foundations-etudiant"])],
  ]);
  const orders = new Map();
  const events = [];
  return {
    orders,
    events,
    codes,
    promotions,
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
        promotion_id, customer_name, customer_email, customer_phone, access_available_at, paid_at,
        cmi_trans_id, cmi_auth_code } = o;
      return { oid: ref, formation_slug, status, amount_mad, list_amount_mad, discount_mad, code_id,
        promotion_id, customer_name, customer_email, customer_phone, access_available_at, paid_at,
        cmi_trans_id, cmi_auth_code };
    },
    async findPromotionsForProduct(slug) {
      return [...promotions.values()]
        .filter((p) => p.active && promotionProducts.get(p.id)?.has(slug))
        .map((p) => ({ ...p }));
    },
    async findPromotionById(id) {
      const p = promotions.get(id);
      return p ? { ...p } : null;
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
// Horloge du serveur pilotee : sections 1-10 avant le Black Friday (prix
// catalogue), section 11 pendant puis apres.
let clock = new Date("2026-11-24T10:00:00.000Z");
const store = createMemoryStore();
const app = express();
app.use(
  "/api/payments",
  createPaymentsRouter({
    cmi: { enabled: true, config: CONFIG },
    store,
    now: () => clock,
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
    check1.text === '{"valid":true,"amount_mad":8075,"list_amount_mad":8500,"discount_mad":425,"promotion":null}', check1.text);
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

  // 11. Black Friday -25 % (prix serveur, non cumulable, montant fige)
  const productBody = async (slug) =>
    JSON.parse((await request("GET", `/api/payments/products/${slug}`, { headers: { origin: SITE } })).text);
  const pick = (o, keys) => JSON.stringify(Object.fromEntries(keys.map((k) => [k, o[k]])));
  const BF = { label: "Black Friday", percent_off: 25, ends_at: "2026-11-30T23:00:00.000Z" };

  clock = new Date("2026-11-26T22:59:59.000Z"); // 26/11 23:59:59 Casablanca
  const pBefore = await productBody("bim-foundations-pro");
  check("BF products/pro on 26/11 23:59:59 Casablanca -> 8500, promotion null",
    pBefore.amount_mad === 8500 && pBefore.promotion === null, JSON.stringify(pBefore));

  clock = new Date("2026-11-28T10:00:00.000Z");
  const pPro = await productBody("bim-foundations-pro");
  const pStu = await productBody("bim-foundations-etudiant");
  check("BF products/pro -> 6375 / 8500 / 2125 + promotion",
    pick(pPro, ["amount_mad", "list_amount_mad", "discount_mad"]) === '{"amount_mad":6375,"list_amount_mad":8500,"discount_mad":2125}' &&
      JSON.stringify(pPro.promotion) === JSON.stringify(BF), JSON.stringify(pPro));
  check("BF products/etudiant -> 3750 / 5000 / 1250, still requires_student_code",
    pick(pStu, ["amount_mad", "list_amount_mad", "discount_mad", "requires_student_code"]) ===
      '{"amount_mad":3750,"list_amount_mad":5000,"discount_mad":1250,"requires_student_code":true}', JSON.stringify(pStu));

  const bfCheck = await request("POST", "/api/payments/codes/check", {
    json: { product: "bim-foundations-pro", code: "WL-DSCT-CCCC", email: CLIENT_EMAIL },
    headers: { origin: SITE },
  });
  check("BF codes/check 5 % -> not_cumulative", bfCheck.text === '{"valid":false,"reason":"not_cumulative"}', bfCheck.text);

  const bf = await init(PRO);
  const bfOrder = store.orders.get(bf.posted.oid);
  check("BF init pro -> amount 6375.00 sent to CMI", bf.posted.amount === "6375.00", bf.posted.amount);
  check("BF init HASH verifies with the dummy key", verifyCallbackHash(bf.posted, KEY));
  check("BF order stores list 8500, discount 2125, promotion_id, no code",
    pick(bfOrder, ["amount_mad", "list_amount_mad", "discount_mad", "promotion_id", "code_id"]) ===
      JSON.stringify({ amount_mad: 6375, list_amount_mad: 8500, discount_mad: 2125, promotion_id: BLACK_FRIDAY_ID, code_id: null }));

  const bfForged = await init({ ...PRO, amount: "1.00", promotion_id: "x", promo: "1" });
  check("BF init ignores posted amount / promo fields", bfForged.posted.amount === "6375.00", bfForged.posted.amount);

  const bfStacked = await request("POST", "/api/payments/cmi/init", { form: { ...CHECKOUT, ...PRO, code: "WL-DSCT-CCCC" } });
  check("BF init + 5 % code -> echec/?reason=code_not_cumulative, code untouched",
    bfStacked.headers.location === `${SITE}/paiement/echec/?reason=code_not_cumulative` &&
      store.codes.get("33333333-3333-4333-8333-333333333333").used_count === 0, bfStacked.headers.location);

  const bfNoCode = await request("POST", "/api/payments/cmi/init", { form: { ...CHECKOUT, ...STU } });
  check("BF student pack without code -> still code_required",
    bfNoCode.headers.location === `${SITE}/paiement/echec/?reason=code_required`, bfNoCode.headers.location);
  const bfStu = await init({ ...STU, code: "WL-STUD-DDDD" });
  check("BF student init with code -> amount 3750.00", bfStu.posted.amount === "3750.00", bfStu.posted.amount);

  // Commande creee le 30/11 a 23:59:59, callback le 01/12 a 00:10 (apres la fin).
  clock = new Date("2026-11-30T22:59:59.000Z");
  const late = await init(PRO);
  clock = new Date("2026-11-30T23:10:00.000Z");
  const lateWrong = await callback(cmiSigned({ ...late.posted, amount: "8500.00" }, { ...APPROVED, TransId: "SMOKE-TRANS-L0" }));
  check("BF late callback claiming today's price 8500.00 -> FAILURE, still PENDING",
    lateWrong.text === "FAILURE" && store.orders.get(late.posted.oid).status === "PENDING", lateWrong.text);
  const lateOk = await callback(cmiSigned(late.posted, { ...APPROVED, TransId: "SMOKE-TRANS-L" }));
  check("BF late callback with the order's 6375.00 -> POSTAUTH, PAID",
    late.posted.amount === "6375.00" && lateOk.text === "ACTION=POSTAUTH" && store.orders.get(late.posted.oid).status === "PAID",
    `${late.posted.amount} ${lateOk.text}`);
  const lateMailed = await emailsDone(late.posted.oid);
  const [lCustomer, lTeam] = mails.slice(-2);
  check("BF e-mails: discount line names the promotion",
    lateMailed &&
      lCustomer.text.includes(`Prix catalogue : 8${NBSP}500,00 MAD TTC — Réduction Black Friday (−25${NBSP}%) : −2${NBSP}125,00 MAD`) &&
      lCustomer.text.includes(`Montant payé : 6${NBSP}375,00 MAD TTC`) &&
      lTeam.text.includes(`Réduction : −2${NBSP}125,00 MAD — Black Friday (−25${NBSP}%)`), String(mails.length));

  const pAfter = await productBody("bim-foundations-pro");
  const after = await init(PRO);
  check("BF after the end -> products 8500 / promotion null, init 8500.00",
    pAfter.amount_mad === 8500 && pAfter.promotion === null && after.posted.amount === "8500.00",
    `${pAfter.amount_mad} ${after.posted.amount}`);

  // 12. Isolation
  check("Supabase client never loaded", !Object.keys(require.cache).some((k) => k.includes("supabaseClient")));
} finally {
  console.warn = originalWarn;
  server.close();
}

for (const r of results) console.log(r.line);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} smoke checks passed`);
process.exitCode = failed ? 1 : 0;
