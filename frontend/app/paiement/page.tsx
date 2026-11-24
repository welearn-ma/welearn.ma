import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCheckout } from "@/features/payments/ProductCheckout";
import { PaymentResultFallback } from "@/features/payments/PaymentResult";

/**
 * Page de paiement /paiement/?produit=<slug>. Non indexée ; liée uniquement
 * depuis le bloc tarifs des pages formation (affiché si paymentLive) et les
 * e-mails de codes.
 */
export const metadata: Metadata = {
  title: "Paiement | Welearn",
  robots: { index: false, follow: false },
};

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <ProductCheckout />
    </Suspense>
  );
}
