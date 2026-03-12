import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { FormationsCataloguePage } from "@/components/formations/formations-catalogue-page";

export const metadata: Metadata = {
  title: "Catalogue Certifications & Formations Courtes | Welearn",
  description:
    "Catalogue des formations certifiantes et formations courtes Welearn, avec filtres instantanes par type, domaine, format et niveau.",
};

export default function CataloguePage() {
  return (
    <>
      <PageHero
        title="Certifications & Formations Courtes"
        description="Explorez uniquement les certifications et formations courtes Welearn. Les programmes diplomants sont disponibles dans la section Masters."
        eyebrow="Catalogue Formations"
        size="sm"
      />
      <FormationsCataloguePage />
    </>
  );
}
