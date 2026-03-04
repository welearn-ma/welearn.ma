import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Actualités | Welearn",
  description:
    "Les dernières nouvelles de Welearn et du secteur de la formation professionnelle BTP.",
};

const news = [
  {
    id: 1,
    title: "Welearn lance son nouveau programme Executive Master BIM",
    excerpt:
      "Un parcours de 18 mois pour former les futurs BIM Managers du secteur construction.",
    date: "2025-01-15",
    category: "Formation",
  },
  {
    id: 2,
    title: "Partenariat stratégique avec l'Ordre des Architectes",
    excerpt:
      "Welearn devient partenaire officiel pour la formation continue des architectes au Maroc.",
    date: "2024-12-20",
    category: "Partenariat",
  },
  {
    id: 3,
    title: "Nouvelle version de la plateforme LMS Welearn",
    excerpt:
      "Des fonctionnalités enrichies pour une expérience d'apprentissage optimale.",
    date: "2024-11-10",
    category: "Digital",
  },
  {
    id: 4,
    title: "Certification Qualiopi renouvelée pour 3 ans",
    excerpt:
      "Welearn confirme son engagement qualité avec le renouvellement de sa certification.",
    date: "2024-10-05",
    category: "Certification",
  },
];

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        title="Actualités"
        description="Les dernières nouvelles de Welearn et du secteur de la formation professionnelle."
        eyebrow="Restez informé"
        size="lg"
      />

      {/* News Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="group bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-primary/10" />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <h2 className="font-sans text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Lire la suite <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
