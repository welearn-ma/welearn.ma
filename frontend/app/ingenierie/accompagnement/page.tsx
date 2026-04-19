import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section-header";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accompagnement GIAC & OFPPT | Ingénierie | Welearn",
  description:
    "Accompagnement au financement GIAC et OFPPT, de la constitution des dossiers jusqu'au remboursement final.",
};

const highlights = [
  {
    text: "Étude d'ingénierie remboursée jusqu'à 70%",
    icon: TrendingUp,
  },
  {
    text: "Pilotage administratif, technique et financier complet",
    icon: ShieldCheck,
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Expertise reconnue",
    description:
      "Plus de 15 ans d'expérience dans l'accompagnement au financement GIAC et OFPPT avec des centaines de dossiers traités.",
  },
  {
    icon: Target,
    title: "Taux de réussite optimal",
    description:
      "98% de dossiers acceptés grâce à notre parfaite maîtrise des procédures administratives et des exigences réglementaires.",
  },
  {
    icon: TrendingUp,
    title: "Maximisation du remboursement",
    description:
      "Optimisation stratégique de votre dossier pour obtenir le meilleur taux de remboursement possible et sécuriser vos financements.",
  },
  {
    icon: Users,
    title: "Accompagnement personnalisé",
    description:
      "Un consultant expert dédié vous accompagne à chaque étape, de l'audit initial jusqu'au versement final des fonds.",
  },
];

const mandatoryFiles = [
  {
    icon: FileText,
    title: "Dossier administratif",
    description:
      "Constitution et vérification de l'éligibilité et de la conformité des pièces.",
    details: [
      "Vérification approfondie de l'éligibilité de votre entreprise",
      "Constitution complète du dossier juridique et administratif",
      "Préparation et validation de tous les documents requis",
      "Contrôle rigoureux de conformité des pièces justificatives",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Dossier technique",
    description:
      "Rédaction, structuration et suivi de la Demande de Financement.",
    details: [
      "Analyse détaillée des besoins en formation de votre entreprise",
      "Rédaction professionnelle du cahier des charges pédagogique",
      "Structuration optimale du plan de formation et des objectifs",
      "Dépôt et suivi proactif de la demande auprès des organismes",
    ],
  },
  {
    icon: Calculator,
    title: "Dossier financier",
    description:
      "Préparation, dépôt et suivi complet de la Demande de Remboursement.",
    details: [
      "Calcul précis et optimisation du budget prévisionnel",
      "Préparation méticuleuse de toutes les pièces comptables",
      "Dépôt dans les délais de la demande de remboursement",
      "Suivi rigoureux jusqu'à l'obtention effective du versement",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Audit initial gratuit",
    description:
      "Analyse approfondie de votre projet de formation et vérification complète de l'éligibilité au financement GIAC/OFPPT.",
  },
  {
    number: "02",
    title: "Constitution des dossiers",
    description:
      "Préparation méticuleuse des 3 dossiers obligatoires (administratif, technique et financier) avec notre équipe d'experts certifiés.",
  },
  {
    number: "03",
    title: "Dépôt et suivi actif",
    description:
      "Soumission optimale des dossiers dans les délais et suivi proactif avec points réguliers auprès des organismes compétents.",
  },
  {
    number: "04",
    title: "Versement du remboursement",
    description:
      "Accompagnement continu jusqu'au versement final et intégral des fonds de remboursement sur votre compte bancaire.",
  },
];

export default function AccompagnementPage() {
  return (
    <>
      <PageHero
        title="Accompagnement au financement GIAC & OFPPT"
        description="Optimisez vos chances de remboursement avec un accompagnement expert de bout en bout"
        size="lg"
      />

      {/* Intro Section */}
      <section className="py-20 lg:py-28 bg-linear-to-b from-white to-secondary/30">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Votre partenaire financement
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-bold text-foreground mb-6">
              Accompagnement au financement GIAC & OFPPT
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Welearn prend en charge l'ensemble des démarches, depuis la
              constitution des dossiers jusqu'au remboursement final.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {highlights.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-4 bg-white p-7 rounded-2xl shadow-md border border-primary/10 hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <item.icon className="h-7 w-7 text-primary shrink-0" />
                </div>
                <p className="text-lg font-semibold text-foreground pt-2">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi nous choisir"
            title="Un accompagnement qui fait la différence"
            description="Des années d'expertise au service de votre réussite"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-secondary/50 rounded-2xl p-6 hover:bg-secondary transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre méthodologie"
            title="Comment ça fonctionne ?"
            description="Un processus éprouvé pour maximiser vos chances de succès"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-6 h-full shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold text-primary/20">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-sans text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Files Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Les 3 piliers de votre dossier"
            title="Gestion experte des 3 dossiers obligatoires"
            description="Pour maximiser vos chances d'acceptation et sécuriser votre remboursement, Welearn pilote de A à Z les trois volets essentiels de votre dossier de financement"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mandatoryFiles.map((file, idx) => (
              <div
                key={file.title}
                className="bg-linear-to-br from-secondary/50 to-secondary rounded-2xl p-8 h-full border border-primary/5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <file.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-5xl font-bold text-primary/15">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-sans text-2xl font-bold text-primary mb-4">
                  {file.title}
                </h3>
                <p className="text-base text-foreground leading-relaxed mb-6">
                  {file.description}
                </p>
                <div className="space-y-3 pt-4 border-t border-primary/10">
                  {file.details.map((detail) => (
                    <div key={detail} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-6xl font-bold text-primary mb-3">70%</div>
              <p className="text-xl font-bold text-foreground mb-2">
                Remboursement
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jusqu'à 70% de remboursement sur vos études d'ingénierie de
                formation
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-6xl font-bold text-primary mb-3">98%</div>
              <p className="text-xl font-bold text-foreground mb-2">
                Taux d'acceptation
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                De nos dossiers acceptés par les organismes GIAC et OFPPT
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-6xl font-bold text-primary mb-3">15+</div>
              <p className="text-xl font-bold text-foreground mb-2">
                Années d'expérience
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                D'expertise dans l'accompagnement au financement GIAC et OFPPT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-linear-to-br from-[#1a365d] to-[#2d5a8f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url(/patterns/grid.svg)] opacity-10"></div>
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center relative z-10">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Prêt à maximiser votre financement formation ?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Bénéficiez d'un accompagnement expert et personnalisé dans vos
            démarches de financement et de remboursement GIAC ou OFPPT. Nos
            consultants vous guident à chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              <Link href="/contact">
                Demander un accompagnement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Link href="/ingenierie">En savoir plus sur nos services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
