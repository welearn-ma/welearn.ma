/**
 * Validation client du formulaire de paiement CMI.
 *
 * Miroir des règles du backend, qui reste la source de vérité :
 *   - backend/src/controllers/paymentController.ts (parseCheckoutForm,
 *     PHONE_REGEX, MAX_NAME_LENGTH) ;
 *   - backend/src/lib/emailAddress.ts (e-mail : format + 64 caractères),
 *     miroir lib/email.ts ;
 *   - backend/src/payments/cmi/sanitize.ts (sanitizeBillTo,
 *     containsDocumentWord).
 * Toute modification côté backend doit être reportée ici.
 *
 * Le client est plus strict que le backend sur le nom : uniquement des
 * lettres latines (accents compris), espaces, tirets et apostrophes.
 */

import { isValidEmail, MAX_EMAIL_LENGTH } from "@/lib/email";

// Copie exacte de PHONE_REGEX — backend/src/controllers/paymentController.ts
export const PHONE_REGEX = /^\+?[0-9\s().-]{8,20}$/;
// MAX_NAME_LENGTH du backend (BillToName, en points de code).
export const MAX_NAME_LENGTH = 255;
export { MAX_EMAIL_LENGTH };

export const CHECKOUT_MESSAGES = {
  nameRequired: "Veuillez saisir votre nom et prénom.",
  nameTooLong: `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères.`,
  nameLatin: "Merci de saisir votre nom en caractères latins.",
  nameCharacters:
    "Seuls les lettres, les espaces, les tirets et les apostrophes sont acceptés.",
  nameDocument:
    "Votre nom contient un terme non accepté par la plateforme de paiement.",
  emailRequired: "Veuillez saisir votre adresse e-mail.",
  emailTooLong: `L'adresse e-mail ne doit pas dépasser ${MAX_EMAIL_LENGTH} caractères.`,
  emailInvalid: "Veuillez saisir une adresse e-mail valide.",
  emailDocument:
    "Votre adresse e-mail contient un terme non accepté par la plateforme de paiement. Merci d'utiliser une autre adresse e-mail.",
  phoneInvalid: "Veuillez saisir un numéro de téléphone valide.",
  cgvRequired:
    "Veuillez accepter les Conditions Générales de Vente, la Politique de remboursement et la Politique de confidentialité.",
} as const;

// Copie de SPECIAL_LETTERS — backend/src/payments/cmi/sanitize.ts
const SPECIAL_LETTERS: ReadonlyMap<string, string> = new Map([
  ["ß", "ss"],
  ["æ", "ae"],
  ["Æ", "AE"],
  ["œ", "oe"],
  ["Œ", "OE"],
  ["ø", "o"],
  ["Ø", "O"],
  ["đ", "d"],
  ["Đ", "D"],
  ["ð", "d"],
  ["Ð", "D"],
  ["ł", "l"],
  ["Ł", "L"],
  ["ı", "i"],
  ["þ", "th"],
  ["Þ", "Th"],
]);

/**
 * Copie de sanitizeBillTo — backend/src/payments/cmi/sanitize.ts : valeur
 * réellement envoyée au CMI dans BillToName (accents retirés, seuls
 * [A-Za-z0-9 _-] conservés).
 */
export function sanitizeBillTo(value: string): string {
  const mapped = Array.from(
    value,
    (char) => SPECIAL_LETTERS.get(char) ?? char,
  ).join("");

  return mapped
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .trim();
}

// Comme containsDocumentWord (backend) : "document", toute casse.
const DOCUMENT_WORD = /document/i;
/** Lettre d'un autre alphabet que le latin (arabe, tifinagh, cyrillique…). */
const NON_LATIN_LETTER = /(?!\p{Script=Latin})\p{L}/u;
/** Lettres (accents combinants compris), espaces, tirets, apostrophes. */
const NAME_ALLOWED = /^[\p{L}̀-ͯ\p{Zs}'’-]+$/u;

export function validateCustomerName(raw: string): string | null {
  const name = raw.trim();
  if (!name) return CHECKOUT_MESSAGES.nameRequired;
  if (Array.from(name).length > MAX_NAME_LENGTH) {
    return CHECKOUT_MESSAGES.nameTooLong;
  }
  if (NON_LATIN_LETTER.test(name)) return CHECKOUT_MESSAGES.nameLatin;
  if (!NAME_ALLOWED.test(name)) return CHECKOUT_MESSAGES.nameCharacters;

  // Le backend applique la règle "document" au nom APRÈS nettoyage :
  // "Docu'ment" ou "Dócument" y deviennent "Document".
  const billToName = sanitizeBillTo(name);
  if (!/[A-Za-z]/.test(billToName)) return CHECKOUT_MESSAGES.nameLatin;
  if (DOCUMENT_WORD.test(billToName)) return CHECKOUT_MESSAGES.nameDocument;
  return null;
}

export function validateCustomerEmail(raw: string): string | null {
  const email = raw.trim();
  if (!email) return CHECKOUT_MESSAGES.emailRequired;
  if (email.length > MAX_EMAIL_LENGTH) return CHECKOUT_MESSAGES.emailTooLong;
  if (!isValidEmail(email)) return CHECKOUT_MESSAGES.emailInvalid;
  if (DOCUMENT_WORD.test(email)) return CHECKOUT_MESSAGES.emailDocument;
  return null;
}

/** Comme le backend : trim, puis chaque suite d'espaces ramenée à un espace. */
export function normalizePhone(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Téléphone facultatif : vide = valide. Attend une valeur normalisée. */
export function validateCustomerPhone(phone: string): string | null {
  if (!phone) return null;
  return PHONE_REGEX.test(phone) ? null : CHECKOUT_MESSAGES.phoneInvalid;
}
