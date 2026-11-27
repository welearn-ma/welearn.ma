"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, FlaskConical } from "lucide-react";
import {
  BIM_FOUNDATIONS_PACKS,
  TEST_PAYMENT_PRODUCT,
  studentProofPath,
} from "@/data/payment";
import {
  fetchProduct,
  getPaymentsApiBaseUrl,
  parseProductSlug,
  type ProductInfo,
} from "@/lib/api/payments";
import { normalizeCode } from "@/lib/payments/code";
import { formatAmountMad } from "@/lib/payments/format";
import { CheckoutForm, type CheckoutProduct } from "./CheckoutForm";
import {
  PaymentContactLine,
  PaymentResultFallback,
  PaymentResultHeader,
  PaymentResultShell,
  PaymentResultText,
} from "./PaymentResult";

type State =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "unavailable" }
  | { kind: "ready"; product: ProductInfo };

/** Au-delà, setTimeout se déclencherait immédiatement (2^31 − 1 ms). */
const MAX_TIMER_MS = 2_147_483_647;

/** Page de dépôt du justificatif associée à un produit « étudiant ». */
function proofPathFor(slug: string): string | undefined {
  return slug === BIM_FOUNDATIONS_PACKS.student.slug
    ? studentProofPath(BIM_FOUNDATIONS_PACKS.pageSlug)
    : undefined;
}

function toCheckoutProduct(product: ProductInfo): CheckoutProduct {
  const isTest = product.slug === TEST_PAYMENT_PRODUCT.slug;
  return {
    slug: product.slug,
    label: product.label,
    // Montants renvoyés par le backend (jamais une valeur codée en dur) :
    // montant à payer, promotion en cours comprise.
    displayAmount: formatAmountMad(product.amount_mad),
    pricing: {
      amount: product.amount_mad,
      list: product.list_amount_mad,
      discount: product.discount_mad,
      promotion: product.promotion,
    },
    codeMode: isTest ? "none" : product.requires_student_code ? "required" : "optional",
    proofPath: product.requires_student_code ? proofPathFor(product.slug) : undefined,
  };
}

/**
 * /paiement/?produit=<slug>[&code=<WL-XXXX-XXXX>] : libellé, prix et
 * promotion en cours lus via GET /api/payments/products/<slug> (heure du
 * serveur). Seuls `produit` et `code` (lien de l'e-mail de validation,
 * pré-remplit le champ si son format est valide) sont lus dans l'URL ;
 * jamais l'e-mail.
 *
 * `code` est lu une seule fois puis retiré de la barre d'adresse
 * (history.replaceState, `produit` conservé) : il ne reste ni dans l'URL
 * affichée ni dans l'historique.
 *
 * Fin d'une promotion affichée : le produit est relu à `ends_at` sans
 * démonter le formulaire (les champs saisis sont conservés).
 */
export function ProductCheckout() {
  const searchParams = useSearchParams();
  const slug = parseProductSlug(searchParams.get("produit"));
  // Lu au premier rendu : replaceState met à jour useSearchParams, le code
  // doit survivre à son retrait de l'URL.
  const [linkCode] = useState(() => normalizeCode(searchParams.get("code") ?? ""));
  const baseUrl = getPaymentsApiBaseUrl();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("code")) return;
    url.searchParams.delete("code");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    if (!slug) {
      setState({ kind: "missing" });
      return;
    }
    if (!baseUrl) {
      setState({ kind: "unavailable" });
      return;
    }
    const controller = new AbortController();
    setState({ kind: "loading" });
    fetchProduct(baseUrl, slug, controller.signal)
      .then((product) => setState(product ? { kind: "ready", product } : { kind: "missing" }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: "unavailable" });
      });
    return () => controller.abort();
  }, [slug, baseUrl]);

  /** Relit le produit sans repasser par l'écran de chargement. */
  const refreshProduct = useCallback(() => {
    if (!slug || !baseUrl) return;
    fetchProduct(baseUrl, slug)
      .then((product) => setState(product ? { kind: "ready", product } : { kind: "missing" }))
      .catch(() => setState({ kind: "unavailable" }));
  }, [slug, baseUrl]);

  const promotionEnd = state.kind === "ready" ? state.product.promotion?.ends_at : undefined;
  useEffect(() => {
    if (!promotionEnd) return;
    const delay = new Date(promotionEnd).getTime() - Date.now() + 1000;
    if (!(delay <= MAX_TIMER_MS)) return;
    const timer = window.setTimeout(refreshProduct, Math.max(delay, 0));
    return () => window.clearTimeout(timer);
  }, [promotionEnd, refreshProduct]);

  if (state.kind === "loading") {
    return <PaymentResultFallback />;
  }

  if (state.kind !== "ready") {
    return (
      <PaymentResultShell>
        <PaymentResultHeader
          tone="warning"
          icon={AlertCircle}
          title={state.kind === "missing" ? "Offre indisponible" : "Paiement indisponible"}
        />
        <PaymentResultText>
          {state.kind === "missing"
            ? "Cette offre n'est pas disponible au paiement en ligne."
            : "Le paiement en ligne est momentanément indisponible. Merci de réessayer plus tard ou de nous contacter."}
        </PaymentResultText>
        <PaymentContactLine />
      </PaymentResultShell>
    );
  }

  const isTest = state.product.slug === TEST_PAYMENT_PRODUCT.slug;
  return (
    <section className="bg-wl-gray-light py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        {isTest ? (
          <div
            role="note"
            className="mb-6 flex items-start gap-2 rounded-xl border border-wl-orange/40 bg-wl-orange-tint px-4 py-3 text-sm font-medium text-wl-text"
          >
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-wl-orange" aria-hidden="true" />
            <p>Page de test — paiement CMI (environnement de test)</p>
          </div>
        ) : null}
        <CheckoutForm
          product={toCheckoutProduct(state.product)}
          initialCode={linkCode}
          onPricingExpired={refreshProduct}
        />
      </div>
    </section>
  );
}
