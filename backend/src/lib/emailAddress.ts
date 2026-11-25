/**
 * Regle unique de format des adresses e-mail saisies : paiement (/cmi/init,
 * /codes/check), justificatifs etudiants, codes (admin), contact, brochure,
 * inscription, sponsoring. Miroir exact cote site : frontend/lib/email.ts
 * (meme code, verifie par src/lib/__tests__/emailAddress.test.ts).
 *
 * - exactement un @, au moins un point dans le domaine ;
 * - ni espace ni , ; : < > " ( ) [ ] \ : dans un en-tete d'e-mail, ces
 *   caracteres peuvent faire lire plusieurs adresses ou une autre adresse ;
 * - 64 caracteres maximum (limite CMI : « email : Alphanumeric (64) »).
 *
 * L'appelant normalise avant (trim, minuscules) comme il le faisait deja.
 */

export const MAX_EMAIL_LENGTH = 64;

export const EMAIL_PATTERN = /^[^\s@,;:<>"()[\]\\]+@[^\s@,;:<>"()[\]\\]+\.[^\s@,;:<>"()[\]\\]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}
