"use client";

import { useEffect, useState } from "react";
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
    // Montant renvoyé par le backend (jamais une valeur codée en dur).
    displayAmount: formatAmountMad(product.amount_mad),
    codeMode: isTest ? "none" : product.requires_student_code ? "required" : "optional",
    proofPath: product.requires_student_code ? proofPathFor(product.slug) : undefined,
  };
}

/**
 * /paiement/?produit=<slug> : libellé et prix lus via
 * GET /api/payments/products/<slug>. Seul `produit` est lu dans l'URL.
 */
export function ProductCheckout() {
  const slug = parseProductSlug(useSearchParams().get("produit"));
  const baseUrl = getPaymentsApiBaseUrl();
  const [state, setState] = useState<State>({ kind: "loading" });

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
        <CheckoutForm product={toCheckoutProduct(state.product)} />
      </div>
    </section>
  );
}
