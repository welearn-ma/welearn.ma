import type { Request, Response } from "express";
import { codeRejection, normalizeCode, priceOrder } from "../commerce/codes";
import type { PaymentStore } from "./store";

/*
 * Lecture publique du catalogue et verification de code (page de paiement) :
 *   GET  /products/:slug   -> { slug, label, amount_mad, requires_student_code }
 *   POST /codes/check      { product, code, email }
 *                          -> { valid: true, amount_mad, list_amount_mad, discount_mad }
 *                           | { valid: false }  (jamais de motif)
 * Le montant affiche vient d'ici ; le montant DEBITE est recalcule par
 * /cmi/init.
 */

const PRODUCT_SLUG_REGEX = /^[a-z0-9-]{1,100}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 64;

function stringField(body: unknown, key: string): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : null;
}

export function createCatalogHandlers({
  store,
  now = () => new Date(),
}: {
  store: PaymentStore;
  now?: () => Date;
}) {
  async function product(req: Request, res: Response): Promise<void> {
    const slug = String(req.params.slug ?? "");
    if (!PRODUCT_SLUG_REGEX.test(slug)) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    try {
      const found = await store.getProduct(slug);
      if (!found || !found.active) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.status(200).json({
        slug: found.slug,
        label: found.label,
        amount_mad: found.amount_mad,
        requires_student_code: found.requires_student_code,
      });
    } catch (error) {
      console.error(
        `[payments] product lookup failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      res.status(500).json({ error: "internal" });
    }
  }

  async function checkCode(req: Request, res: Response): Promise<void> {
    const invalid = () => res.status(200).json({ valid: false });

    const productSlug = stringField(req.body, "product");
    const codeInput = stringField(req.body, "code");
    const email = stringField(req.body, "email");
    if (
      !productSlug ||
      !PRODUCT_SLUG_REGEX.test(productSlug) ||
      !codeInput ||
      !email ||
      email.length > MAX_EMAIL_LENGTH ||
      !EMAIL_REGEX.test(email)
    ) {
      invalid();
      return;
    }
    const canonical = normalizeCode(codeInput);
    if (!canonical) {
      invalid();
      return;
    }

    try {
      const found = await store.getProduct(productSlug);
      if (!found || !found.active) {
        invalid();
        return;
      }
      const code = await store.findCodeByCode(canonical);
      if (!code || codeRejection(code, { product: found, email, now: now() })) {
        invalid();
        return;
      }
      const pricing = priceOrder(found.amount_mad, code);
      res.status(200).json({
        valid: true,
        amount_mad: pricing.amount_mad,
        list_amount_mad: pricing.list_amount_mad,
        discount_mad: pricing.discount_mad,
      });
    } catch (error) {
      console.error(
        `[payments] code check failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      res.status(500).json({ valid: false });
    }
  }

  return { product, checkCode };
}
