import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { LEGAL_LAST_UPDATED } from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Politique de remboursement | Welearn",
    description:
      "Politique d’annulation et de remboursement des formations Welearn : rétractation, annulation, procédure de demande et délais de traitement.",
  };
}

const linkClass = "text-wl-blue underline underline-offset-2 hover:no-underline";

export default function RemboursementPage() {
  return (
    <>
      <PageHero
        title="Politique de remboursement"
        description="Conditions d’annulation et de remboursement des formations Welearn."
        size="sm"
      />

      <article className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm text-wl-text-secondary mb-10">
            Dernière mise à jour : {LEGAL_LAST_UPDATED}
          </p>

          <div className="wl-prose">
            <p>
              La présente politique fait partie intégrante des{" "}
              <Link href="/cgv" className={linkClass}>
                Conditions Générales
              </Link>
              .
            </p>

            <h2>1. Délai de rétractation</h2>
            <p>[À COMPLÉTER]</p>

            <h2>2. Annulation avant le début de la formation</h2>
            <p>[À COMPLÉTER]</p>

            <h2>3. Annulation après le début de la formation</h2>
            <p>[À COMPLÉTER]</p>

            <h2>4. Cas de non-remboursement</h2>
            <p>[À COMPLÉTER]</p>

            <h2>5. Procédure de demande de remboursement</h2>
            <p>[À COMPLÉTER]</p>

            <h2>
              6. Délai de traitement et remboursement sur la carte ayant servi
              au paiement
            </h2>
            <p>[À COMPLÉTER]</p>

            <h2>7. Contact réclamations</h2>
            <p>[À COMPLÉTER]</p>
          </div>
        </div>
      </article>
    </>
  );
}
