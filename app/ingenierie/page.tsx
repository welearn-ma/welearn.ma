import type { Metadata } from "next";
import Link from "next/link";
import { IngenierieIntroSection } from "@/components/ingenierie/intro-section";
import { ProcessStepsSection } from "@/components/ingenierie/process-steps-section";
import { CorporateAcademySection } from "@/components/ingenierie/corporate-academy-section";
import { ParcoursExamplesSection } from "@/components/ingenierie/parcours-examples-section";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ingénierie de Formation | Welearn",
  description:
    "Solutions sur-mesure pour entreprises : analyse des besoins, conception pédagogique, académies d'entreprise et stratégie formation.",
};

const strategyServices = [
  {
    icon: Target,
    title: "Diagnostic des compétences",
    description:
      "Cartographie des compétences existantes et identification des besoins futurs.",
  },
  {
    icon: FileText,
    title: "Plan de formation",
    description:
      "Élaboration d'un plan de formation aligné avec vos objectifs stratégiques.",
  },
  {
    icon: Users,
    title: "GPEC",
    description:
      "Gestion prévisionnelle des emplois et des compétences dans le secteur BTP.",
  },
  {
    icon: TrendingUp,
    title: "ROI Formation",
    description:
      "Définition des indicateurs et mesure de l'impact de vos investissements formation.",
  },
];

const strategyBenefits = [
  "Alignement formation / stratégie d'entreprise",
  "Optimisation des budgets formation",
  "Anticipation des besoins en compétences",
  "Amélioration de l'attractivité employeur",
  "Accompagnement au changement",
  "Valorisation des parcours professionnels",
];

export default function IngenieriePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Solutions sur-mesure
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Ingénierie de Formation
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Des solutions personnalisées pour développer les compétences de vos
            équipes et créer votre propre académie d'entreprise.
          </p>
        </div>
      </section>

      <IngenierieIntroSection />
      <ProcessStepsSection />
      <CorporateAcademySection />
      <ParcoursExamplesSection />

      {/* Strategy Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Stratégie de Formation"
            title="Conseil en stratégie formation"
            description="Nous vous accompagnons dans la définition et la mise en œuvre de votre stratégie de formation."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {strategyServices.map((service, idx) => (
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

      {/* Strategy Benefits */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Avantages
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
                Pourquoi définir une stratégie formation ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Une stratégie de formation structurée permet d'optimiser vos
                investissements et d'assurer l'adéquation entre les compétences
                de vos équipes et les besoins de votre entreprise.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/contact">
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <div className="space-y-4">
                {strategyBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
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
