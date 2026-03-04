import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Building2, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Études de cas | Welearn",
  description:
    "Découvrez comment nos clients ont transformé leurs équipes grâce à la formation Welearn.",
};

const caseStudies = [
  {
    id: 1,
    client: "Grand Groupe BTP",
    sector: "Construction",
    title: "Déploiement BIM pour 500 collaborateurs",
    challenge:
      "Former l'ensemble des équipes projet aux méthodologies BIM en 12 mois.",
    solution:
      "Programme blended learning avec certification interne et accompagnement terrain.",
    results: [
      "500 collaborateurs formés",
      "85% de satisfaction",
      "Adoption BIM x3",
    ],
  },
  {
    id: 2,
    client: "Promoteur Immobilier National",
    sector: "Immobilier",
    title: "Académie corporate sur-mesure",
    challenge:
      "Créer un dispositif de formation continue pour fidéliser et développer les talents.",
    solution:
      "Conception et déploiement d'une académie interne avec parcours métiers.",
    results: ["12 parcours créés", "Turnover -25%", "ROI en 18 mois"],
  },
  {
    id: 3,
    client: "Bureau de Contrôle",
    sector: "Contrôle technique",
    title: "Mise à niveau réglementaire",
    challenge:
      "Actualiser les compétences de 200 inspecteurs sur les nouvelles réglementations.",
    solution: "Modules e-learning + sessions présentielles régionales.",
    results: [
      "100% de conformité",
      "Formation en 6 mois",
      "0 interruption d'activité",
    ],
  },
  {
    id: 4,
    client: "Cabinet d'Architecture",
    sector: "Architecture",
    title: "Transition digitale et BIM",
    challenge:
      "Accompagner la transition vers le full-BIM pour un cabinet de 80 architectes.",
    solution:
      "Audit, formation progressive et coaching individuel des chefs de projet.",
    results: ["Productivité +40%", "Nouveaux marchés", "Label BIM obtenu"],
  },
];

export default function EtudesDeCasPage() {
  return (
    <>
      <PageHero
        title="Études de cas"
        description="Découvrez comment nos clients ont transformé leurs équipes et atteint leurs objectifs."
        eyebrow="Témoignages clients"
        size="lg"
      />

      {/* Case Studies Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-8">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="group bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid lg:grid-cols-3 gap-0">
                  <div className="bg-primary p-8 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5" />
                      <span className="text-sm font-medium text-white/80">
                        {study.sector}
                      </span>
                    </div>
                    <h2 className="font-sans text-2xl font-bold mb-2">
                      {study.client}
                    </h2>
                    <p className="text-white/80">{study.title}</p>
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Défi
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Solution
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {study.solution}
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">
                        Résultats
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {study.results.map((result, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full"
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
