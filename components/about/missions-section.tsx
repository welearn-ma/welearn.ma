import { SectionHeader } from "@/components/section-header";
import { CardGrid } from "@/components/card-grid";
import { Target, Lightbulb, Users, Globe, BookOpen, Zap } from "lucide-react";

const missions = [
  {
    icon: Target,
    title: "Former les professionnels de demain",
    description:
      "Proposer des formations de haute qualité adaptées aux enjeux contemporains du secteur de la Construction.",
    color: "bg-primary",
  },
  {
    icon: Lightbulb,
    title: "Innover en pédagogie",
    description:
      "Développer des méthodes d'apprentissage innovantes combinant expertise technique et outils numériques.",
    color: "bg-primary",
  },
  {
    icon: Users,
    title: "Accompagner les entreprises",
    description:
      "Être le partenaire privilégié des entreprises du BTP dans leur stratégie de développement des compétences.",
    color: "bg-primary",
  },
  {
    icon: Globe,
    title: "Rayonner en Afrique",
    description:
      "Contribuer au développement des compétences dans le secteur de la Construction à l'échelle du continent.",
    color: "bg-primary",
  },
  {
    icon: BookOpen,
    title: "Valoriser les certifications",
    description:
      "Permettre l'accès aux certifications internationales reconnues (BIM, PMP®) pour valoriser les parcours.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Accélérer la transformation",
    description:
      "Accompagner la transformation numérique du secteur de la Construction par la formation et le conseil.",
    color: "bg-primary",
  },
];

export function MissionsSection() {
  return (
    <section id="missions" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Notre engagement"
          title="Nos Missions"
          description="Les missions qui guident notre action au quotidien pour transformer la formation professionnelle."
        />
        <CardGrid items={missions} columns={3} />
      </div>
    </section>
  );
}
