import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageHero } from "@/components/page-hero";
import { FormationsCataloguePage } from "@/components/formations/formations-catalogue-page";

export const metadata: Metadata = {
  title: "Formations Certifiantes | Welearn",
  description:
    "Certifications professionnelles BIM et formations sur mesure pour les entreprises.",
};

export default function CertifiantesPage() {
  return (
    <>
      <Breadcrumb />
      <PageHero
        title="Certifications & Formations Intra"
        description="Certifications internationales et formations sur mesure pour développer les compétences de vos équipes."
        eyebrow="Formations Certifiantes"
        size="sm"
      />

      <FormationsCataloguePage />
    </>
  );
}
