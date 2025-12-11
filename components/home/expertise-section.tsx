import { SectionHeader } from "@/components/section-header";
import { Zap, BarChart3, Briefcase, Building2 } from "lucide-react";

const expertiseAreas = [
  {
    icon: Zap,
    title: "Étude de marché",
    description:
      "Analyse stratégique des tendances et opportunités du secteur construction.",
    subcategories: ["Valeur", "Financement", "Ressources", "Stratégie"],
  },
  {
    icon: BarChart3,
    title: "Business Model",
    description:
      "Modèles économiques et stratégies de développement pour entreprises BTP.",
    subcategories: [
      "Innovation",
      "Benchmark",
      "Public cible",
      "Réglementation",
    ],
  },
  {
    icon: Building2,
    title: "Ingénierie de formation",
    description:
      "Conception et déploiement de dispositifs de formation adaptés aux besoins.",
    subcategories: ["Programme", "Stratégie", "Ressources", "Expertise"],
  },
  {
    icon: Briefcase,
    title: "Digital Learning",
    description:
      "Solutions digitales pour transformation pédagogique et e-learning.",
    subcategories: ["Scénarisation", "Contenu", "Audiovisuel", "LMS"],
  },
];

export function ExpertiseSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos domaines d'expertise"
          title="Nos domaines d'expertise"
          description="Une couverture complète des besoins en formation et conseil pour le secteur de la construction."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="group p-8 bg-secondary rounded-2xl hover:bg-(--color-welearn-navy) transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div>
                <div className="p-4 bg-primary/10 group-hover:bg-white/10 rounded-xl w-fit mb-6 transition-colors">
                  <area.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-sans text-2xl font-bold mb-3 text-foreground group-hover:text-white transition-colors">
                  {area.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                  {area.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-6">
                {area.subcategories.map((subcategory, idx) => (
                  <span
                    key={idx}
                    className="text-sm px-3 py-1 bg-white group-hover:bg-white/20 text-primary group-hover:text-white rounded-full font-medium transition-colors"
                  >
                    {subcategory}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
