import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { IngenierieIntroSection } from "@/components/ingenierie/intro-section";
import { ProcessStepsSection } from "@/components/ingenierie/process-steps-section";
import { CorporateAcademySection } from "@/components/ingenierie/corporate-academy-section";
import { ParcoursExamplesSection } from "@/components/ingenierie/parcours-examples-section";

export const metadata: Metadata = {
  title: "Ingénierie de Formation | Welearn",
  description:
    "Solutions sur-mesure pour entreprises : analyse des besoins, conception pédagogique, académies d'entreprise.",
};

export default function IngenieriePage() {
  return (
    <>
      <Breadcrumb />
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Solutions sur-mesure
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Ingénierie de Formation
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Des solutions personnalisées pour développer les compétences de vos
            équipes et créer votre propre académie d'entreprise.
          </p>
        </div>
      </section>

      <IngenierieIntroSection />
      <ProcessStepsSection />
      <CorporateAcademySection />
      <ParcoursExamplesSection />
    </>
  );
}
