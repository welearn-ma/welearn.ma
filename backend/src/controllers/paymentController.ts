import type { Request, Response } from "express";
import type { CmiConfig } from "../config/cmi";
import { CGV_VERSION } from "../config/legal";
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
  type AccessChoice,
  type OrderRecord,
  type PaymentEventSource,
  type PaymentStore,
} from "../payments/store";

/*
 * Paiement CMI 3D Pay Hosting (kit V2.0, sections 4.1-4.2).
 *
 *   POST /cmi/init      formulaire welearn.ma -> commande PENDING -> page qui
 *                       poste le formulaire signe vers la passerelle CMI.
 *   POST /cmi/callback  serveur-a-serveur CMI -> 200 text/plain
 *                       ACTION=POSTAUTH | APPROVED | FAILURE.
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
  | "error"
  | "unavailable";

export type CallbackReply = "ACTION=POSTAUTH" | "APPROVED" | "FAILURE";

export type PaymentPage = "succes" | "echec" | "en-attente";

const CURRENCY_MAD = "504";
const PROC_RETURN_CODE_APPROVED = "00";
// Memes regles que registrationController.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{8,20}$/;
const MAX_SLUG_LENGTH = 100;
const MAX_NAME_LENGTH = 255; // BillToName : Alphabetic (255)
const MAX_EMAIL_LENGTH = 64; // email : Alphanumeric (64)
const ORDER_REF_REGEX = /^[A-Za-z0-9]{1,64}$/; // oid : Alphanumeric (64)
const WITHDRAWAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // CGV art. 8 : 7 jours

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
  accessChoice: AccessChoice;
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
  const accessChoice = read("access_choice");

  if (
    formationSlug === null ||
    customerName === null ||
    email === null ||
    rawPhone === null ||
    cgvAccepted === null ||
    accessChoice === null
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
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return "invalid";
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return "invalid";
  }
  if (cgvAccepted !== "on" && cgvAccepted !== "true") {
    return "invalid";
  }
  if (accessChoice !== "immediate" && accessChoice !== "after_withdrawal") {
    return "invalid";
  }

  const billToName = sanitizeBillTo(customerName);
  if (!billToName) {
    return "name_latin";
  }
  if (containsDocumentWord(email) || containsDocumentWord(billToName)) {
    return "document";
  }

  return {
    formationSlug,
    customerName,
    billToName,
    email,
    phone: phone || null,
    accessChoice,
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
}

export function createPaymentHandlers({
  config,
  store,
  now = () => new Date(),
}: PaymentHandlerDeps) {
  const returnUrl = `${config.apiPublicUrl}/api/payments/cmi/return`;
  const callbackUrl = `${config.apiPublicUrl}/api/payments/cmi/callback`;

  /** Insere la commande ; un seul nouvel essai si l'oid existe deja. */
  async function createPendingOrder(
    input: CheckoutInput,
    amountMad: number,
    createdAt: Date,
  ): Promise<string | null> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const oid = generateOid(createdAt);
      const outcome = await store.insertOrder({
        oid,
        formation_slug: input.formationSlug,
        amount_mad: amountMad,
        currency: CURRENCY_MAD,
        customer_name: input.customerName,
        customer_email: input.email,
        customer_phone: input.phone,
        cgv_accepted_at: createdAt.toISOString(),
        cgv_version: CGV_VERSION,
        access_choice: input.accessChoice,
      });
      if (outcome === "inserted") {
        return oid;
      }
    }
    console.error("[payments] init failed: duplicate oid twice in a row");
    return null;
  }

  async function init(req: Request, res: Response): Promise<void> {
    try {
      const input = parseCheckoutForm(req.body);
      if (typeof input === "string") {
        redirectToFailure(res, config.siteUrl, input);
        return;
      }

      // Montant TOUJOURS lu en base, jamais dans la requete.
      const amountMad = await store.getActivePrice(input.formationSlug);
      if (amountMad === null) {
        redirectToFailure(res, config.siteUrl, "invalid");
        return;
      }

      const oid = await createPendingOrder(input, amountMad, now());
      if (!oid) {
        redirectToFailure(res, config.siteUrl, "error");
        return;
      }

      const params: Array<[string, string]> = [
        ["clientid", config.clientId],
        ["storetype", "3D_PAY_HOSTING"],
        ["trantype", "PreAuth"],
        ["amount", formatAmount(amountMad)],
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

  function amountMatches(received: string | null, order: OrderRecord): boolean {
    if (received === null) {
      return false;
    }
    const receivedCents = parseAmountToCents(received);
    return receivedCents !== null && receivedCents === amountToCents(order.amount_mad);
  }

  /** Decide la reponse au callback ; leve en cas d'erreur technique. */
  async function processCallback(body: FormBody | null): Promise<CallbackReply> {
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

    const paidAt = now();
    const accessAvailableAt =
      order.access_choice === "after_withdrawal"
        ? new Date(paidAt.getTime() + WITHDRAWAL_PERIOD_MS)
        : paidAt;

    const updated = await store.markOrderPaid(oid, {
      paid_at: paidAt.toISOString(),
      access_available_at: accessAvailableAt.toISOString(),
      cmi_trans_id: transId,
      cmi_auth_code: cmiField(body, "AuthCode"),
      cmi_proc_return_code: PROC_RETURN_CODE_APPROVED,
    });
    if (updated) {
      return "ACTION=POSTAUTH";
    }

    // Course avec un autre callback : relire l'etat final.
    const current = await store.findOrderByOid(oid);
    return current?.status === "PAID" ? replyForPaidOrder(current, transId) : "FAILURE";
  }

  async function callback(req: Request, res: Response): Promise<void> {
    let reply: CallbackReply = "FAILURE";
    let hashValid: boolean | null = null;
    let eventId: number | null = null;

    try {
      const body = asFormBody(req.body);
      eventId = await recordEvent("callback", body);

      hashValid = verifyCallbackHash(body, config.storeKey);
      reply = hashValid ? await processCallback(body) : "FAILURE";
    } catch (error) {
      logPaymentError("callback", error);
      reply = "FAILURE";
    }

    await finishEvent(eventId, hashValid, reply);
    sendCallbackReply(res, reply);
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
