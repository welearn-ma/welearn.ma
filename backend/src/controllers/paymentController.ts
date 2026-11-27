import type { Request, Response } from "express";
import { codeRejection, normalizeCode, priceOrder, type OrderPricing } from "../commerce/codes";
import type { CodeRecord, ProductRecord } from "../commerce/types";
import type { CmiConfig } from "../config/cmi";
import { CGV_VERSION } from "../config/legal";
import { expireStalePendingOrders } from "../payments/expiry";
import {
  amountToCents,
  buildSignedFields,
  containsDocumentWord,
  formatAmount,
  generateOid,
  generateRnd,
  parseAmountToCents,
  renderAutoSubmitPage,
  sanitizeBillTo,
  verifyCallbackHash,
} from "../payments/cmi";
import {
  PaymentStoreError,
  type OrderRecord,
  type PaymentEventSource,
  type PaymentStore,
} from "../payments/store";
import { isValidEmail } from "../lib/emailAddress";

/*
 * Paiement CMI 3D Pay Hosting (kit V2.0, sections 4.1-4.2).
 *
 *   POST /cmi/init      formulaire welearn.ma -> commande PENDING -> page qui
 *                       poste le formulaire signe vers la passerelle CMI.
 *                       Champ facultatif `code` (etudiant ou reduction) : verifie
 *                       ici, consomme seulement au passage en PAID.
 *   POST /cmi/callback  serveur-a-serveur CMI -> 200 text/plain
 *                       ACTION=POSTAUTH | APPROVED | FAILURE.
 *                       Si CETTE requete a fait passer la commande
 *                       PENDING -> PAID : e-mails client + equipe, APRES la
 *                       reponse (setImmediate), sans effet sur elle.
 *   POST /cmi/return    navigateur (okUrl + failUrl) -> 302 vers /paiement/...
 *   GET  /order-status  statut public d'une commande (aucune donnee client).
 *
 * Journalisation : jamais la storeKey, le plaintext du hash, ni les payloads
 * CMI (ils vont uniquement dans payment_events).
 */

export type PaymentFailureReason =
  | "invalid"
  | "document"
  | "name_latin"
  | "code_required"
  | "code_invalid"
  | "error"
  | "unavailable";

export type CallbackReply = "ACTION=POSTAUTH" | "APPROVED" | "FAILURE";

export type PaymentPage = "succes" | "echec" | "en-attente";

const CURRENCY_MAD = "504";
const PROC_RETURN_CODE_APPROVED = "00";
// Memes regles que registrationController. E-mail : lib/emailAddress
// (64 caracteres max, limite CMI « email : Alphanumeric (64) »).
const PHONE_REGEX = /^\+?[0-9\s().-]{8,20}$/;
const MAX_SLUG_LENGTH = 100;
const MAX_NAME_LENGTH = 255; // BillToName : Alphabetic (255)
const ORDER_REF_REGEX = /^[A-Za-z0-9]{1,64}$/; // oid : Alphanumeric (64)

// ---------------------------------------------------------------------------
// Reponses
// ---------------------------------------------------------------------------

/** Chemin relatif au site, ex. "/paiement/succes/?ref=WL...". */
export function paymentPagePath(
  page: PaymentPage,
  query: Record<string, string> = {},
): string {
  const search = new URLSearchParams(query).toString();
  return `/paiement/${page}/${search ? `?${search}` : ""}`;
}

export function redirectToFailure(
  res: Response,
  siteUrl: string,
  reason: PaymentFailureReason,
): void {
  res.redirect(302, `${siteUrl}${paymentPagePath("echec", { reason })}`);
}

export function sendCallbackReply(res: Response, reply: CallbackReply): void {
  res.status(200).type("text/plain").send(reply);
}

function describeError(error: unknown): string {
  if (error instanceof PaymentStoreError) {
    return error.message;
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return "unknown error";
}

function logPaymentError(operation: string, error: unknown): void {
  console.error(`[payments] ${operation} failed: ${describeError(error)}`);
}

// ---------------------------------------------------------------------------
// Lecture des corps de formulaire
// ---------------------------------------------------------------------------

type FormBody = Record<string, unknown>;

function asFormBody(body: unknown): FormBody | null {
  return typeof body === "object" && body !== null && !Array.isArray(body)
    ? (body as FormBody)
    : null;
}

/**
 * Valeur d'un champ : undefined si absent, null si non-chaine (cle
 * dupliquee -> tableau), sinon la chaine brute.
 */
function formValue(body: FormBody, key: string): string | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(body, key)) {
    return undefined;
  }
  const value = body[key];
  return typeof value === "string" ? value : null;
}

