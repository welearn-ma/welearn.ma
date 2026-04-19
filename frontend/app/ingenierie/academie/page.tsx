import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Compass,
  FileSearch,
  GraduationCap,
  Handshake,
  Lightbulb,
  ListChecks,
  Target,
  Award,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Académie | Ingénierie | Welearn",
  description:
    "Concevez et déployez votre Académie de formation avec Welearn : stratégie, ingénierie pédagogique, déploiement et accompagnement opérationnel.",
};

const valuePoints = [
  "Structurer la montée en compétences de votre écosystème externe",
  "Diffuser les bonnes pratiques et renforcer votre expertise métier",
  "Soutenir votre image de marque et votre leadership technique",
  "Créer un levier durable de performance et de différenciation",
];

const offerBlocks = [
  {
    title: "Cadrage & analyse des besoins",
    icon: FileSearch,
    description:
      "Nous construisons une vision partagée, clarifions le périmètre de l'Académie et identifions les publics prioritaires.",
    bullets: [
      "Alignement de la vision et des attentes",
      "Identification du périmètre de l'Académie",
      "Identification du public cible",
      "Diagnostic terrain et analyse des dispositifs existants",
    ],
  },
  {
    title: "Planification stratégique",
    icon: Compass,
    description:
      "Nous définissons la stratégie globale, la feuille de route et les mécanismes de gouvernance et de pilotage.",
    bullets: [
      "Benchmark national et international",
      "Analyse stratégique",
      "Feuille de route",
      "Mécanismes de suivi et de pilotage",
    ],
  },
  {
    title: "Conception des parcours de formation",
    icon: GraduationCap,
    description:
      "Nous concevons un dispositif pédagogique concret, activable rapidement et aligné avec vos enjeux métier.",
    bullets: [
      "Catalogue de formation par public cible",
      "Fiches modules détaillées",
      "Définition des modalités pédagogiques",
      "Préparation du lancement opérationnel",
    ],
  },
  {
    title: "Déploiement & accompagnement",
    icon: Handshake,
    description:
      "Nous accompagnons vos équipes dans l'exécution, l'animation et l'amélioration continue du dispositif.",
    bullets: [
      "Plan de déploiement opérationnel",
      "Plan d'accompagnement et communication",
      "Déploiement des formations",
      "Optimisation continue selon les retours terrain",
    ],
  },
];

const expectedResults = [
  "Une Académie à forte valeur stratégique, ancrée dans votre expertise métier",
  "Un dispositif lisible, pilotable et évolutif dans le temps",
  "Une meilleure adoption des pratiques et standards sur le terrain",
  "Un impact mesurable sur la qualité, la performance et l'image de marque",
];

const deliverables = [
  "Diagnostic et cadrage de l'Académie",
  "Feuille de route stratégique et gouvernance",
  "Catalogue et architecture des parcours de formation",
  "Plan de déploiement et d'animation",
  "Plan d'accompagnement et de communication",
  "Cadre de pilotage (KPI, suivi, amélioration continue)",
];

const expertiseDomains = [
  "Matériaux",
  "Efficacité énergétique",
  "BIM",
  "Management des projets",
  "Immobilier",
  "Construction",
  "Leadership technique",
  "Formations intra-entreprise",
];

