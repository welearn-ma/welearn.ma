import { SectionHeader } from "@/components/section-header";
import { Timeline } from "@/components/timeline";
import { Award, Calendar, TrendingUp, Globe } from "lucide-react";

const milestones = [
  {
    year: "2018",
    title: "Création de Welearn",
    description:
      "Fondation de Welearn avec la vision de transformer la formation dans le secteur de la Construction au Maroc.",
    icon: Calendar,
  },
  {
    year: "2019",
    title: "Label JEI France",
    description:
      "Obtention du label Jeune Entreprise Innovante® en France, reconnaissance de notre approche pionnière.",
    icon: Award,
  },
  {
    year: "2020",
    title: "Expansion digitale",
    description:
      "Lancement de notre plateforme LMS et développement de notre offre de formation à distance.",
    icon: TrendingUp,
  },
  {
    year: "2021",
    title: "Partenariats académiques",
    description:
      "Signature de partenariats stratégiques avec l'EHTP et ESLSCA pour les programmes diplômants.",
    icon: Globe,
  },
  {
    year: "2022",
    title: "Label JEI Maroc",
    description:
      "Reconnaissance comme Jeune Entreprise Innovante® au Maroc par l'ADD.",
    icon: Award,
  },
  {
    year: "2023",
    title: "Expansion régionale",
    description:
      "Développement de notre présence en Afrique francophone et lancement de nouveaux programmes.",
    icon: Globe,
  },
];

export function HistorySection() {
  return (
    <section id="histoire" className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Notre parcours"
          title="Notre Histoire"
          description="De la vision à la réalité : découvrez le parcours de Welearn depuis sa création."
        />
        <Timeline items={milestones} />
      </div>
    </section>
  );
}
