import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { TEST_PAYMENT_PRODUCT } from "@/data/payment";
import { CheckoutForm } from "@/features/payments/CheckoutForm";

/**
 * Page de test CMI CACHÉE (certification + lien de test demandé par Damane
 * Cash). Ne pas la lier depuis la navigation, le footer ou d'autres pages ;
 * ne pas l'ajouter à un sitemap ni à robots.txt.
 */
export const metadata: Metadata = {
  title: "Paiement (test) | Welearn",
  robots: { index: false, follow: false },
};

export default function TestPaymentPage() {
  return (
    <section className="bg-wl-gray-light py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        <div
          role="note"
          className="mb-6 flex items-start gap-2 rounded-xl border border-wl-orange/40 bg-wl-orange-tint px-4 py-3 text-sm font-medium text-wl-text"
        >
          <FlaskConical
            className="mt-0.5 h-4 w-4 shrink-0 text-wl-orange"
            aria-hidden="true"
          />
          <p>Page de test — paiement CMI (environnement de test)</p>
        </div>

        <CheckoutForm product={TEST_PAYMENT_PRODUCT} />
      </div>
    </section>
  );
}
