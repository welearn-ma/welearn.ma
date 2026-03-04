import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GraduationCap } from "lucide-react";
import { DiplomantesProgramsSection } from "@/components/formations/diplomantes-programs-section";

export const metadata: Metadata = {
  title: "Formations Diplômantes | Welearn",
  description:
    "Executive Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
};

export default function DiplomantesPage() {
  return (
    <>
      <PageHero
        title="Masters & Licences Professionnelles"
        description="Des programmes accrédités en partenariat avec les grandes écoles d'ingénieurs et universités."
        eyebrow="Formations Diplômantes"
        size="sm"
      />

      <DiplomantesProgramsSection />
    </>
  );
}
