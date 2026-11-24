import Link from "next/link";
import { CreditCard, GraduationCap } from "lucide-react";
import { BIM_FOUNDATIONS_PACKS, checkoutPath, studentProofPath } from "@/data/payment";
import { formatWholeAmountMad } from "@/lib/payments/format";

/**
 * Bloc tarifs de la page « Certification BIM Foundations – Professional ».
 * Affiché UNIQUEMENT si paymentLive === true (décision dans
 * app/formations/[slug]/page.tsx). Montants : BIM_FOUNDATIONS_PACKS
 * (data/payment.ts), synchronisés avec le seed de formation_prices.
 */
export function BimPricingBlock() {
  const { pro, student, pageSlug } = BIM_FOUNDATIONS_PACKS;
  const cardClass =
    "flex flex-col rounded-2xl border border-wl-border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)]";

  return (
    // Suit la section Témoignages (même fond, py-20) : padding haut réduit.
    <section id="tarifs" className="bg-wl-gray-light pt-2 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-wl-text">Tarifs</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-wl-text">{pro.shortLabel}</h3>
            <p className="mt-2 text-2xl font-bold text-wl-blue">
              {formatWholeAmountMad(pro.amountMad)} TTC
            </p>
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
            <h3 className="text-lg font-semibold text-wl-text">{student.shortLabel}</h3>
            <p className="mt-2 text-2xl font-bold text-wl-blue">
              {formatWholeAmountMad(student.amountMad)} TTC
            </p>
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
      </div>
    </section>
  );
}
