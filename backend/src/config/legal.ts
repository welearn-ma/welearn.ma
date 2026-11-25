/**
 * Version des CGV acceptees au moment de la commande, enregistree dans
 * orders.cgv_version.
 *
 * DOIT TOUJOURS etre egale a CGV_LAST_UPDATED dans frontend/data/legal.ts
 * (date affichee sur /cgv). A mettre a jour dans les DEUX fichiers a chaque
 * nouvelle version des CGV ; src/config/__tests__/legal.test.ts echoue si
 * les deux valeurs different.
 */
export const CGV_VERSION = "24/11/2026";

/**
 * Telephone de contact cite dans les e-mails clients (confirmation de
 * paiement). Miroir de legalEntity.phone dans frontend/data/legal.ts : a
 * mettre a jour dans les DEUX fichiers.
 */
export const CONTACT_PHONE = "+212 661 499 479";
