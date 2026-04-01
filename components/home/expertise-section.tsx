import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const blocA = [
  {
    title: "Ingénierie de formation",
    description:
      "Analyse des besoins, cartographie des compétences, conception de programmes sur mesure, évaluation d'impact.",
  },
  {
    title: "Ingénierie pédagogique & Scénarisation",
    description:
      "Transformation de contenus en expériences engageantes : storyboards, gamification, mises en situation, évaluations progressives.",
  },
  {
    title: "Digital Learning & Production",
    description:
      "MOOCs, micro-learning, motion design, voix-off multilingues (FR, AR, EN), VR, vidéos 3D. Sur welearn.ac ou en marque blanche.",
  },
  {
    title: "Académies d'entreprise",
    description:
      "Création d'académies internes : parcours, plateforme, contenus, partenariats académiques, déploiement à grande échelle.",
  },
];

const blocB = [
  {
    category: "BIM & Digitalisation du BTP",
    tags: [
      "BIM Management",
      "BIM Foundations (buildingSMART)",
      "Coordination BIM",
      "Modélisation",
      "BIM MOA/MOE",
    ],
    note: "Welearn = service provider accrédité buildingSMART International",
  },
  {
    category: "Construction & Matériaux",
    tags: [
      "Béton",
      "Étanchéité & Isolation",
      "Pathologies du bâtiment",
      "Sécurité incendie",
      "Construction durable",
      "Parasismique",
    ],
  },
  {
    category: "Immobilier",
    tags: [
      "Asset Management",
      "Facility Management",
      "Investissement",
      "Droit immobilier",
      "VEFA",
      "Expertise et évaluation",
    ],
  },
  {
    category: "Intelligence Artificielle & Innovation",
    tags: [
      "IA pour la construction",
      "IA pour l'immobilier",
      "Apprentissage augmenté par l'IA",
    ],
  },
  {
    category: "Management & Compétences transversales",
    tags: ["Management de projets", "Leadership", "Soft skills", "RH", "Marketing & Commercial"],
  },
];

export function ExpertiseSection() {
  return (
    <section className="py-20 lg:py-28 bg-wl-gray-light">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            Notre double expertise
          </p>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-wl-text mb-6 text-balance leading-tight">
            L'expertise métier ET l'expertise pédagogique — c'est notre double
            force
          </h2>
          <p className="text-lg text-wl-text-secondary leading-relaxed">
            Beaucoup savent former. Peu connaissent votre métier. Welearn réunit
            les deux : une maîtrise approfondie de l'ingénierie de formation et
            du digital learning, combinée à une expertise terrain dans la
            construction et l'immobilier.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Bloc A — Savoir-faire */}
          <div className="bg-white rounded-2xl p-8 border border-wl-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wl-blue text-white font-bold text-lg shrink-0">
                A
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-wl-text">
                  Savoir-faire
                </h3>
                <p className="text-sm text-wl-text-secondary">
                  Ingénierie de formation & Digital
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {blocA.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-wl-blue-tint">
                    <div className="h-2 w-2 rounded-full bg-wl-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-wl-text mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-wl-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloc B — Expertise terrain */}
          <div className="bg-white rounded-2xl p-8 border border-wl-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wl-orange text-white font-bold text-lg shrink-0">
                B
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-wl-text">
                  Expertise terrain
                </h3>
                <p className="text-sm text-wl-text-secondary">
                  Construction, BIM & Immobilier
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {blocB.map((item, idx) => (
                <div key={idx}>
                  <h4 className="text-xs font-semibold text-wl-text uppercase tracking-wider mb-2">
                    {item.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-block px-2.5 py-1 text-xs font-medium text-wl-text-secondary bg-wl-gray-light rounded border border-wl-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {item.note && (
                    <p className="mt-2 text-xs text-wl-orange font-medium italic">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing CTA banner */}
        <div className="bg-linear-to-br from-wl-blue to-wl-blue-dark rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
            C'est parce que nous maîtrisons à la fois l'art de former et la
            réalité de vos métiers que nos programmes produisent un{" "}
            <strong className="text-white">impact concret sur le terrain.</strong>
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-wl-orange hover:text-white text-wl-blue-dark font-semibold whitespace-nowrap transition-colors shrink-0"
          >
            <Link href="/formations">
              Voir tout le catalogue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
