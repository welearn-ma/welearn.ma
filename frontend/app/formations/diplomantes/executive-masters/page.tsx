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
  GraduationCap,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Masters | Formations Diplômantes | Welearn",
  description:
    "Programmes Executive Master en BIM, Immobilier et Management de Projet Construction.",
};

const masters = [
  {
    id: "ms-bim",
    title: "Mastère Spécialisé BIM et ses Applications",
    partner: "EHTP (École Hassania des Travaux Publics)",
    duration: "12 mois",
    format: "Modulaire",
    badges: ["Accréditation CGE", "Label BIM Manager BuildingSmart"],
    description:
      "Formation d'excellence au Building Information Modeling avec double reconnaissance : accréditation de la Conférence des Grandes Écoles et label BIM Manager de BuildingSmart International.",
    objectives: [
      "Maîtriser les concepts et méthodologies BIM",
      "Piloter des projets BIM complexes",
      "Obtenir le label BIM Manager BuildingSmart",
      "Développer une vision stratégique du BIM",
    ],
    prerequisites: [
      "Bac+5 ou Bac+4 avec 3 ans d'expérience",
      "Expérience dans le secteur BTP",
    ],
    highlights: [
      "Accréditation Conférence des Grandes Écoles",
      "Label BIM Manager BuildingSmart International",
      "Apprentissage modulaire et flexible",
      "Projets réels et cas d'études",
      "Réseau alumni construction",
    ],
  },
  {
    id: "em-immo",
    title: "Executive Master Ingénierie Immobilière",
    partner: "EHTP (École Hassania des Travaux Publics)",
    duration: "18 mois",
    format: "Executive",
    badges: ["Executive", "Case Studies", "Experts Intervenants"],
    description:
      "Maîtrisez l'intégralité de la chaîne de valeur immobilière : valorisation, finance, durabilité et gestion des risques. Une formation conçue pour les cadres et dirigeants du secteur.",
    objectives: [
      "Comprendre la chaîne de valeur immobilière",
      "Maîtriser la finance immobilière",
      "Intégrer les enjeux de durabilité",
      "Gérer les risques immobiliers",
    ],
    prerequisites: [
      "Bac+4 minimum",
      "Expérience professionnelle significative",
    ],
    highlights: [
      "Chaîne de valeur immobilière complète",
      "Finance et valorisation immobilière",
      "Durabilité et performance énergétique",
      "Gestion des risques immobiliers",
      "Interventions d'experts du marché",
    ],
  },
  {
    id: "em-pm-bim",
    title: "Executive Master Management de Projet de Construction – Expert BIM",
    partner: "ESLSCA & Welearn",
    duration: "12 mois",
    format: "Hybride",
    badges: ["PMP® Preparation", "BIM Foundations"],
    description:
      "Double expertise en management de projet et BIM. Préparez-vous aux certifications internationales PMP® et BIM Foundations avec une approche pratique et professionnelle.",
    objectives: [
      "Maîtriser le management de projet construction",
      "Se préparer à la certification PMP®",
      "Obtenir la certification BIM Foundations",
      "Coordonner des projets BIM complexes",
    ],
    prerequisites: ["Bac+3 minimum", "Expérience en gestion de projet"],
    highlights: [
      "Préparation certification PMP®",
      "Préparation BIM Foundations BuildingSmart",
      "Méthodologies agiles et traditionnelles",
      "Outils de gestion de projet",
      "Coordination BIM avancée",
    ],
  },
];

export default function ExecutiveMastersPage() {
  return (
    <>
      <Breadcrumb />
      <PageHero
        title="Executive Masters"
        description="Programmes d'excellence pour cadres et dirigeants, en partenariat avec les grandes écoles."
        eyebrow="Formations Diplômantes"
        size="sm"
      />

      {/* Masters List */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-12">
            {masters.map((program) => (
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
                      <Award className="h-3 w-3 mr-1" />
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
                          <GraduationCap className="h-4 w-4" /> Type
                        </span>
                        <span className="font-medium text-foreground">
                          Diplômant
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
