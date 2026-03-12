import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { OverviewSection } from "@/components/about/overview-section";
import { HistorySection } from "@/components/about/history-section";
import { MissionsSection } from "@/components/about/missions-section";
import { ApproachSection } from "@/components/about/approach-section";
import { ValuesSection } from "@/components/about/values-section";
import { TeamSection } from "@/components/about/team-section";
import { ReferencesSection } from "@/components/about/references-section";
import { Award } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos | Welearn",
  description:
    "Découvrez Welearn, EdTech innovante dédiée au secteur de la Construction. Jeune Entreprise Innovante® en France et au Maroc.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="À propos de Welearn"
        description="EdTech destinée au secteur de la Construction, reconnue comme Jeune Entreprise Innovante® en France et au Maroc."
        badge={{ icon: Award, text: "Jeune Entreprise Innovante®" }}
      />
      <OverviewSection />
      <HistorySection />
      <MissionsSection />
      <ApproachSection />
      <ValuesSection />
      <TeamSection />
      <ReferencesSection />
    </>
  );
}
