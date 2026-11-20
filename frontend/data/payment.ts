/**
 * Produits payables en ligne (CMI).
 *
 * Le montant affiché est purement informatif : le backend lit toujours le
 * montant réel dans la table `formation_prices` (backend/src/payments).
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

/** Produits connus, pour afficher un libellé à partir de `formation_slug`. */
const PAYMENT_PRODUCTS: ReadonlyArray<PaymentProduct> = [TEST_PAYMENT_PRODUCT];

/** Libellé de la formation ; slug brut si le produit n'est pas connu ici. */
export function formationLabelForSlug(slug: string): string {
  return PAYMENT_PRODUCTS.find((product) => product.slug === slug)?.label ?? slug;
}

/**
 * Cible du bouton « Réessayer » de /paiement/echec/. Pointe vers la page de
 * test tant que le vrai tunnel de paiement n'existe pas.
 */
export const PAYMENT_RETRY_PATH = "/paiement/test/";
