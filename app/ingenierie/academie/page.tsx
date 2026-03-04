import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

const contacts = [
  {
    name: "Hassan Jaji",
    role: "Directeur associé",
    email: "hassan.jaji@welearn.ma",
    phone: "+212 661 299 243",
  },
  {
    name: "Abdelkarim Kouider",
    role: "Directeur associé",
    email: "abdelghani.kouider@welearn.ma",
    phone: "+212 661 405 230",
  },
  {
    name: "Oumaima Dakir",
    role: "Directrice technique, PMP®",
    email: "oumaima.dakir@welearn.ma",
    phone: "+212 661 536 669",
  },
];

export default function AcademiePage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-32 bg-linear-to-br from-blue-900 via-blue-800 to-blue-700">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-white/90 mb-6">
                <Award className="h-4 w-4" />
                Ingénierie de formation
              </span>
              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
                Concevez votre Académie de formation
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
                Nous vous accompagnons de la stratégie au déploiement pour créer
                une Académie utile, pilotable et à fort impact sur votre
                écosystème.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-white/90 font-semibold"
                >
                  <Link href="/contact">
                    Parler à un expert
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-semibold"
                >
                  <Link href="#offre">Découvrir notre approche</Link>
                </Button>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm"></div>
              <div className="relative h-96 lg:h-112 bg-linear-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <GraduationCap className="h-24 w-24 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 font-medium">
                    Image de présentation
                  </p>
                  <p className="text-white/40 text-sm">
                    Placer votre visuel ici
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-linear-to-b from-white to-slate-50">
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
                className="group relative rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-12 bg-linear-to-b from-blue-500 to-blue-300 rounded-r-full"></div>
                <div className="flex items-start gap-4 ml-3">
                  <div className="rounded-lg bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="offre"
        className="py-20 lg:py-28 bg-linear-to-b from-blue-50 to-white"
      >
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
                className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                {/* Number badge */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-linear-to-br from-blue-500/10 to-blue-600/5 rounded-full blur-2xl group-hover:from-blue-500/20 transition-all duration-300"></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-lg bg-linear-to-br from-blue-50 to-blue-100 p-3 group-hover:shadow-md transition-shadow">
                      <block.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-foreground mb-3 text-lg leading-snug">
                    {block.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {block.description}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 group-hover:bg-blue-100 transition-colors">
                    4 étapes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
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
                className="group relative rounded-xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm group-hover:bg-blue-200 transition-colors">
                  {idx + 1}
                </div>
                <div className="flex items-start gap-4 pr-12">
                  <ListChecks className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <span className="text-foreground font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-linear-to-b from-white via-blue-50 to-white">
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
                  <div className="hidden lg:block absolute left-1/2 ml-6 h-12 w-0.5 bg-linear-to-b from-blue-400 to-transparent pointer-events-none"></div>
                )}

                <div className="relative rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-600 to-blue-400 rounded-l-2xl"></div>

                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <div className="shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 ml-2">
                      <h3 className="font-sans text-2xl font-bold text-foreground mb-2">
                        {block.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {block.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {block.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-foreground text-sm leading-relaxed">
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

      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-blue-900 via-blue-800 to-blue-700">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-20 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

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
                className="group relative rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
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

      <section className="py-20 lg:py-28 bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi Welearn"
            title="Une équipe experte des enjeux formation du secteur Construction"
            description="Nous combinons conseil stratégique, ingénierie pédagogique et déploiement opérationnel."
          />
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left column - Text content */}
            <div className="flex flex-col justify-center">
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Welearn est une EdTech reconnue comme{" "}
                  <span className="font-semibold text-foreground">
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
                className="mt-8 w-fit bg-transparent border-blue-300 text-foreground hover:bg-blue-50"
              >
                <Link href="/about" className="flex items-center gap-2">
                  Découvrir Welearn
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right column - Expertise domains */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-sans text-2xl font-bold text-foreground mb-6">
                Nos domaines d'expertise
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {expertiseDomains.map((domain) => (
                  <div
                    key={domain}
                    className="group flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 group-hover:bg-blue-300 transition-colors">
                      <Target className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-linear-to-b from-white via-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Contact"
            title="Nos experts à votre service"
            description="Échangez avec nos spécialistes pour discuter de votre projet d'Académie."
          />
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contacts.map((contact, idx) => (
              <div
                key={contact.email}
                className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600"></div>

                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>

                <div className="relative p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-md">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-foreground mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 mb-4">
                    {contact.role}
                  </p>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`mailto:${contact.email}`}
                      className="block text-foreground hover:text-blue-600 transition-colors font-medium"
                    >
                      {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.phone}`}
                      className="block text-foreground hover:text-blue-600 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 p-12 text-center">
            <h2 className="font-sans text-3xl font-bold text-white mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Contactez notre équipe pour une première discussion sans
              engagement. Nous étudierons votre contexte et proposerons une
              approche adaptée.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 font-semibold"
            >
              <Link href="/contact">
                Demander un accompagnement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
