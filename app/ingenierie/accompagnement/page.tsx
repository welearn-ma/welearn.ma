import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  ArrowRight,
  Calculator,
  ClipboardCheck,
  Send,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accompagnement CSF | Ingénierie | Welearn",
  description:
    "Accompagnement au remboursement CSF pour optimiser le financement de vos formations.",
};

const steps = [
  {
    icon: FileText,
    title: "Constitution du dossier",
    description:
      "Préparation de tous les documents nécessaires à votre demande de remboursement.",
  },
  {
    icon: ClipboardCheck,
    title: "Vérification conformité",
    description:
      "Contrôle de la conformité de votre dossier avec les exigences CSF.",
  },
  {
    icon: Send,
    title: "Dépôt de la demande",
    description:
      "Soumission de votre dossier auprès des organismes compétents.",
  },
  {
    icon: Calculator,
    title: "Suivi du remboursement",
    description:
      "Accompagnement jusqu'à l'obtention effective du remboursement.",
  },
];

const eligibility = [
  "Entreprises cotisant à un OPCO",
  "Formations certifiantes ou qualifiantes",
  "Actions de développement des compétences",
  "Formations éligibles au CPF",
  "Plans de développement des compétences",
  "Contrats de professionnalisation",
];

export default function AccompagnementPage() {
  return (
    <>
      <PageHero
        title="Accompagnement CSF"
        description="Optimisez le financement de vos formations avec notre accompagnement au remboursement CSF."
        size="sm"
      />

      {/* Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre accompagnement"
            title="Comment ça marche ?"
            description="Un processus simple et efficace pour obtenir votre remboursement."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-secondary rounded-2xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary/20">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Éligibilité
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
                Qui peut bénéficier du CSF ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Le Contrat Spécial de Formation (CSF) permet aux entreprises
                marocaines de bénéficier d'un remboursement partiel ou total de
                leurs dépenses de formation. Découvrez si vous êtes éligible.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/contact">
                  Vérifier mon éligibilité
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-6">
                Critères d'éligibilité
              </h3>
              <div className="space-y-4">
                {eligibility.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'aide avec votre CSF ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contactez-nous pour un accompagnement personnalisé dans vos
            démarches de remboursement.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
