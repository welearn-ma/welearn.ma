import { randomInt } from "crypto";
import { TEST_PRODUCT_SLUG } from "../config/commerce";
import { amountToCents } from "../payments/cmi/amount";
import type { PromotionRecord } from "./promotions";
import type { CodeRecord, ProductRecord } from "./types";

/**
 * Codes personnels "WL-XXXX-XXXX" (etudiant ou reduction).
 * Alphabet sans caracteres ambigus 0 / O / 1 / I (32 symboles, 8 tires :
 * 32^8 ~ 1,1e12 combinaisons). Unicite garantie par codes.code UNIQUE.
 */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_PATTERN = /^WL-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
const MAX_CODE_INPUT_LENGTH = 64;

function randomGroup(): string {
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return out;
}

export function generateCode(): string {
  return `WL-${randomGroup()}-${randomGroup()}`;
}

/**
 * Saisie du client -> code canonique, ou null si le format est impossible.
 * Tolere minuscules, espaces et tirets manquants ("wl abcd efgh").
 */
export function normalizeCode(input: string): string | null {
  if (input.length > MAX_CODE_INPUT_LENGTH) {
    return null;
  }
  const compact = input.toUpperCase().replace(/[\s-]/g, "");
  const match = /^WL([A-Z0-9]{4})([A-Z0-9]{4})$/.exec(compact);
  if (!match) {
    return null;
  }
  const code = `WL-${match[1]}-${match[2]}`;
  return CODE_PATTERN.test(code) ? code : null;
}

/** Raison interne d'un refus : journalisable, JAMAIS renvoyee au client. */
export type CodeRejection =
  | "revoked"
  | "expired"
  | "used_up"
  | "email_mismatch"
  | "product_mismatch";

/**
 * Produit accepte par le code :
 * - etudiant  : uniquement son produit, qui doit exiger un code etudiant ;
 * - reduction : jamais le produit de test ni un produit "etudiant" ; tout
 *   autre produit si product_slug est null, sinon ce produit seulement.
 */
function productAccepts(code: CodeRecord, product: ProductRecord): boolean {
  if (code.kind === "student") {
    return product.requires_student_code && code.product_slug === product.slug;
  }
  if (product.slug === TEST_PRODUCT_SLUG || product.requires_student_code) {
    return false;
  }
  return code.product_slug === null || code.product_slug === product.slug;
}

export function codeRejection(
  code: CodeRecord,
  context: { product: ProductRecord; email: string; now: Date },
): CodeRejection | null {
  if (code.revoked_at) {
    return "revoked";
  }
  const expiresAt = new Date(code.expires_at).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= context.now.getTime()) {
    return "expired";
  }
  if (code.used_count >= code.max_uses) {
    return "used_up";
  }
  if (code.customer_email.toLowerCase() !== context.email.trim().toLowerCase()) {
    return "email_mismatch";
  }
  if (!productAccepts(code, context.product)) {
    return "product_mismatch";
  }
  return null;
}

export interface OrderPricing {
  list_amount_mad: number;
  discount_mad: number;
  /** Montant reellement debite. */
  amount_mad: number;
}

/** n / d arrondi a l'entier, demi vers le haut (n, d entiers positifs). */
function divideRoundHalfUp(numerator: number, denominator: number): number {
  return Math.floor((numerator + denominator / 2) / denominator);
}

/**
 * Montant a debiter, calcule en centimes entiers :
 *   montant = arrondi_demi_haut(prix x (1 - pourcentage / 100), 2 decimales)
 * ex. 8 500,00 a -5 % -> 8 075,00. Un code etudiant ne donne pas de remise.
 *
 * Promotion en cours : son pourcentage s'applique et un code de reduction
 * ne s'y ajoute JAMAIS (non cumulables, CGV art. 5). Les appelants refusent
 * d'ailleurs un code de reduction pendant une promotion ; s'il passait
 * quand meme, seule la promotion compterait.
 * ex. 8 500,00 a -25 % -> 6 375,00 ; 5 000,00 -> 3 750,00.
 */
export function priceOrder(
  listAmountMad: number,
  code: CodeRecord | null,
  promotion: PromotionRecord | null = null,
): OrderPricing {
  const listCents = amountToCents(listAmountMad);
  let amountCents = listCents;

  const percent = promotion
    ? promotion.percent_off
    : code?.kind === "discount"
      ? code.percent_off
      : null;
  if (percent !== null) {
    // Pourcentage a 2 decimales (numeric(5,2)) -> points de base entiers.
    const basisPoints = Math.round(percent * 100);
    amountCents = divideRoundHalfUp(listCents * (10000 - basisPoints), 10000);
  }

  return {
    list_amount_mad: listCents / 100,
    discount_mad: (listCents - amountCents) / 100,
    amount_mad: amountCents / 100,
  };
}
