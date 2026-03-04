import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Play, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Webinaires | Welearn",
  description:
    "Replays de nos webinaires et conférences en ligne sur la formation professionnelle BTP.",
};

const webinars = [
  {
    id: 1,
    title: "Introduction au BIM pour les maîtres d'ouvrage",
    description:
      "Comprendre les fondamentaux du BIM et son impact sur la gestion de projet.",
    date: "2024-12-10",
    duration: "45 min",
    speakers: "Expert BIM Welearn",
    attendees: 245,
    replay: true,
  },
  {
    id: 2,
    title: "Réglementation thermique : ce qui change en 2025",
    description:
      "Panorama des évolutions réglementaires et leurs implications pour les professionnels.",
    date: "2024-11-20",
    duration: "60 min",
    speakers: "Expert Réglementation",
    attendees: 312,
    replay: true,
  },
  {
    id: 3,
    title: "Construire un plan de formation efficace",
    description:
      "Méthodologie et bonnes pratiques pour élaborer votre stratégie formation.",
    date: "2024-10-15",
    duration: "50 min",
    speakers: "Équipe Ingénierie Welearn",
    attendees: 189,
    replay: true,
  },
  {
    id: 4,
    title: "Digital learning : tendances et innovations",
    description:
      "Les nouvelles approches pédagogiques qui transforment la formation professionnelle.",
    date: "2024-09-25",
    duration: "55 min",
    speakers: "Direction Pédagogique",
    attendees: 276,
    replay: true,
  },
];

export default function WebinairesPage() {
  return (
    <>
      <PageHero
        title="Webinaires"
        description="Accédez aux replays de nos webinaires et conférences animés par nos experts."
        eyebrow="Formations en ligne"
        size="lg"
      />

      {/* Webinars Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {webinars.map((webinar) => (
              <div
                key={webinar.id}
                className="group bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-primary/10 relative flex items-center justify-center">
                  <div className="p-4 bg-primary rounded-full group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                  {webinar.replay && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      Replay disponible
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-sans text-xl font-bold text-foreground mb-3">
                    {webinar.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {webinar.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(webinar.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {webinar.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                      <Users className="h-4 w-4 text-primary" />
                      {webinar.attendees} participants
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Voir le replay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
