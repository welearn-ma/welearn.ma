import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Play, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vidéos Pédagogiques | Ressources | Welearn",
  description:
    "Découvrez notre bibliothèque de vidéos pédagogiques sur la formation professionnelle, le BIM et le secteur de la construction.",
};

const videos = [
  {
    id: 1,
    title: "Introduction au BIM : Concepts fondamentaux",
    description:
      "Découvrez les principes de base du Building Information Modeling et son impact sur le secteur de la construction.",
    duration: "12:30",
    category: "BIM",
    thumbnail: "/images/video-thumbnails/bim-intro.jpg",
    views: "2.5K",
    date: "2025-01-15",
  },
  {
    id: 2,
    title: "Comment réussir votre demande de remboursement CSF",
    description:
      "Guide pratique pour constituer votre dossier CSF et optimiser vos chances de remboursement.",
    duration: "8:45",
    category: "Financement",
    thumbnail: "/images/video-thumbnails/csf-guide.jpg",
    views: "1.8K",
    date: "2025-01-10",
  },
  {
    id: 3,
    title: "Les nouvelles modalités pédagogiques en formation continue",
    description:
      "Blended learning, micro-learning, social learning : quelles approches pour maximiser l'engagement ?",
    duration: "15:20",
    category: "Pédagogie",
    thumbnail: "/images/video-thumbnails/pedagogie.jpg",
    views: "3.2K",
    date: "2024-12-20",
  },
  {
    id: 4,
    title: "Utiliser une plateforme LMS : les bonnes pratiques",
    description:
      "Conseils d'experts pour déployer et animer efficacement votre plateforme de formation digitale.",
    duration: "10:15",
    category: "Digital Learning",
    thumbnail: "/images/video-thumbnails/lms.jpg",
    views: "1.5K",
    date: "2024-12-05",
  },
  {
    id: 5,
    title: "Construire un parcours de formation hybride",
    description:
      "Méthodologie pour combiner présentiel et distanciel dans vos programmes de formation.",
    duration: "14:00",
    category: "Ingénierie",
    thumbnail: "/images/video-thumbnails/hybride.jpg",
    views: "2.1K",
    date: "2024-11-22",
  },
  {
    id: 6,
    title: "Évaluer l'efficacité de vos formations",
    description:
      "Méthodes et outils pour mesurer l'impact réel de vos dispositifs de formation.",
    duration: "11:30",
    category: "Évaluation",
    thumbnail: "/images/video-thumbnails/evaluation.jpg",
    views: "1.9K",
    date: "2024-11-10",
  },
  {
    id: 7,
    title: "Le BIM Manager : rôle et compétences",
    description:
      "Comprendre les missions et le profil requis pour devenir BIM Manager dans un projet de construction.",
    duration: "13:45",
    category: "BIM",
    thumbnail: "/images/video-thumbnails/bim-manager.jpg",
    views: "2.7K",
    date: "2024-10-28",
  },
  {
    id: 8,
    title: "Créer des contenus e-learning engageants",
    description:
      "Techniques et astuces pour concevoir des modules de formation digitale captivants et efficaces.",
    duration: "16:20",
    category: "Digital Learning",
    thumbnail: "/images/video-thumbnails/elearning.jpg",
    views: "3.5K",
    date: "2024-10-15",
  },
  {
    id: 9,
    title: "La réglementation thermique RE2020 expliquée",
    description:
      "Tout ce qu'il faut savoir sur la nouvelle réglementation environnementale pour le bâtiment.",
    duration: "9:50",
    category: "Réglementation",
    thumbnail: "/images/video-thumbnails/re2020.jpg",
    views: "2.3K",
    date: "2024-10-01",
  },
];

const categories = [
  "Toutes",
  "BIM",
  "Pédagogie",
  "Digital Learning",
  "Financement",
  "Ingénierie",
  "Évaluation",
  "Réglementation",
];

export default function VideosPage() {
  return (
    <>
      <PageHero
        title="Vidéos Pédagogiques"
        description="Tutoriels, guides pratiques et analyses d'experts pour développer vos compétences dans la formation et le BTP."
        eyebrow="Apprendre en vidéo"
        size="lg"
      />

      {/* Filter Categories */}
      <section className="py-8 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Toutes" ? "default" : "outline"}
                size="sm"
                className={
                  category === "Toutes"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <article
                key={video.id}
                className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-secondary overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center group-hover:bg-primary/60 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      <Tag className="h-3 w-3" />
                      {video.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {video.views} vues
                    </span>
                  </div>

                  <h2 className="font-sans text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(video.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/80">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'un contenu vidéo personnalisé ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe peut créer des vidéos pédagogiques sur mesure adaptées
            à vos besoins spécifiques de formation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary border-white hover:bg-white/90"
            >
              En savoir plus
            </Button>
            <Button
              size="lg"
              className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary"
            >
              Demander un devis
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