/** Champ CMI recu : la chaine telle quelle, ou null (absent / non-chaine). */
function cmiField(body: FormBody | null, key: string): string | null {
  return body ? (formValue(body, key) ?? null) : null;
}

interface CheckoutInput {
  formationSlug: string;
  customerName: string;
  billToName: string;
  email: string;
  phone: string | null;
  /** Code saisi, forme canonique "WL-XXXX-XXXX" ; null si aucun. */
  code: string | null;
}

/** Valide le formulaire de commande ; retourne la raison d'echec sinon. */
export function parseCheckoutForm(
  body: unknown,
): CheckoutInput | PaymentFailureReason {
  const form = asFormBody(body);
  if (!form) {
    return "invalid";
  }

  const read = (key: string): string | null => {
    const value = formValue(form, key);
    return value === null ? null : (value ?? "").trim();
  };

  const formationSlug = read("formation_slug");
  const customerName = read("customer_name");
  const email = read("customer_email");
  const rawPhone = read("customer_phone");
  const cgvAccepted = read("cgv_accepted");
  // access_choice n'est plus demande (CGV art. 8 : acces immediat pour
  // tous) ; s'il est encore poste par un ancien formulaire en cache, il est
  // ignore.

  if (
    formationSlug === null ||
    customerName === null ||
    email === null ||
    rawPhone === null ||
    cgvAccepted === null
  ) {
    return "invalid";
  }

  // Espaces internes ramenes a un seul espace : un "\n" poste serait
  // normalise en "\r\n" par le navigateur et fausserait le hash.
  const phone = rawPhone.replace(/\s+/g, " ");

  if (!formationSlug || formationSlug.length > MAX_SLUG_LENGTH) {
    return "invalid";
  }
  if (!customerName || Array.from(customerName).length > MAX_NAME_LENGTH) {
    return "invalid";
  }
  if (!email || !isValidEmail(email)) {
    return "invalid";
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return "invalid";
  }
  if (cgvAccepted !== "on" && cgvAccepted !== "true") {
    return "invalid";
  }

  const billToName = sanitizeBillTo(customerName);
  if (!billToName) {
    return "name_latin";
  }
  if (containsDocumentWord(email) || containsDocumentWord(billToName)) {
    return "document";
  }

  // Champ facultatif (absent sur /paiement/test/). Non-chaine -> invalide ;
  // vide -> aucun code ; format impossible -> code invalide.
  const rawCode = formValue(form, "code");
  if (rawCode === null) {
    return "invalid";
  }
  const codeInput = (rawCode ?? "").trim();
  let code: string | null = null;
  if (codeInput) {
    code = normalizeCode(codeInput);
    if (!code) {
      return "code_invalid";
    }
  }

  return {
    formationSlug,
    customerName,
    billToName,
    email,
    phone: phone || null,
    code,
  };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export interface PaymentHandlerDeps {
  config: CmiConfig;
  store: PaymentStore;
  /** Horloge injectable (tests). */
  now?: () => Date;
  /**
   * Travail apres passage PENDING -> PAID (e-mails), lance apres la reponse
   * au CMI. Ne doit pas lever ; ses erreurs sont de toute facon absorbees.
   */
  onOrderPaid?: (oid: string) => Promise<void>;
}

/**
 * Etat propre a UNE requete de callback : renseigne uniquement quand la mise
 * a jour conditionnelle de cette requete a fait passer la commande en PAID.
 */
interface CallbackTransition {
  paidOid: string | null;
}

export function createPaymentHandlers({
  config,
  store,
  now = () => new Date(),
  onOrderPaid,
}: PaymentHandlerDeps) {
  const returnUrl = `${config.apiPublicUrl}/api/payments/cmi/return`;
  const callbackUrl = `${config.apiPublicUrl}/api/payments/cmi/callback`;

  /** Insere la commande ; un seul nouvel essai si l'oid existe deja. */
  async function createPendingOrder(
    input: CheckoutInput,
    pricing: OrderPricing,
    codeId: string | null,
    createdAt: Date,
  ): Promise<string | null> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const oid = generateOid(createdAt);
      const outcome = await store.insertOrder({
        oid,
        formation_slug: input.formationSlug,
        amount_mad: pricing.amount_mad,
        list_amount_mad: pricing.list_amount_mad,
        discount_mad: pricing.discount_mad,
        code_id: codeId,
        currency: CURRENCY_MAD,
        customer_name: input.customerName,
        customer_email: input.email,
        customer_phone: input.phone,
        cgv_accepted_at: createdAt.toISOString(),
        cgv_version: CGV_VERSION,
        // CGV art. 8 : le clic sur « Payer » vaut demande d'acces immediat
        // et renonciation au droit de retractation.
        access_choice: "immediate",
      });
      if (outcome === "inserted") {
        return oid;
      }
    }
    console.error("[payments] init failed: duplicate oid twice in a row");
    return null;
  }

  /**
   * Code saisi -> enregistrement valide pour ce produit et cet e-mail, ou la
   * raison d'echec. Le motif precis n'est que journalise (jamais le code ni
   * l'e-mail).
   */
  async function resolveCode(
    input: CheckoutInput,
    product: ProductRecord,
    at: Date,
  ): Promise<CodeRecord | null | "code_invalid"> {
    if (!input.code) {
      return null;
    }
    const code = await store.findCodeByCode(input.code);
    const rejection = code
      ? codeRejection(code, { product, email: input.email, now: at })
      : "unknown";
    if (!code || rejection) {
      console.warn(`[payments] init: code refused (${rejection})`);
      return "code_invalid";
    }
    return code;
  }

  async function init(req: Request, res: Response): Promise<void> {
    try {
      const input = parseCheckoutForm(req.body);
      if (typeof input === "string") {
        redirectToFailure(res, config.siteUrl, input);
        return;
      }

      const at = now();
      // Expiration paresseuse des PENDING > 45 min (source de verite).
      await expireStalePendingOrders(store, at);

      // Produit et montant TOUJOURS lus en base, jamais dans la requete.
      const product = await store.getProduct(input.formationSlug);
      if (!product || !product.active) {
        redirectToFailure(res, config.siteUrl, "invalid");
        return;
      }

      const code = await resolveCode(input, product, at);
      if (code === "code_invalid") {
        redirectToFailure(res, config.siteUrl, "code_invalid");
        return;
      }
      if (product.requires_student_code && code?.kind !== "student") {
        redirectToFailure(res, config.siteUrl, "code_required");
        return;
      }

      // Remise calculee cote serveur, en centimes ; un code etudiant n'en
      // donne pas. Le code n'est PAS consomme ici.
      const pricing = priceOrder(product.amount_mad, code);
      const oid = await createPendingOrder(input, pricing, code?.id ?? null, at);
      if (!oid) {
        redirectToFailure(res, config.siteUrl, "error");
        return;
      }

      const params: Array<[string, string]> = [
        ["clientid", config.clientId],
        ["storetype", "3D_PAY_HOSTING"],
        ["trantype", "PreAuth"],
        ["amount", formatAmount(pricing.amount_mad)],
        ["currency", CURRENCY_MAD],
        ["oid", oid],
        ["okUrl", returnUrl],
        ["failUrl", returnUrl],
        ["callbackUrl", callbackUrl],
        ["CallbackResponse", "true"],
        ["shopurl", config.siteUrl],
        ["lang", "fr"],
        ["email", input.email],
        ["BillToName", input.billToName],
      ];
      if (input.phone) {
        params.push(["tel", input.phone]);
      }
      params.push(
        ["rnd", generateRnd()],
        ["hashAlgorithm", "ver3"],
        ["encoding", "UTF-8"],
      );

      const fields = buildSignedFields(params, config.storeKey);
      res
        .status(200)
        .type("html")
        .send(renderAutoSubmitPage(config.gatewayUrl, fields));
    } catch (error) {
      logPaymentError("init", error);
      redirectToFailure(res, config.siteUrl, "error");
    }
  }

  /** Journalise la requete CMI recue (payload complet) ; null si echec. */
  async function recordEvent(
    source: PaymentEventSource,
    body: FormBody | null,
  ): Promise<number | null> {
    try {
      return await store.insertEvent({
        oid: cmiField(body, "oid"),
        source,
        proc_return_code: cmiField(body, "ProcReturnCode"),
        response: cmiField(body, "Response"),
        trans_id: cmiField(body, "TransId"),
        payload: body ?? {},
      });
    } catch (error) {
      logPaymentError(`${source} event insert`, error);
      return null;
    }
  }

  async function finishEvent(
    eventId: number | null,
    hashValid: boolean | null,
    reply: string,
  ): Promise<void> {
    if (eventId === null) {
      return;
    }
    try {
      await store.updateEvent(eventId, { hash_valid: hashValid, reply });
    } catch (error) {
      logPaymentError("event update", error);
    }
  }

  /**
   * 00 sur une commande deja PAID : meme TransId = rejeu du meme callback
   * (POSTAUTH idempotent) ; TransId different = seconde autorisation sur le
   * meme oid -> ne PAS la capturer (APPROVED : la PreAuth expire ou est
   * annulee dans le Merchant Center) et alerter.
   */
  function replyForPaidOrder(order: OrderRecord, transId: string | null): CallbackReply {
    if (transId === order.cmi_trans_id) {
      return "ACTION=POSTAUTH";
    }
    const printable = (value: string | null) =>
      (value ?? "none").replace(/[^\x21-\x7E]/g, "?");
    console.warn(
      `[payments] DUPLICATE_APPROVAL oid=${printable(order.oid)} trans=${printable(transId)}`,
    );
    return "APPROVED";
  }

  /**
   * Consommation du code au passage PENDING -> PAID. L'argent est pris : la
   * commande reste PAID quoi qu'il arrive. Si le code est deja epuise
   * (course entre deux commandes), alerte CODE_OVERUSE. Ne leve jamais.
   */
  async function consumeOrderCode(codeId: string, oid: string): Promise<void> {
    const printable = (value: string) => value.replace(/[^\x21-\x7E]/g, "?");
    try {
      const consumed = await store.consumeCode(codeId);
      if (!consumed) {
        console.warn(
          `[payments] CODE_OVERUSE code_id=${printable(codeId)} oid=${printable(oid)}`,
        );
      }
    } catch (error) {
      logPaymentError(`code consumption code_id=${printable(codeId)} oid=${printable(oid)}`, error);
    }
  }

  function amountMatches(received: string | null, order: OrderRecord): boolean {
    if (received === null) {
      return false;
    }
    const receivedCents = parseAmountToCents(received);
    return receivedCents !== null && receivedCents === amountToCents(order.amount_mad);
  }

  /** Decide la reponse au callback ; leve en cas d'erreur technique. */
  async function processCallback(
    body: FormBody | null,
    transition: CallbackTransition,
  ): Promise<CallbackReply> {
    const oid = cmiField(body, "oid");
    if (!oid) {
      return "FAILURE";
    }

    const order = await store.findOrderByOid(oid);
    if (!order) {
      return "FAILURE";
    }
    if (!amountMatches(cmiField(body, "amount"), order)) {
      return "FAILURE";
    }

    // Code != 00 ou absent : echec d'autorisation, statut inchange (un
    // succes peut suivre sur le meme oid ; jamais de retrogradation).
    if (cmiField(body, "ProcReturnCode") !== PROC_RETURN_CODE_APPROVED) {
      return "APPROVED";
    }

    const transId = cmiField(body, "TransId");

    if (order.status === "PAID") {
      return replyForPaidOrder(order, transId);
    }
    if (order.status !== "PENDING") {
      // FAILED / CANCELLED (posees manuellement) : ne pas debiter.
      return "FAILURE";
    }

    // Acces immediat pour toute commande (CGV art. 8). Les anciennes
    // commandes after_withdrawal encore PENDING expirent en 45 min (expiry.ts)
    // et ne peuvent plus passer PAID.
    const paidAt = now().toISOString();

    const updated = await store.markOrderPaid(oid, {
      paid_at: paidAt,
      access_available_at: paidAt,
      cmi_trans_id: transId,
      cmi_auth_code: cmiField(body, "AuthCode"),
      cmi_proc_return_code: PROC_RETURN_CODE_APPROVED,
    });
    if (updated) {
      transition.paidOid = oid;
      if (order.code_id) {
        await consumeOrderCode(order.code_id, oid);
      }
      return "ACTION=POSTAUTH";
    }

    // Course avec un autre callback : relire l'etat final.
    const current = await store.findOrderByOid(oid);
    return current?.status === "PAID" ? replyForPaidOrder(current, transId) : "FAILURE";
  }

  /**
   * Lance onOrderPaid au tour suivant de la boucle, APRES l'envoi de la
   * reponse au CMI. Toute erreur (synchrone ou non) est absorbee.
   */
  function scheduleOrderPaid(oid: string): void {
    const work = onOrderPaid;
    if (!work) {
      return;
    }
    setImmediate(() => {
      Promise.resolve()
        .then(() => work(oid))
        .catch(() => {
          console.error(`[mail] order e-mails failed unexpectedly oid=${oid}`);
        });
    });
  }

  async function callback(req: Request, res: Response): Promise<void> {
    let reply: CallbackReply = "FAILURE";
    let hashValid: boolean | null = null;
    let eventId: number | null = null;
    const transition: CallbackTransition = { paidOid: null };

    try {
      const body = asFormBody(req.body);
      eventId = await recordEvent("callback", body);

      hashValid = verifyCallbackHash(body, config.storeKey);
      reply = hashValid ? await processCallback(body, transition) : "FAILURE";
    } catch (error) {
      logPaymentError("callback", error);
      reply = "FAILURE";
    }

    await finishEvent(eventId, hashValid, reply);
    sendCallbackReply(res, reply);

    // E-mails seulement si CETTE requete a fait passer la commande en PAID
    // et que le CMI capture (jamais : rejeu, DUPLICATE_APPROVAL, course
    // perdue, non-00, hash ou montant invalide).
    if (transition.paidOid !== null && reply === "ACTION=POSTAUTH") {
      scheduleOrderPaid(transition.paidOid);
    }
  }

  async function handleReturn(req: Request, res: Response): Promise<void> {
    let path = paymentPagePath("echec");
    let hashValid: boolean | null = null;
    let eventId: number | null = null;

    try {
      const body = asFormBody(req.body);
      eventId = await recordEvent("return", body);
      hashValid = verifyCallbackHash(body, config.storeKey);

      const oid = cmiField(body, "oid");
      if (hashValid && oid) {
        const approvedByCmi =
          cmiField(body, "ProcReturnCode") === PROC_RETURN_CODE_APPROVED;
        try {
          const order = await store.findOrderByOid(oid);
          if (order?.status === "PAID") {
            path = paymentPagePath("succes", { ref: oid });
          } else if (order?.status === "PENDING" && approvedByCmi) {
            path = paymentPagePath("en-attente", { ref: oid });
          } else {
            path = paymentPagePath("echec", { ref: oid });
          }
        } catch (error) {
          // Statut illisible : si le CMI annonce un succes, "en attente"
          // plutot qu'un echec trompeur.
          logPaymentError("return order lookup", error);
          path = paymentPagePath(approvedByCmi ? "en-attente" : "echec", { ref: oid });
        }
      }
    } catch (error) {
      logPaymentError("return", error);
    }

    await finishEvent(eventId, hashValid, path);
    res.redirect(302, `${config.siteUrl}${path}`);
  }

  async function orderStatus(req: Request, res: Response): Promise<void> {
    const ref = typeof req.query.ref === "string" ? req.query.ref.trim() : "";
    if (!ORDER_REF_REGEX.test(ref)) {
      res.status(400).json({ error: "invalid_ref" });
      return;
    }

    try {
      const order = await store.findOrderByOid(ref);
      if (!order) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.status(200).json({
        ref: order.oid,
        status: order.status,
        formation_slug: order.formation_slug,
        amount_mad: order.amount_mad,
        paid_at: order.paid_at,
      });
    } catch (error) {
      logPaymentError("order-status", error);
      res.status(500).json({ error: "internal" });
    }
  }

  return { init, callback, handleReturn, orderStatus };
}
