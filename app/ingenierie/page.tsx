import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        title="Ingénierie de Formation"
        description="Des solutions personnalisées pour développer les compétences de vos équipes et créer votre propre académie d'entreprise."
        eyebrow="Solutions sur-mesure"
        size="lg"
      />

      <IngenierieIntroSection />
      <ProcessStepsSection />
      <CorporateAcademySection />
      <ParcoursExamplesSection />

      {/* Strategy Section */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Stratégie de Formation"
            title="Conseil en stratégie formation"
            description="Nous vous accompagnons dans la définition et la mise en œuvre de votre stratégie de formation."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {strategyServices.map((service, idx) => (
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

      {/* Strategy Benefits */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
                Avantages
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text mb-6">
                Pourquoi définir une stratégie formation ?
              </h2>
              <p className="text-wl-text-secondary leading-relaxed mb-8">
                Une stratégie de formation structurée permet d'optimiser vos
                investissements et d'assurer l'adéquation entre les compétences
                de vos équipes et les besoins de votre entreprise.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-wl-blue hover:bg-wl-blue-dark text-white"
              >
                <Link href="/contact">
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-wl-border bg-wl-gray-light p-8">
              <div className="space-y-4">
                {strategyBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-wl-blue" />
                    <span className="text-wl-text">{benefit}</span>
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
