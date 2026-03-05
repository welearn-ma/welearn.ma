import { SectionHeader } from "@/components/section-header";

const expertiseDomains = [
  {
    name: "Étude de marché",
    color: "#1a3a52",
    subcategories: ["Valeur", "Financement", "Ressources", "Stratégie"],
  },
  {
    name: "Business Model",
    color: "#2d5a7b",
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
    subcategories: ["Programme", "Stratégie", "Ressources", "Expertise"],
  },
  {
    name: "Digital Learning",
    color: "#8fa6b8",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseDomains.map((domain, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
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

              <div className="relative">
                {/* Title */}
                <h3 className="font-sans text-lg font-bold text-foreground mb-4 leading-snug">
                  {domain.name}
                </h3>

                {/* Separator line */}
                <div
                  className="mb-4 h-0.5 w-8"
                  style={{ backgroundColor: domain.color }}
                />

                {/* Subcategories */}
                <div className="flex flex-wrap gap-2">
                  {domain.subcategories.map((sub, subIdx) => (
                    <span
                      key={subIdx}
                      className="inline-block px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded transition-colors duration-200"
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
          ))}
        </div>
      </div>
    </section>
  );
}
