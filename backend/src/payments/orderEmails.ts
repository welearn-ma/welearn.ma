import { formatDateCasablanca } from "../commerce/emails";
import { TEST_PRODUCT_SLUG } from "../config/commerce";
import { CONTACT_PHONE } from "../config/legal";
import { renderEmail, type Paragraph } from "../lib/emailTemplate";
import { describeMailError, type MailMessage, type Mailer } from "../lib/mailer";
import {
  PaymentStoreError,
  type OrderDetails,
  type OrderEmailColumn,
  type PaymentStore,
} from "./store";

/*
 * E-mails d'une commande payee :
 *   - confirmation au client (orders.customer_email), Reply-To CONTACT_RECIPIENT ;
 *   - notification a l'equipe (CONTACT_RECIPIENT), Reply-To le client, pour
 *     ouvrir l'acces dans les delais des CGV.
 *
 * Declenches UNIQUEMENT pour la commande que le callback CMI vient de faire
 * passer PENDING -> PAID, APRES la reponse au CMI (paymentController). Best
 * effort : un echec ne change ni la reponse au CMI ni le statut ; il est
 * journalise sans donnee client. L'e-mail client ne contient aucune donnee
 * de carte (ni PAN masque, ni TransId).
 */

/** Commande payee, prete pour les gabarits. */
export interface PaidOrder
  extends Omit<OrderDetails, "status" | "paid_at" | "access_available_at" | "list_amount_mad"> {
  paid_at: string;
  access_available_at: string;
  list_amount_mad: number;
  /** formation_prices.label (repli : le slug). */
  label: string;
  /** Code utilise (etudiant ou reduction), ou null. */
  code: string | null;
}

export interface OrderEmailSettings {
  /** Base publique du site, sans "/" final. */
  siteUrl: string;
  /** CONTACT_RECIPIENT : destinataire equipe et Reply-To du client. */
  contactRecipient: string;
}

export interface OrderEmailDeps extends OrderEmailSettings {
  store: Pick<PaymentStore, "findOrderDetails" | "getProduct" | "findCodeById" | "markOrderEmailSent">;
  mailer: Mailer;
  /** Horloge injectable (tests). */
  now?: () => Date;
}

// ---------------------------------------------------------------------------
// Mise en forme
// ---------------------------------------------------------------------------

const AMOUNT_FORMAT = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * « 8 075,00 », comme formatAmountMad du site. Separateur de milliers :
 * espace insecable U+00A0 (U+202F d'Intl est mal rendu par certains
 * clients mail).
 */
