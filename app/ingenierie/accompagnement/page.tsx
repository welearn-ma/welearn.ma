import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardCheck,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accompagnement GIAC & OFPPT | Ingénierie | Welearn",
  description:
    "Accompagnement au financement GIAC et OFPPT, de la constitution des dossiers jusqu'au remboursement final.",
};

const highlights = [
  "Étude d'ingénierie remboursée jusqu'à 70 %",
  "Pilotage administratif, technique et financier",
];

const mandatoryFiles = [
  {
    icon: FileText,
    title: "Dossier administratif",
    description:
      "Constitution et vérification de l'éligibilité et de la conformité des pièces.",
  },
  {
    icon: ClipboardCheck,
    title: "Dossier technique",
    description:
      "Rédaction, structuration et suivi de la Demande de Financement.",
  },
  {
    icon: Calculator,
    title: "Dossier financier",
    description:
      "Préparation, dépôt et suivi complet de la Demande de Remboursement.",
  },
];

export default function AccompagnementPage() {
  return (
    <>
      <PageHero
        title="Accompagnement"
        description="Accompagnement au financement GIAC et OFPPT"
        size="sm"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
            Accompagnement au financement GIAC à OFPPT
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Welearn prend en charge l'ensemble des démarches, depuis la
            constitution des dossiers jusqu'au remboursement final.
          </p>

          <div className="space-y-4">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-lg font-semibold text-primary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory files */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
            Gestion structurée des 3 dossiers obligatoires
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-5xl">
            Afin de sécuriser votre dossier et d'optimiser vos chances
            d'acceptation et de remboursement, Welearn gère les trois volets
            essentiels.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandatoryFiles.map((file, idx) => (
              <div key={file.title} className="bg-white rounded-2xl p-7 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <file.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-primary/25">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-sans text-2xl font-bold text-primary mb-3">
                  {file.title}
                </h3>
                <p className="text-base text-foreground leading-relaxed">
                  {file.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'un accompagnement pour vos dossiers ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contactez-nous pour un accompagnement personnalisé dans vos
            démarches de financement et de remboursement.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
