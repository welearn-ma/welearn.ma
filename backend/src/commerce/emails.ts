import { DISCOUNT_PERCENT } from "../config/commerce";
import { renderEmail, type Block, type Paragraph } from "../lib/emailTemplate";
import type { MailMessage } from "../lib/mailer";

/**
 * E-mails des justificatifs etudiants et des codes. Phrases validees :
 * accuse de reception, validation, refus. Aucun document n'est joint ni
 * reference (ni chemin, ni URL de fichier). Chaque e-mail de justificatif
 * porte une ligne « Statut du justificatif » explicite.
 */

/** JJ/MM/AAAA a l'heure de Casablanca. */
export function formatDateCasablanca(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
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

/**
 * Page de paiement d'un produit. Avec `code`, le champ code y est pre-rempli
 * (jamais l'e-mail dans l'URL).
 */
export function checkoutUrl(siteUrl: string, productSlug: string, code?: string): string {
  const codeParam = code ? `&code=${encodeURIComponent(code)}` : "";
  return `${siteUrl}/paiement/?produit=${encodeURIComponent(productSlug)}${codeParam}`;
}

export function proofPageUrl(siteUrl: string, pageSlug: string): string {
  return `${siteUrl}/etudiant/justificatif/?formation=${encodeURIComponent(pageSlug)}`;
}

/** Espace admin (examen des justificatifs). */
export function adminUrl(siteUrl: string): string {
  return `${siteUrl}/admin/`;
}

const SIGNATURE: Paragraph = ["L'équipe Welearn"];
const PROOF_STATUS_LABEL = "Statut du justificatif";

function greeting(fullName: string | null): Paragraph {
  return [fullName ? `Bonjour ${fullName},` : "Bonjour,"];
}

function message(
  to: string,
  subject: string,
  heading: string,
  paragraphs: Paragraph[],
  options: {
    replyTo?: string;
    rows?: Array<[string, string]>;
    paragraphsAfterRows?: Block[];
  } = {},
): MailMessage {
  const { html, text } = renderEmail({
    heading,
    paragraphs,
    rows: options.rows,
    paragraphsAfterRows: options.paragraphsAfterRows,
  });
  return { to, subject, html, text, replyTo: options.replyTo };
}

/** Accuse de reception envoye a l'etudiant. */
export function proofReceivedEmail(input: {
  to: string;
  fullName: string;
  /** Date de depot (ISO). */
  submittedAt: string;
  replyTo: string;
}): MailMessage {
  return message(
    input.to,
    "Votre justificatif étudiant a bien été reçu",
    "Justificatif étudiant",
    [
      greeting(input.fullName),
      ["Nous avons bien reçu votre justificatif. Il sera examiné par notre équipe."],
    ],
    {
      replyTo: input.replyTo,
      rows: [
        [PROOF_STATUS_LABEL, "En cours d'examen"],
        ["Date de dépôt", formatDateTimeCasablanca(input.submittedAt)],
      ],
      paragraphsAfterRows: [
        ["Vous recevrez un e-mail dès que notre équipe l'aura examiné."],
        SIGNATURE,
      ],
    },
  );
}

/** Notification interne (CONTACT_RECIPIENT) : aucun fichier, aucun lien de fichier. */
export function proofNotificationEmail(input: {
  to: string;
  fullName: string;
  email: string;
  phone: string | null;
  pageSlug: string;
  siteUrl: string;
}): MailMessage {
  const rows: Array<[string, string]> = [
    ["Nom", input.fullName],
    ["E-mail", input.email],
    ...(input.phone ? ([["Téléphone", input.phone]] as Array<[string, string]>) : []),
    ["Formation", input.pageSlug],
    ["Statut", "À examiner"],
  ];
  return message(
    input.to,
    `[Justificatif étudiant] ${input.fullName}`,
    "Nouveau justificatif étudiant",
    [
      [
        "Un nouveau justificatif étudiant a été déposé. Il est à examiner dans l'espace admin, rubrique « Justificatifs étudiants ».",
      ],
    ],
    {
      replyTo: input.email,
      rows,
      paragraphsAfterRows: [
        [{ text: "Examiner dans l'espace admin", href: adminUrl(input.siteUrl) }],
      ],
    },
  );
}

/**
 * Validation : code personnel du Pack Etudiants (envoi initial et renvoi).
 * `paymentUrl` doit porter le code (checkoutUrl(..., code)) : le paiement
 * n'est possible qu'a partir de cet e-mail.
 */
export function proofApprovedEmail(input: {
  to: string;
  fullName: string;
  code: string;
  expiresAt: string;
  paymentUrl: string;
  replyTo: string;
}): MailMessage {
  return message(
    input.to,
    "Votre code personnel Welearn",
    "Statut étudiant validé",
    [greeting(input.fullName)],
    {
      replyTo: input.replyTo,
      rows: [[PROOF_STATUS_LABEL, "Validé"]],
      paragraphsAfterRows: [
        [
          "Votre statut étudiant a été validé. Votre code personnel : ",
          { text: input.code, bold: true },
          `, valable jusqu'au ${formatDateCasablanca(input.expiresAt)}.`,
        ],
        { button: { text: "Payer le Pack Étudiants", href: input.paymentUrl } },
        ["Utilisez cette adresse e-mail lors du paiement : votre code y est lié."],
        SIGNATURE,
      ],
    },
  );
}

/** Refus avec motif. AUCUN lien de paiement ni URL de produit. */
export function proofRejectedEmail(input: {
  to: string;
  fullName: string;
  reason: string;
  proofUrl: string;
  replyTo: string;
}): MailMessage {
  return message(
    input.to,
    "Votre justificatif étudiant",
    "Justificatif étudiant",
    [greeting(input.fullName)],
    {
      replyTo: input.replyTo,
      rows: [
        [PROOF_STATUS_LABEL, "Refusé"],
        ["Motif", input.reason.trim()],
      ],
      paragraphsAfterRows: [
        [
          "Vous pouvez ",
          { text: "nous envoyer un nouveau justificatif", href: input.proofUrl },
          ".",
        ],
        SIGNATURE,
      ],
    },
  );
}

/** Code de reduction cree par un admin (case « envoyer par e-mail »). */
export function discountCodeEmail(input: {
  to: string;
  code: string;
  expiresAt: string;
  paymentUrl: string;
  replyTo: string;
}): MailMessage {
  return message(
    input.to,
    "Votre code de réduction Welearn",
    "Code de réduction",
    [
      greeting(null),
      [
        "Votre code de réduction personnel : ",
        { text: input.code, bold: true },
        //   : espace insecable avant « % » (texte d'origine, a conserver).
        `. Il vous donne droit à ${DISCOUNT_PERCENT} % de réduction, valable jusqu'au ${formatDateCasablanca(input.expiresAt)}, à saisir lors du paiement avec cette adresse e-mail : `,
        { text: input.paymentUrl, href: input.paymentUrl },
        ".",
      ],
      ["Ce code est utilisable une seule fois et n'est pas cumulable avec un autre code."],
      SIGNATURE,
    ],
    { replyTo: input.replyTo },
  );
}
