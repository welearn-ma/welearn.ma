import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentConfirmation } from "@/features/payments/PaymentConfirmation";
import { PaymentResultFallback } from "@/features/payments/PaymentResult";

/** Retour CMI (backend /return). Non indexée, liée nulle part sur le site. */
export const metadata: Metadata = {
  title: "Vérification du paiement | Welearn",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentConfirmation mode="succes" />
    </Suspense>
  );
}
