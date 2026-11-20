import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentFailure } from "@/features/payments/PaymentFailure";
import { PaymentResultFallback } from "@/features/payments/PaymentResult";

/** Retour CMI / backend (/init, /return). Non indexée, liée nulle part sur le site. */
export const metadata: Metadata = {
  title: "Paiement non abouti | Welearn",
  robots: { index: false, follow: false },
};

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentFailure />
    </Suspense>
  );
}
