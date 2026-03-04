import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Award } from "lucide-react";
import { CertifiantesSections } from "@/components/formations/certifiantes-sections";
import { EntrepriseCta } from "@/components/formations/entreprise-cta";

export const metadata: Metadata = {
  title: "Formations Certifiantes | Welearn",
  description:
    "Certifications professionnelles BIM et formations sur mesure pour les entreprises.",
};

export default function CertifiantesPage() {
  return (
    <>
      <PageHero
        title="Certifications & Formations Intra"
        description="Certifications internationales et formations sur mesure pour développer les compétences de vos équipes."
        eyebrow="Formations Certifiantes"
        size="sm"
      />

      <CertifiantesSections />
      <EntrepriseCta />
    </>
  );
}
