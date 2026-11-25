/**
 * Adresses de test communes a tous les endpoints qui recoivent un e-mail
 * (regle partagee : src/lib/emailAddress.ts).
 */

/** Caracteres refuses : espaces et , ; : < > " ( ) [ ] \ */
export const FORBIDDEN_CHARACTERS = [" ", "\t", ",", ";", ":", "<", ">", '"', "(", ")", "[", "]", "\\"];

/** [libelle, adresse] : une adresse par caractere refuse, dans la partie locale. */
export const FORBIDDEN_EMAILS: Array<[string, string]> = FORBIDDEN_CHARACTERS.map((character) => [
  JSON.stringify(character),
  `prenom${character}nom@domaine.ma`,
]);

/** Adresse valide utilisee sur chaque endpoint (point, « + », sans accent). */
export const PLUS_TAG_EMAIL = "prenom.nom+tag@domaine.ma";

export const VALID_EMAILS = [
  PLUS_TAG_EMAIL,
  "contact@welearn.ma",
  "x@y.ma",
  "o'neil@example.com",
  "a_b-c.d@sous.domaine.co.ma",
  "Prenom.Nom@Domaine.MA",
];
