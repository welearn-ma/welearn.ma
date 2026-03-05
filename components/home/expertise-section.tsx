import { SectionHeader } from "@/components/section-header";
import { BarChart3, Briefcase, GraduationCap, MonitorPlay } from "lucide-react";

const expertiseDomains = [
  {
    name: "Étude de marché",
    color: "#1a3a52",
    icon: BarChart3,
    subcategories: ["Valeur", "Financement", "Ressources", "Stratégie"],
  },
  {
    name: "Business Model",
    color: "#2d5a7b",
    icon: Briefcase,
    subcategories: [
      "Innovation",
      "Benchmark",
      "Public cible",
      "Réglementation",
    ],
  },
  {
    name: "Ingénierie de formation",
    color: "#5a7d8c",
    icon: GraduationCap,
    subcategories: ["Programme", "Stratégie", "Ressources", "Expertise"],
  },
  {
    name: "Digital Learning",
    color: "#8fa6b8",
    icon: MonitorPlay,
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {expertiseDomains.map((domain, idx) => {
            const Icon = domain.icon;

            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 min-h-80 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-gray-300"
              >
                {/* Colored top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: domain.color }}
                />

                {/* Colored background accent (subtle) */}
                <div
                  className="absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-5 transition-all duration-300 group-hover:opacity-10"
                  style={{ backgroundColor: domain.color }}
                />

                <div className="relative flex h-full flex-col">
                  {/* Title */}
                  <div className="flex h-20 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100"
                      style={{ borderLeft: `3px solid ${domain.color}` }}
                    >
                      <Icon
                        size={20}
                        style={{ color: domain.color }}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-foreground leading-snug">
                      {domain.name}
                    </h3>
                  </div>

                  {/* Separator line */}
                  <div
                    className="mt-1 h-0.5 w-10"
                    style={{ backgroundColor: domain.color }}
                  />

                  {/* Subcategories */}
                  <div className="mt-8 flex flex-1 flex-wrap content-center gap-2.5">
                    {domain.subcategories.map((sub, subIdx) => (
                      <span
                        key={subIdx}
                        className="inline-block px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded transition-colors duration-200"
                        style={{
                          borderLeft: `3px solid ${domain.color}`,
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