export function formatMad(amount: number): string {
  return AMOUNT_FORMAT.format(amount).replace(/ /g, " ");
}

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Africa/Casablanca",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** JJ/MM/AAAA HH:mm a l'heure de Casablanca. */
export function formatDateTimeCasablanca(iso: string): string {
  const parts = Object.fromEntries(
    DATE_TIME_FORMAT.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

function subjectPrefix(order: PaidOrder): string {
  return order.formation_slug === TEST_PRODUCT_SLUG ? "[TEST] " : "";
}

function message(
  to: string,
  subject: string,
  heading: string,
  replyTo: string,
  content: {
    paragraphs: Paragraph[];
    rows: Array<[string, string]>;
    paragraphsAfterRows?: Paragraph[];
  },
): MailMessage {
  const { html, text } = renderEmail({ heading, ...content });
  return { to, subject, html, text, replyTo };
}

// ---------------------------------------------------------------------------
// Gabarits (formulations validees)
// ---------------------------------------------------------------------------

/** Confirmation de paiement envoyee au client. */
export function orderConfirmationEmail(
  order: PaidOrder,
  { siteUrl, contactRecipient }: OrderEmailSettings,
): MailMessage {
  const withdrawalFormUrl = `${siteUrl}/documents/formulaire-retractation-welearn.pdf`;

  const rows: Array<[string, string]> = [
    ["Formation", order.label],
    ["Montant payé", `${formatMad(order.amount_mad)} MAD TTC`],
  ];
  if (order.discount_mad > 0) {
    rows.push([
      "Prix catalogue",
      `${formatMad(order.list_amount_mad)} MAD TTC — Réduction : −${formatMad(order.discount_mad)} MAD`,
    ]);
  }
  rows.push(
    ["Référence de commande", order.oid],
    ["Date du paiement", formatDateTimeCasablanca(order.paid_at)],
  );

  const access: Paragraph =
    order.access_choice === "immediate"
      ? [
          "Votre accès à la formation sera ouvert sous 24 heures ouvrées. Conformément à votre choix lors de la commande, vous avez renoncé à votre droit de rétractation dès l'ouverture effective de l'accès.",
        ]
      : [
          `Conformément à votre choix lors de la commande, votre accès à la formation sera ouvert à l'expiration du délai légal de rétractation de 7 jours, à partir du ${formatDateCasablanca(order.access_available_at)}. Vous pouvez exercer votre droit de rétractation pendant ce délai, par écrit à ${contactRecipient}`,
          // HTML : « … à X (formulaire de rétractation). » avec lien ;
          // texte seul : « … à X ou avec le formulaire de rétractation : URL. »
          { text: " (", plain: " ou avec le formulaire de rétractation : " },
          { text: "formulaire de rétractation", href: withdrawalFormUrl, plain: withdrawalFormUrl },
          { text: ").", plain: "." },
        ];

  return message(
    order.customer_email,
    `${subjectPrefix(order)}Confirmation de votre paiement — Welearn`,
    "Confirmation de paiement",
    contactRecipient,
    {
      paragraphs: [
        [`Bonjour ${order.customer_name},`],
        ["Nous confirmons la réception de votre paiement."],
      ],
      rows,
      paragraphsAfterRows: [
        access,
        [
          `Conservez cet e-mail et votre référence de commande. Pour toute question : ${contactRecipient} · ${CONTACT_PHONE}.`,
        ],
        [
          { text: "Conditions générales de vente", href: `${siteUrl}/cgv/` },
          " · ",
          { text: "Politique de remboursement", href: `${siteUrl}/remboursement/` },
        ],
        ["L'équipe Welearn"],
      ],
    },
  );
}

/** Notification interne : commande payee, acces a ouvrir. */
export function orderTeamNotificationEmail(
  order: PaidOrder,
  { contactRecipient }: OrderEmailSettings,
): MailMessage {
  const immediate = order.access_choice === "immediate";
  const amount = formatMad(order.amount_mad);

  const rows: Array<[string, string]> = [
    ["Client", order.customer_name],
    ["E-mail", order.customer_email],
  ];
  if (order.customer_phone) {
    rows.push(["Téléphone", order.customer_phone]);
  }
  rows.push(
    ["Produit", `${order.label} (${order.formation_slug})`],
    ["Prix catalogue", `${formatMad(order.list_amount_mad)} MAD TTC`],
    ["Réduction", order.discount_mad > 0 ? `−${formatMad(order.discount_mad)} MAD` : "aucune"],
  );
  if (order.code) {
    rows.push(["Code", order.code]);
  }
  rows.push(
    ["Montant payé", `${amount} MAD TTC`],
    [
      "Accès",
      immediate
        ? "Immédiat — renonciation au droit de rétractation"
        : "Après le délai de rétractation de 7 jours",
    ],
    [
      "Ouvrir l'accès",
      immediate
        ? "sous 24 h ouvrées"
        : `à partir du ${formatDateCasablanca(order.access_available_at)}`,
    ],
    ["Payé le", formatDateTimeCasablanca(order.paid_at)],
    ["TransId CMI", order.cmi_trans_id ?? "—"],
    ["Code d'autorisation", order.cmi_auth_code ?? "—"],
    ["Référence", order.oid],
  );

  return message(
    contactRecipient,
    `${subjectPrefix(order)}[Commande payée] ${order.label} — ${amount} MAD — ${order.oid}`,
    "Commande payée",
    order.customer_email,
    { paragraphs: [], rows },
  );
}

// ---------------------------------------------------------------------------
// Envoi
// ---------------------------------------------------------------------------

interface EmailKind {
  /** Libelle des journaux : « [mail] <label> not sent: … ». */
  label: "order-confirmation" | "order-team-notify";
  column: OrderEmailColumn;
  build(order: PaidOrder, settings: OrderEmailSettings): MailMessage;
}

const CUSTOMER_CONFIRMATION: EmailKind = {
  label: "order-confirmation",
  column: "confirmation_email_sent_at",
  build: orderConfirmationEmail,
};

const TEAM_NOTIFICATION: EmailKind = {
  label: "order-team-notify",
  column: "team_notified_at",
  build: orderTeamNotificationEmail,
};

const EMAIL_KINDS = [CUSTOMER_CONFIRMATION, TEAM_NOTIFICATION];

/** Message d'erreur base (operation + code PostgREST), jamais de ligne. */
function describeStoreError(error: unknown): string {
  return error instanceof PaymentStoreError ? error.message : "unknown error";
}

function logNotSent(kind: EmailKind, reason: string, oid: string): void {
  console.error(`[mail] ${kind.label} not sent: ${reason} oid=${oid}`);
}

/** Commande PAID complete (libelle et code compris), ou null. Peut lever. */
async function loadPaidOrder(
  store: OrderEmailDeps["store"],
  oid: string,
): Promise<PaidOrder | null> {
  const details = await store.findOrderDetails(oid);
  if (!details || details.status !== "PAID" || !details.paid_at || !details.access_available_at) {
    return null;
  }
  const product = await store.getProduct(details.formation_slug);
  const code = details.code_id ? await store.findCodeById(details.code_id) : null;

  const { status: _status, ...fields } = details;
  return {
    ...fields,
    paid_at: details.paid_at,
    access_available_at: details.access_available_at,
    list_amount_mad: details.list_amount_mad ?? details.amount_mad + details.discount_mad,
    label: product?.label ?? details.formation_slug,
    code: code?.code ?? null,
  };
}

/**
 * Envoie un e-mail puis, en cas de succes seulement, horodate la colonne
 * correspondante. Ne leve jamais (echec du mailer synchrone ou asynchrone
 * compris).
 */
async function sendAndRecord(
  deps: OrderEmailDeps,
  kind: EmailKind,
  order: PaidOrder,
): Promise<void> {
  try {
    await deps.mailer.send(kind.build(order, deps));
  } catch (error) {
    logNotSent(kind, describeMailError(error), order.oid);
    return;
  }

  try {
    const at = (deps.now ?? (() => new Date()))().toISOString();
    await deps.store.markOrderEmailSent(order.oid, kind.column, at);
  } catch (error) {
    console.error(
      `[mail] ${kind.label} sent but not recorded: ${describeStoreError(error)} oid=${order.oid}`,
    );
  }
}

/**
 * E-mails client + equipe d'une commande qui vient de passer PAID. Appele
 * apres la reponse au CMI. Ne leve jamais.
 */
export async function notifyOrderPaid(deps: OrderEmailDeps, oid: string): Promise<void> {
  let order: PaidOrder | null;
  try {
    order = await loadPaidOrder(deps.store, oid);
  } catch (error) {
    for (const kind of EMAIL_KINDS) {
      logNotSent(kind, `order lookup failed (${describeStoreError(error)})`, oid);
    }
    return;
  }
  if (!order) {
    for (const kind of EMAIL_KINDS) {
      logNotSent(kind, "order not found or not paid", oid);
    }
    return;
  }

  const paid = order;
  await Promise.all(EMAIL_KINDS.map((kind) => sendAndRecord(deps, kind, paid)));
}
