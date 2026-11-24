/**
 * Regles commerciales du paiement en ligne (prix lus en base, jamais ici).
 * Toute modification doit rester alignee avec
 * migrations/20261124000000_cmi_products_codes_students.sql.
 */

/** Produit de test CMI : aucun code ne s'y applique. */
export const TEST_PRODUCT_SLUG = "test-paiement-cmi";

/** Remise des codes de reduction (CGV art. 5 : un code par commande). */
export const DISCOUNT_PERCENT = 5;

/** Validite par defaut d'un code (etudiant ou reduction). */
export const CODE_VALIDITY_DAYS = 30;
/** Borne haute d'une date d'expiration choisie par un admin. */
export const CODE_MAX_VALIDITY_DAYS = 366;

/**
 * Lien du e-mail de code de reduction : seul produit eligible a ce jour
 * (le Pack Etudiants et le produit de test sont exclus des remises).
 */
export const DISCOUNT_EMAIL_PRODUCT_SLUG = "bim-foundations-pro";

/** Commande PENDING plus ancienne -> FAILED. */
export const PENDING_ORDER_TTL_MS = 45 * 60 * 1000;
/** Balayage periodique (best effort : Passenger peut arreter le processus). */
export const PENDING_EXPIRY_INTERVAL_MS = 10 * 60 * 1000;

/** Justificatifs etudiants : bucket Storage PRIVE. */
export const STUDENT_PROOFS_BUCKET = "student-proofs";
export const STUDENT_PROOF_MAX_BYTES = 5 * 1024 * 1024;
/** Duree de vie des URLs signees de consultation (admin). */
export const PROOF_SIGNED_URL_TTL_SECONDS = 60;
/** Envoi plus rapide que ce seuil apres l'ouverture du formulaire = bot. */
export const PROOF_MIN_HUMAN_ELAPSED_MS = 3000;

/** Limites anti-abus (memoire du processus, par IP). */
export const CODE_CHECK_RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };
export const PROOF_UPLOAD_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };
