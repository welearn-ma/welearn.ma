/**
 * Identité légale de WELEARN : source unique pour les pages légales
 * (/mentions-legales, /cgv, /confidentialite, /remboursement).
 *
 * Valeurs fournies par la direction le 10/11/2026. Ne jamais les modifier
 * sans justificatif (RC, attestation ICE, etc.).
 */

export const LEGAL_LAST_UPDATED = "10/11/2026";

export const legalEntity = {
  name: "WELEARN",
  legalForm: "Société à Responsabilité Limitée (SARL)",
  capital: "100 000,00 MAD",
  address: "Bureau 300, Technopark, Route de Nouaceur, Casablanca, Maroc",
  rc: "358641 — Tribunal de commerce de Casablanca",
  registrationDate: "30/08/2016",
  ice: "001753989000025",
  identifiantFiscal: "18816626",
  taxeProfessionnelle: "34082737",
  phone: "+212 661 499 479",
  phoneHref: "tel:+212661499479",
  email: "contact@welearn.ma",
  publicationDirector: "Hassan JAI / Abdelghani KOUIDER",
} as const;

// Hébergeurs confirmés le 12/11/2026. Pays des serveurs : non confirmé.
export const legalHosts = {
  site: {
    name: "Arcanes Technologies (Heberjahiz)",
    address: "Casablanca Technopark, RDC - Bureau 143bis, Casablanca 20153, Maroc",
    phone: "0802 00 2800",
  },
  application: {
    name: "Arcanes Technologies (Heberjahiz)",
    address: "Casablanca Technopark, RDC - Bureau 143bis, Casablanca 20153, Maroc",
    phone: "0802 00 2800",
    domain: "api.welearn.ma",
  },
} as const;

/** Lignes d'identification de l'éditeur / du vendeur, dans l'ordre d'affichage. */
export const legalIdentityRows: ReadonlyArray<readonly [string, string]> = [
  ["Dénomination sociale", legalEntity.name],
  ["Forme juridique", legalEntity.legalForm],
  ["Capital social", legalEntity.capital],
  ["Siège social", legalEntity.address],
  ["Registre du commerce (RC)", legalEntity.rc],
  ["Date d’immatriculation", legalEntity.registrationDate],
  ["Identifiant commun de l’entreprise (ICE)", legalEntity.ice],
  ["Identifiant fiscal (IF)", legalEntity.identifiantFiscal],
  ["Taxe professionnelle", legalEntity.taxeProfessionnelle],
  ["Téléphone", legalEntity.phone],
  ["Email", legalEntity.email],
];
