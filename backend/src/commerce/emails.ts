import { DISCOUNT_PERCENT } from "../config/commerce";
import { renderEmail, type Paragraph } from "../lib/emailTemplate";
import type { MailMessage } from "../lib/mailer";

/**
 * E-mails des justificatifs etudiants et des codes. Phrases validees :
 * accuse de reception, validation, refus. Aucun document n'est joint ni
 * reference (ni chemin, ni URL de fichier).
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

export function checkoutUrl(siteUrl: string, productSlug: string): string {
  return `${siteUrl}/paiement/?produit=${encodeURIComponent(productSlug)}`;
}

export function proofPageUrl(siteUrl: string, pageSlug: string): string {
  return `${siteUrl}/etudiant/justificatif/?formation=${encodeURIComponent(pageSlug)}`;
}

const SIGNATURE: Paragraph = ["L'équipe Welearn"];

function greeting(fullName: string | null): Paragraph {
  return [fullName ? `Bonjour ${fullName},` : "Bonjour,"];
}

function message(
  to: string,
  subject: string,
  heading: string,
  paragraphs: Paragraph[],
  options: { replyTo?: string; rows?: Array<[string, string]> } = {},
): MailMessage {
  const { html, text } = renderEmail({ heading, paragraphs, rows: options.rows });
  return { to, subject, html, text, replyTo: options.replyTo };
}

/** Accuse de reception envoye a l'etudiant. */
export function proofReceivedEmail(input: {
  to: string;
  fullName: string;
  replyTo: string;
}): MailMessage {
  return message(
    input.to,
    "Votre justificatif étudiant a bien été reçu",
    "Justificatif étudiant",
    [
      greeting(input.fullName),
      ["Nous avons bien reçu votre justificatif. Il sera examiné par notre équipe."],
      SIGNATURE,
    ],
    { replyTo: input.replyTo },
  );
}

/** Notification interne (CONTACT_RECIPIENT) : aucun fichier, aucun lien de fichier. */
export function proofNotificationEmail(input: {
  to: string;
  fullName: string;
  email: string;
  phone: string | null;
  pageSlug: string;
}): MailMessage {
  const rows: Array<[string, string]> = [
    ["Nom", input.fullName],
    ["E-mail", input.email],
    ...(input.phone ? ([["Téléphone", input.phone]] as Array<[string, string]>) : []),
    ["Formation", input.pageSlug],
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
    { replyTo: input.email, rows },
  );
}

/** Validation : code personnel du Pack Etudiants. */
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
    [
      greeting(input.fullName),
      [
        "Votre statut étudiant a été validé. Votre code personnel : ",
        { text: input.code, bold: true },
        `, valable jusqu'au ${formatDateCasablanca(input.expiresAt)}, à saisir lors du paiement du Pack Étudiants avec cette adresse e-mail : `,
        { text: input.paymentUrl, href: input.paymentUrl },
        ".",
      ],
      SIGNATURE,
    ],
    { replyTo: input.replyTo },
  );
}

/** Refus avec motif. */
export function proofRejectedEmail(input: {
  to: string;
  fullName: string;
  reason: string;
  proofUrl: string;
  replyTo: string;
}): MailMessage {
  // Le motif est insere avant un point : on retire sa ponctuation finale.
  const reason = input.reason.trim().replace(/[\s.]+$/, "");
  return message(
    input.to,
    "Votre justificatif étudiant",
    "Justificatif étudiant",
    [
      greeting(input.fullName),
      [
        `Votre justificatif n'a pas pu être validé : ${reason}. Vous pouvez `,
        { text: "nous envoyer un nouveau justificatif", href: input.proofUrl },
        ".",
      ],
      SIGNATURE,
    ],
    { replyTo: input.replyTo },
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
