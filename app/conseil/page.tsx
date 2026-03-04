import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
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
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Conseil Stratégique"
            title="Une démarche structurée"
            description="Nous vous accompagnons dans la définition et la mise en œuvre de votre stratégie."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {strategicServices.map((service, idx) => (
              <div key={idx} className="bg-secondary rounded-2xl p-8">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Transformation Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Transformation Digitale"
            title="Les piliers de la transformation"
            description="Une approche globale pour réussir votre transformation digitale."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {transformationPillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4">
                  <pillar.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-sans text-3xl font-bold text-foreground mb-6">
                Pourquoi se transformer ?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                La transformation digitale est un levier majeur de compétitivité
                pour les entreprises du BTP. Elle permet d'optimiser les
                processus, de réduire les coûts et d'améliorer la qualité.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/contact">
                  Lancer votre transformation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {transformationBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audits & Diagnostics Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Études, Audits & Diagnostics"
            title="Des analyses sur-mesure"
            description="Nous réalisons des études et audits adaptés à vos problématiques spécifiques."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {auditServices.map((service, idx) => (
              <div key={idx} className="bg-secondary rounded-2xl p-8">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à accélérer votre performance ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contactez-nous pour discuter de vos enjeux stratégiques et de
            transformation.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/contact">Prendre rendez-vous</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
