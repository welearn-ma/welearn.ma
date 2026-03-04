import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalogue des Formations Intra | Welearn",
  description:
    "Catalogue complet de formations techniques BIM et construction pour les entreprises.",
};

const categories = [
  {
    name: "BIM & Maquette Numérique",
    formations: [
      { title: "Initiation au BIM", duration: "2 jours", level: "Débutant" },
      {
        title: "Revit Architecture",
        duration: "5 jours",
        level: "Intermédiaire",
      },
      { title: "Revit Structure", duration: "5 jours", level: "Intermédiaire" },
      { title: "Revit MEP", duration: "5 jours", level: "Intermédiaire" },
      { title: "Navisworks", duration: "3 jours", level: "Intermédiaire" },
      { title: "Coordination BIM", duration: "3 jours", level: "Avancé" },
    ],
  },
  {
    name: "Management de Projet",
    formations: [
      {
        title: "Fondamentaux du management de projet",
        duration: "3 jours",
        level: "Débutant",
      },
      { title: "Préparation PMP®", duration: "5 jours", level: "Avancé" },
      { title: "MS Project", duration: "2 jours", level: "Intermédiaire" },
      {
        title: "Méthodes agiles dans la construction",
        duration: "2 jours",
        level: "Intermédiaire",
      },
    ],
  },
  {
    name: "Logiciels Techniques",
    formations: [
      { title: "AutoCAD 2D/3D", duration: "5 jours", level: "Débutant" },
      { title: "SketchUp Pro", duration: "3 jours", level: "Débutant" },
      {
        title: "Robot Structural Analysis",
        duration: "4 jours",
        level: "Avancé",
      },
      { title: "Dynamo pour Revit", duration: "3 jours", level: "Avancé" },
    ],
  },
  {
    name: "Efficacité Énergétique",
    formations: [
      {
        title: "RT 2012 / RE 2020",
        duration: "2 jours",
        level: "Intermédiaire",
      },
      {
        title: "Simulation thermique dynamique",
        duration: "3 jours",
        level: "Avancé",
      },
      {
        title: "Audit énergétique bâtiment",
        duration: "3 jours",
        level: "Intermédiaire",
      },
    ],
  },
];

export default function CataloguePage() {
  return (
    <>
      <PageHero
        title="Catalogue des Formations Intra"
        description="Plus de 50 formations techniques disponibles pour vos équipes, animées par des experts métier."
        eyebrow="Catalogue Formations"
        size="sm"
      />

      {/* Download CTA */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-foreground font-medium">
              Téléchargez notre catalogue complet au format PDF
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="#">
                <Download className="mr-2 h-4 w-4" />
                Télécharger le catalogue
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.name}>
                <h2 className="font-sans text-2xl font-bold text-foreground mb-6">
                  {category.name}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.formations.map((formation, idx) => (
                    <div
                      key={idx}
                      className="bg-secondary rounded-xl p-6 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {formation.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formation.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formation.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Vous ne trouvez pas la formation recherchée ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nous pouvons concevoir une formation sur mesure adaptée à vos
            besoins spécifiques.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/formations/certifiantes/sur-mesure">
              Découvrir les formations sur mesure
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