export default function AcademiePage() {
  return (
    <>
      <PageHero
        title="Académie de formation"
        description="Nous vous accompagnons de la stratégie au déploiement pour créer une Académie utile, pilotable et à fort impact sur votre écosystème."
        size="sm"
      />

      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi ce dispositif"
            title="Une Académie qui sert vos objectifs business"
            description="L'Académie devient un levier concret de transformation, d'influence et de montée en compétences."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {valuePoints.map((point, idx) => (
              <div
                key={point}
                className="group relative rounded-xl border border-wl-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="absolute top-0 left-0 h-12 w-1 rounded-r-full bg-linear-to-b from-wl-blue to-wl-orange"></div>
                <div className="flex items-start gap-4 ml-3">
                  <div className="rounded-lg bg-wl-blue-tint p-3 transition-colors group-hover:bg-wl-orange-tint">
                    <Lightbulb className="h-5 w-5 text-wl-blue" />
                  </div>
                  <p className="font-medium leading-relaxed text-wl-text">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offre" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre offre"
            title="Un accompagnement de bout en bout"
            description="Une approche en 4 blocs pour passer d'une intention à un dispositif opérationnel."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerBlocks.map((block, idx) => (
              <div
                key={block.title}
                className="group relative overflow-hidden rounded-2xl border border-wl-border bg-wl-gray-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              >
                {/* Number badge */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br from-wl-blue/10 to-wl-orange/10 blur-2xl transition-all duration-300 group-hover:from-wl-blue/20"></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-lg bg-wl-blue-tint p-3 transition-shadow group-hover:shadow-md">
                      <block.icon className="h-6 w-6 text-wl-blue" />
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-wl-orange-tint text-sm font-bold text-wl-orange">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 font-sans text-lg font-bold leading-snug text-wl-text">
                    {block.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-wl-text-secondary">
                    {block.description}
                  </p>
                  <div className="inline-block rounded-full bg-wl-blue-tint px-3 py-1 text-xs font-semibold text-wl-blue transition-colors group-hover:bg-wl-orange-tint group-hover:text-wl-orange">
                    4 étapes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Livrables"
            title="Ce que vous obtenez à la fin de la mission"
            description="Des livrables directement exploitables par vos équipes métier et formation."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {deliverables.map((item, idx) => (
              <div
                key={item}
                className="group relative rounded-xl border border-wl-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-wl-blue-tint text-sm font-bold text-wl-blue transition-colors group-hover:bg-wl-orange-tint group-hover:text-wl-orange">
                  {idx + 1}
                </div>
                <div className="flex items-start gap-4 pr-12">
                  <ListChecks className="mt-1 h-5 w-5 shrink-0 text-wl-blue" />
                  <span className="font-medium leading-relaxed text-wl-text">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Méthodologie"
            title="Comment se déroule la mission"
            description="Chaque phase produit des décisions concrètes et prépare la suivante."
          />
          <div className="space-y-6">
            {offerBlocks.map((block, idx) => (
              <div key={block.title} className="group">
                {/* Connector line */}
                {idx < offerBlocks.length - 1 && (
                  <div className="pointer-events-none absolute left-1/2 ml-6 hidden h-12 w-0.5 bg-linear-to-b from-wl-blue to-transparent lg:block"></div>
                )}

                <div className="relative rounded-2xl border border-wl-border bg-wl-gray-light p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  {/* Left accent bar */}
                  <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl bg-linear-to-b from-wl-blue to-wl-orange"></div>

                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <div className="shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-wl-blue to-wl-blue-dark text-lg font-bold text-white shadow-md transition-shadow group-hover:shadow-lg">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 ml-2">
                      <h3 className="mb-2 font-sans text-2xl font-bold text-wl-text">
                        {block.title}
                      </h3>
                      <p className="mb-6 leading-relaxed text-wl-text-secondary">
                        {block.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {block.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-start gap-3">
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wl-success" />
                            <span className="text-sm leading-relaxed text-wl-text">
                              {bullet}
                            </span>
                          </div>
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

      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Résultats attendus"
            title="Ce que votre Académie change concrètement"
            description="Un dispositif qui reste pertinent dans le temps et produit des effets mesurables."
            light={true}
          />
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {expectedResults.map((point, idx) => (
              <div
                key={point}
                className="group relative rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-white/30"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors group-hover:bg-white/30">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-white/95 font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi Welearn"
            title="Une équipe experte des enjeux formation du secteur Construction"
            description="Nous combinons conseil stratégique, ingénierie pédagogique et déploiement opérationnel."
          />
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left column - Text content */}
            <div className="flex flex-col justify-center">
              <div className="space-y-5 leading-relaxed text-wl-text-secondary">
                <p className="text-lg">
                  Welearn est une EdTech reconnue comme{" "}
                  <span className="font-semibold text-wl-text">
                    Jeune Entreprise Innovante®
                  </span>{" "}
                  en France et au Maroc, spécialisée dans la formation continue
                  et l'ingénierie pédagogique pour l'écosystème de la
                  construction.
                </p>
                <p className="text-lg">
                  Nous développons des dispositifs de formation à forte valeur,
                  en marque blanche ou en propre, notamment via des programmes
                  Masters, certifications et parcours intra-entreprise.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-8 w-fit border-wl-blue bg-transparent text-wl-blue hover:bg-wl-blue hover:text-white"
              >
                <Link href="/about" className="flex items-center gap-2">
                  Découvrir Welearn
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right column - Expertise domains */}
            <div className="rounded-2xl border border-wl-border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-6 font-sans text-2xl font-bold text-wl-text">
                Nos domaines d'expertise
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {expertiseDomains.map((domain) => (
                  <div
                    key={domain}
                    className="group flex items-center gap-3 rounded-lg bg-wl-gray-light p-3 transition-colors hover:bg-wl-blue-tint"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wl-blue-tint transition-colors group-hover:bg-white">
                      <Target className="h-4 w-4 text-wl-blue" />
                    </div>
                    <span className="text-sm font-medium text-wl-text">
                      {domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
