import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentResultFallback } from "@/features/payments/PaymentResult";
import { StudentProofForm } from "@/features/payments/StudentProofForm";

/**
 * Dépôt du justificatif étudiant (Pack Étudiants) :
 * /etudiant/justificatif/?formation=<slug de la page formation>. Non indexée.
 */
export const metadata: Metadata = {
  title: "Justificatif étudiant | Welearn",
  robots: { index: false, follow: false },
};

export default function StudentProofPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <StudentProofForm />
    </Suspense>
  );
}
