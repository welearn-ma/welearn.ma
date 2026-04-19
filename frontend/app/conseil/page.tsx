import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ConseilCta } from "@/components/conseil/conseil-cta";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Target,
  Map,
  BarChart3,
  Zap,
  Settings,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Search,
  FileText,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Conseil & Transformation | Welearn",
  description:
    "Accompagnement stratégique, transformation digitale et études d'audit pour les entreprises du secteur de la Construction.",
};

const strategicServices = [
  {
    icon: Compass,
    title: "Vision stratégique",
    description:
      "Définition de votre vision et de vos ambitions à moyen et long terme.",
  },
  {
    icon: Target,
    title: "Objectifs et KPIs",
    description:
      "Identification des objectifs mesurables et des indicateurs de performance.",
  },
  {
    icon: Map,
    title: "Feuille de route",
    description:
      "Élaboration d'un plan d'action détaillé avec jalons et livrables.",
  },
  {
    icon: BarChart3,
    title: "Pilotage",
    description:
      "Mise en place d'un dispositif de suivi et d'amélioration continue.",
  },
];

const transformationPillars = [
  {
    icon: Settings,
    title: "Processus",
    description:
      "Optimisation et digitalisation de vos processus métier pour plus d'efficacité.",
  },
  {
    icon: Zap,
    title: "Outils",
    description:
      "Sélection et déploiement des outils numériques adaptés à vos besoins.",
  },
  {
    icon: Users,
    title: "Compétences",
    description:
      "Formation et accompagnement des équipes dans l'adoption des nouveaux outils.",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description:
      "Mesure de l'impact et amélioration continue de votre transformation.",
  },
];

const transformationBenefits = [
  "Gain de productivité",
  "Réduction des erreurs",
  "Meilleure collaboration",
  "Traçabilité des données",
  "Prise de décision éclairée",
  "Avantage concurrentiel",
];

const auditServices = [
  {
    icon: Search,
    title: "Audit organisationnel",
    description:
      "Analyse de votre organisation, processus et compétences pour identifier les axes d'amélioration.",
  },
  {
    icon: BarChart3,
    title: "Benchmark secteur",
    description:
      "Comparaison de vos pratiques avec les meilleures du secteur de la Construction.",
  },
  {
    icon: FileText,
    title: "Études de marché",
    description:
      "Analyses de marché et études sectorielles pour éclairer vos décisions stratégiques.",
  },
  {
    icon: Lightbulb,
    title: "Recommandations",
    description:
      "Préconisations concrètes et plan d'action pour mettre en œuvre les améliorations identifiées.",
  },
];

export default function ConseilPage() {
  return (
    <>
      <PageHero
        title="Conseil & Transformation"
        description="Accompagnement stratégique, transformation digitale et études d'audit pour accélérer la performance de votre organisation."
        eyebrow="Accompagnement stratégique"
        size="lg"
      />

      {/* Strategic Consulting Section */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Conseil Stratégique"
            title="Une démarche structurée"
            description="Nous vous accompagnons dans la définition et la mise en œuvre de votre stratégie."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {strategicServices.map((service, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-wl-border bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="w-fit rounded-2xl bg-wl-blue-tint p-4 mb-6">
                  <service.icon className="h-8 w-8 text-wl-blue" />
                </div>
                <h3 className="font-sans text-xl font-bold text-wl-text mb-3">
                  {service.title}
                </h3>
                <p className="text-wl-text-secondary leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Transformation Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Transformation Digitale"
            title="Les piliers de la transformation"
            description="Une approche globale pour réussir votre transformation digitale."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {transformationPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-wl-border bg-wl-gray-light p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="mx-auto mb-4 w-fit rounded-2xl bg-wl-orange-tint p-4">
                  <pillar.icon className="h-8 w-8 text-wl-orange" />
                </div>
                <h3 className="font-sans text-lg font-bold text-wl-text mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-wl-text-secondary">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-sans text-3xl font-bold text-wl-text mb-6">
                Pourquoi se transformer ?
              </h3>
              <p className="text-wl-text-secondary leading-relaxed mb-8">
                La transformation digitale est un levier majeur de compétitivité
                pour les entreprises du BTP. Elle permet d'optimiser les
                processus, de réduire les coûts et d'améliorer la qualité.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-wl-blue hover:bg-wl-blue-dark text-white"
              >
                <Link href="/contact">
                  Lancer votre transformation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-wl-border bg-wl-gray-light p-8">
              <div className="grid grid-cols-2 gap-4">
                {transformationBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-wl-blue shrink-0" />
                    <span className="text-wl-text text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audits & Diagnostics Section */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Études, Audits & Diagnostics"
            title="Des analyses sur-mesure"
            description="Nous réalisons des études et audits adaptés à vos problématiques spécifiques."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {auditServices.map((service, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-wl-border bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="w-fit rounded-2xl bg-wl-blue-tint p-4 mb-6">
                  <service.icon className="h-8 w-8 text-wl-blue" />
                </div>
                <h3 className="font-sans text-xl font-bold text-wl-text mb-3">
                  {service.title}
                </h3>
                <p className="text-wl-text-secondary leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConseilCta />
    </>
  );
}
