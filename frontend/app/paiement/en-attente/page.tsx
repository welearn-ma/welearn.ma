import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentConfirmation } from "@/features/payments/PaymentConfirmation";
import { PaymentResultFallback } from "@/features/payments/PaymentResult";

/** Retour CMI (backend /return). Non indexée, liée nulle part sur le site. */
export const metadata: Metadata = {
  title: "Paiement en cours de confirmation | Welearn",
  robots: { index: false, follow: false },
};

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentConfirmation mode="en-attente" />
    </Suspense>
  );
}
