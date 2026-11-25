/**
 * Règle unique de format des adresses e-mail saisies sur le site (paiement,
 * justificatif étudiant, codes admin, brochure, inscription, sponsoring).
 * Copie exacte de backend/src/lib/emailAddress.ts, qui reste la source de
 * vérité : un test backend vérifie que le code des deux fichiers est
 * identique. Toute modification se fait dans les deux.
 *
 * - exactement un @, au moins un point dans le domaine ;
 * - ni espace ni , ; : < > " ( ) [ ] \ ;
 * - 64 caractères maximum (limite CMI).
 */

export const MAX_EMAIL_LENGTH = 64;

export const EMAIL_PATTERN = /^[^\s@,;:<>"()[\]\\]+@[^\s@,;:<>"()[\]\\]+\.[^\s@,;:<>"()[\]\\]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}
