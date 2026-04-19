import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { StatsSection } from "@/components/formations/stats-section";
import { CategoriesSection } from "@/components/formations/categories-section";
import { FormationsCta } from "@/components/formations/formations-cta";

export const metadata: Metadata = {
  title: "Formations | Welearn",
  description:
    "Découvrez notre catalogue de formations diplômantes et certifiantes dans le BTP, BIM et management de projet.",
};

export default function FormationsPage() {
  return (
    <>
      <PageHero
        title="Nos Formations"
        description="Des programmes adaptés à tous les profils : formations diplômantes, certifiantes et sur mesure pour le secteur de la Construction."
        eyebrow="Catalogue de formations"
        size="lg"
      />

      <StatsSection />
      <CategoriesSection />
      <FormationsCta />
    </>
  );
}
