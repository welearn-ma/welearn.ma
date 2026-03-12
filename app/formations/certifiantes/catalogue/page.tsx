import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { FormationsCataloguePage } from "@/components/formations/formations-catalogue-page";

export const metadata: Metadata = {
  title: "Catalogue des Formations | Welearn",
  description:
    "Catalogue complet de formations certifiantes, diplomantes et sur mesure avec filtres par categorie, niveau, format, duree et domaine.",
};

export default function CataloguePage() {
  return (
    <>
      <PageHero
        title="Catalogue des Formations"
        description="Explorez nos formations certifiantes, diplomantes et sur mesure. Filtrez instantanement par categorie, format, niveau, duree et domaine."
        eyebrow="Catalogue Formations"
        size="sm"
      />
      <FormationsCataloguePage />
    </>
  );
}
