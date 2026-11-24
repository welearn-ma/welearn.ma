/**
 * Produits payables en ligne (CMI).
 *
 * Les montants affiches ici sont informatifs : le backend lit toujours le
 * montant reel dans la table `formation_prices` (backend/src/payments) et la
 * page de paiement affiche ce que renvoie l'API.
 */

export type PaymentProduct = {
  /** Valeur postée dans `formation_slug` (clé de `formation_prices`). */
  readonly slug: string;
  readonly label: string;
  /** Montant affiché, format français, sans « TTC ». */
  readonly displayAmount: string;
};

/** Produit de test de la page cachée /paiement/test/ (certification CMI). */
export const TEST_PAYMENT_PRODUCT: PaymentProduct = {
  slug: "test-paiement-cmi",
  label: "Test paiement CMI",
  displayAmount: "10,00 MAD",
};

/**
 * Packs de la certification BIM Foundations Professional.
 * SYNCHRO : slugs, libellés et montants identiques au seed de
 * backend/migrations/20261124000000_cmi_products_codes_students.sql.
 */
export const BIM_FOUNDATIONS_PACKS = {
  /** Page formation (frontend/data/formations.ts). */
  pageSlug: "bim-foundations-professional",
  pro: {
    slug: "bim-foundations-pro",
    label: "BIM Foundations Professional — Pack Professionnels",
    shortLabel: "Pack Professionnels",
    amountMad: 8500,
  },
  student: {
    slug: "bim-foundations-etudiant",
    label: "BIM Foundations Professional — Pack Étudiants",
    shortLabel: "Pack Étudiants",
    amountMad: 5000,
  },
} as const;

/** Libellés connus, pour afficher une commande à partir de `formation_slug`. */
const PRODUCT_LABELS: ReadonlyMap<string, string> = new Map([
  [TEST_PAYMENT_PRODUCT.slug, TEST_PAYMENT_PRODUCT.label],
  [BIM_FOUNDATIONS_PACKS.pro.slug, BIM_FOUNDATIONS_PACKS.pro.label],
  [BIM_FOUNDATIONS_PACKS.student.slug, BIM_FOUNDATIONS_PACKS.student.label],
]);

/** Libellé de la formation ; slug brut si le produit n'est pas connu ici. */
export function formationLabelForSlug(slug: string): string {
  return PRODUCT_LABELS.get(slug) ?? slug;
}

/**
 * Formations proposant un Pack Étudiants : titre affiché sur la page de dépôt
 * du justificatif (titre exact de frontend/data/formations.ts).
 */
export const STUDENT_PROOF_FORMATIONS: Readonly<Record<string, string>> = {
  [BIM_FOUNDATIONS_PACKS.pageSlug]: "Certification BIM Foundations – Professional",
};

/** Page de paiement d'un produit (la page de test pour le produit de test). */
export function checkoutPath(productSlug: string): string {
  return productSlug === TEST_PAYMENT_PRODUCT.slug
    ? "/paiement/test/"
    : `/paiement/?produit=${encodeURIComponent(productSlug)}`;
}

/** Page de dépôt du justificatif étudiant d'une formation. */
export function studentProofPath(pageSlug: string): string {
  return `/etudiant/justificatif/?formation=${encodeURIComponent(pageSlug)}`;
}

/**
 * Cible par défaut du bouton « Réessayer » de /paiement/echec/, quand le
 * produit de la dernière tentative est inconnu (voir LAST_CHECKOUT_KEY).
 * Dernier produit connu : sa page de paiement (/paiement/test/ pour le
 * produit de test), via checkoutPath().
 */
export const PAYMENT_RETRY_PATH = "/formations/bim-foundations-professional/";

/** sessionStorage : slug du dernier produit envoyé au paiement (bouton « Réessayer »). */
export const LAST_CHECKOUT_KEY = "wl_last_checkout_product";
