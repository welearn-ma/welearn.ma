"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, GraduationCap } from "lucide-react";
import { BIM_FOUNDATIONS_PACKS, checkoutPath, studentProofPath } from "@/data/payment";
import { fetchProduct, getPaymentsApiBaseUrl, type PublicPromotion } from "@/lib/api/payments";
import {
  formatAmountMad,
  formatOfferEnd,
  formatPromotionBadge,
  formatWholeAmountMad,
} from "@/lib/payments/format";

type PackPrice = { list: number; amount: number; promotion: PublicPromotion | null };
type Prices = { pro: PackPrice | null; student: PackPrice | null };

/** Au-delà, setTimeout se déclencherait immédiatement (2^31 − 1 ms). */
const MAX_TIMER_MS = 2_147_483_647;

/** « 8 500 MAD », « 6 375 MAD » ; décimales seulement si le montant en a. */
function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? formatWholeAmountMad(amount) : formatAmountMad(amount);
}

async function loadPrice(baseUrl: string, slug: string): Promise<PackPrice | null> {
  try {
    const product = await fetchProduct(baseUrl, slug);
    return product
      ? { list: product.list_amount_mad, amount: product.amount_mad, promotion: product.promotion }
      : null;
  } catch {
    return null;
  }
}

function PriceLine({ fallback, price }: { fallback: number; price: PackPrice | null }) {
  if (price?.promotion && price.amount < price.list) {
    return (
      <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-base text-wl-text-tertiary line-through">
          <span className="sr-only">Prix normal : </span>
          {formatPrice(price.list)} TTC
        </span>
        <span className="text-2xl font-bold text-wl-blue">
          <span className="sr-only">Prix promotionnel : </span>
          {formatPrice(price.amount)} TTC
        </span>
      </p>
    );
  }
  return (
    <p className="mt-2 text-2xl font-bold text-wl-blue">
      {formatPrice(price?.list ?? fallback)} TTC
    </p>
  );
}

function PromotionBadge({ promotion }: { promotion: PublicPromotion | null | undefined }) {
  if (!promotion) return null;
  return (
    <span className="shrink-0 rounded-full bg-wl-orange px-2.5 py-1 text-xs font-semibold text-white">
      {formatPromotionBadge(promotion)}
    </span>
  );
}

/**
 * Bloc tarifs de la page « Certification BIM Foundations – Professional ».
 * Affiché UNIQUEMENT si paymentLive === true (décision dans
 * app/formations/[slug]/page.tsx).
 *
 * Le HTML statique montre les prix catalogue de BIM_FOUNDATIONS_PACKS
 * (data/payment.ts). Au chargement, les prix et la promotion en cours sont
 * relus via GET /api/payments/products/:slug (heure du serveur) : une
 * promotion apparaît et disparaît sans nouveau build. Si l'API ne répond
 * pas, les prix catalogue restent affichés (le montant débité est toujours
 * celui de la page de paiement).
 */
export function BimPricingBlock() {
  const { pro, student, pageSlug } = BIM_FOUNDATIONS_PACKS;
  const [prices, setPrices] = useState<Prices>({ pro: null, student: null });
  const cardClass =
    "flex flex-col rounded-2xl border border-wl-border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)]";

  const refresh = useCallback(() => {
    const baseUrl = getPaymentsApiBaseUrl();
    if (!baseUrl) return;
    void Promise.all([loadPrice(baseUrl, pro.slug), loadPrice(baseUrl, student.slug)]).then(
      ([proPrice, studentPrice]) => setPrices({ pro: proPrice, student: studentPrice }),
    );
  }, [pro.slug, student.slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Fin de la promotion affichée : la page ouverte revient seule aux prix normaux.
  const promotion = prices.pro?.promotion ?? prices.student?.promotion ?? null;
  const promotionEnd = promotion?.ends_at;
  useEffect(() => {
    if (!promotionEnd) return;
    const delay = new Date(promotionEnd).getTime() - Date.now() + 1000;
    if (!(delay <= MAX_TIMER_MS)) return;
    const timer = window.setTimeout(refresh, Math.max(delay, 0));
    return () => window.clearTimeout(timer);
  }, [promotionEnd, refresh]);

  const offerEnd = promotion ? formatOfferEnd(promotion.ends_at) : null;

  return (
    // Suit la section Témoignages (même fond, py-20) : padding haut réduit.
    <section id="tarifs" className="bg-wl-gray-light pt-2 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-wl-text">Tarifs</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-wl-text">{pro.shortLabel}</h3>
              <PromotionBadge promotion={prices.pro?.promotion} />
            </div>
            <PriceLine fallback={pro.amountMad} price={prices.pro} />
            <div className="mt-6 flex flex-1 items-end">
              <Link
                href={checkoutPath(pro.slug)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-wl-blue px-4 text-sm font-medium text-white transition-colors hover:bg-wl-blue-dark"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Payer en ligne
              </Link>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-wl-text">{student.shortLabel}</h3>
              <PromotionBadge promotion={prices.student?.promotion} />
            </div>
            <PriceLine fallback={student.amountMad} price={prices.student} />
            <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
              <Link
                href={studentProofPath(pageSlug)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-wl-orange px-4 text-sm font-medium text-white transition-colors hover:bg-wl-orange-dark"
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Envoyer mon justificatif étudiant
              </Link>
              <Link
                href={checkoutPath(student.slug)}
                className="text-center text-sm font-medium text-wl-blue underline underline-offset-2 hover:no-underline"
              >
                J&apos;ai déjà mon code
              </Link>
            </div>
          </div>
        </div>
        {offerEnd ? (
          <p className="mt-4 text-sm font-medium text-wl-text-secondary">
            Offre valable jusqu&apos;au {offerEnd}
          </p>
        ) : null}
      </div>
    </section>
  );
}
