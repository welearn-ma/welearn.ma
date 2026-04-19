import type { Metadata } from "next";
import { AboutHero } from "@/components/about/overview-section";
import { HistorySection } from "@/components/about/history-section";
import { ValuesSection } from "@/components/about/values-section";
import { TeamSection } from "@/components/about/team-section";
import { DifferentiatorsSection } from "@/components/about/approach-section";
import { AboutCTA } from "@/components/about/missions-section";

export const metadata: Metadata = {
  title: "À propos | Welearn",
  description:
    "Découvrez Welearn, EdTech innovante dédiée au secteur de la Construction. Jeune Entreprise Innovante® en France et au Maroc.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <HistorySection />
      <ValuesSection />
      <TeamSection />
      <DifferentiatorsSection />
      <AboutCTA />
    </>
  );
}
