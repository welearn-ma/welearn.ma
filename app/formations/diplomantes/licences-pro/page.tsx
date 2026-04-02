import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Licences Professionnelles | Formations Diplômantes | Welearn",
  description:
    "Licences Professionnelles en BTP, BIM et Management de Projet Construction.",
};

const licences = [
  {
    id: "lp-bim",
    title: "Licence Professionnelle Conduite de Travaux BIM",
    partner: "Université partenaire",
    duration: "12 mois",
    format: "Alternance possible",
    level: "Bac+3",
    badges: ["Bac+3", "BIM", "Conduite de travaux"],
    description:
      "Formation professionnalisante combinant la maîtrise de la conduite de travaux et l'utilisation des outils BIM pour la gestion de chantier.",
    objectives: [
      "Piloter des chantiers de construction",
      "Utiliser les outils BIM sur chantier",
      "Coordonner les équipes et sous-traitants",
      "Assurer le suivi technique et financier",
    ],
    prerequisites: [
      "Bac+2 technique (BTS, DUT)",
      "Expérience dans le BTP appréciée",
    ],
  },
  {
    id: "lp-management",
    title: "Licence Professionnelle Management de Projet Construction",
    partner: "Université partenaire",
    duration: "12 mois",
    format: "Formation continue",
    level: "Bac+3",
    badges: ["Bac+3", "Management", "Projet"],
    description:
      "Développez vos compétences en gestion de projet appliquée au secteur de la construction : planification, budget, qualité et coordination.",
    objectives: [
      "Planifier et piloter des projets construction",
      "Gérer les budgets et les ressources",
      "Assurer la qualité et la conformité",
      "Manager les parties prenantes",
    ],
    prerequisites: ["Bac+2 minimum", "Intérêt pour le secteur BTP"],
  },
];

export default function LicencesProPage() {
  return (
    <>
      <Breadcrumb />
      <PageHero
        title="Licences Professionnelles"
        description="Diplômes universitaires Bac+3 reconnus par l'État, orientés vers l'insertion professionnelle."
        eyebrow="Formations Diplômantes"
        size="sm"
      />

      {/* Licences List */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-12">
            {licences.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className="bg-secondary rounded-2xl p-8 lg:p-10 scroll-mt-24"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.badges.map((badge, idx) => (
                    <Badge
                      key={idx}
                      className="bg-primary/10 text-primary border-0"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="font-sans text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {program.title}
                    </h2>
                    <p className="text-primary font-medium mb-4">
                      En partenariat avec {program.partner}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">
                        Objectifs pédagogiques
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {program.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm text-foreground">
                              {obj}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Prérequis
                      </h4>
                      <ul className="space-y-1">
                        {program.prerequisites.map((prereq, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 h-fit">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Durée
                        </span>
                        <span className="font-medium text-foreground">
                          {program.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Users className="h-4 w-4" /> Format
                        </span>
                        <span className="font-medium text-foreground">
                          {program.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4" /> Niveau
                        </span>
                        <span className="font-medium text-foreground">
                          {program.level}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        <Link href="/contact">
                          Candidater
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-primary text-primary bg-transparent"
                      >
                        <Link href="#">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger la brochure
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
