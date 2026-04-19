import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        title="Solutions Digital Learning"
        description="Plateforme LMS, contenus sur-mesure et bibliothèque de cours pour digitaliser vos formations."
        eyebrow="Formation digitale"
        size="lg"
      />

      <DigitalLearningSolutionsSection />
      <DigitalLearningCta />
    </>
  );
}
