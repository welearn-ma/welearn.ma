import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { DigitalLearningSolutionsSection } from "@/components/digital-learning/solutions-section";
import { DigitalLearningCta } from "@/components/digital-learning/digital-learning-cta";

export const metadata: Metadata = {
  title: "Solutions Digital Learning | Welearn",
  description:
    "Plateforme LMS, développement de contenus e-learning et bibliothèque de cours pour la construction.",
};

export default function DigitalLearningPage() {
  return (
    <>
      <Breadcrumb />
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Formation digitale
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Solutions Digital Learning
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Plateforme LMS, contenus sur-mesure et bibliothèque de cours pour
            digitaliser vos formations.
          </p>
        </div>
      </section>

      <DigitalLearningSolutionsSection />
      <DigitalLearningCta />
    </>
  );
}
