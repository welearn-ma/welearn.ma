import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Événements | Welearn",
  description:
    "Conférences, séminaires et événements organisés par Welearn pour les professionnels du BTP.",
};

const upcomingEvents = [
  {
    id: 1,
    title: "Journées Nationales de l'Architecte 2025",
    location: "Fès",
    date: "2025-03-15",
    type: "Conférence",
    description:
      "Événement majeur réunissant les architectes du Maroc autour des enjeux contemporains.",
    audience: "Architectes, urbanistes, maîtres d'ouvrage",
    upcoming: true,
  },
  {
    id: 2,
    title: "Forum BIM Maroc",
    location: "Casablanca",
    date: "2025-05-20",
    type: "Forum",
    description: "Le rendez-vous annuel des professionnels du BIM au Maroc.",
    audience: "BIM Managers, architectes, ingénieurs",
    upcoming: true,
  },
];

const pastEvents = [
  {
    id: 3,
    title: "Journées Nationales de l'Architecte",
    location: "Erfoud",
    year: "2023",
    type: "Conférence",
    description:
      "Édition 2023 dans le décor unique d'Erfoud, explorant l'architecture durable au Sahara.",
    audience: "Architectes, urbanistes, maîtres d'ouvrage",
  },
  {
    id: 4,
    title: "Journées Nationales de l'Architecte",
    location: "Dakhla",
    year: "2021",
    type: "Conférence",
    description:
      "Une édition exceptionnelle à Dakhla sur le thème de l'architecture littorale.",
    audience: "Architectes, urbanistes, maîtres d'ouvrage",
  },
  {
    id: 5,
    title: "Journée Scientifique FEDEC",
    location: "Casablanca",
    year: "2019",
    type: "Séminaire",
    description:
      "Séminaire technique organisé avec la FEDEC sur les innovations du secteur construction.",
    audience: "Bureaux de contrôle, ingénieurs, entreprises BTP",
  },
  {
    id: 6,
    title: "Journée Scientifique de l'Immobilier",
    location: "Casablanca",
    year: "2018",
    type: "Conférence",
    description:
      "Première édition de notre événement phare sur les enjeux de l'immobilier au Maroc.",
    audience: "Promoteurs, investisseurs, professionnels de l'immobilier",
  },
];

export default function EvenementsPage() {
  return (
    <>
      <PageHero
        title="Événements"
        description="Conférences, séminaires et forums pour les professionnels du BTP, de l'architecture et de l'immobilier."
        eyebrow="Rencontres professionnelles"
        size="lg"
      />

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-sans text-3xl font-bold text-wl-text mb-8">
            Événements à venir
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="bg-linear-to-r from-wl-blue to-wl-blue-dark p-6">
                  <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                    {event.type}
                  </span>
                  <h3 className="font-sans text-xl font-bold text-white">
                    {event.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-wl-text-secondary">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-wl-text">
                      <MapPin className="h-4 w-4 text-wl-orange" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-wl-text">
                      <Calendar className="h-4 w-4 text-wl-orange" />
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-wl-text-secondary">
                      <Users className="h-4 w-4 text-wl-blue" />
                      {event.audience}
                    </div>
                  </div>
                  <Button className="w-full bg-wl-blue hover:bg-wl-blue-dark text-white">
                    S'inscrire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Past Events */}
          <h2 className="font-sans text-3xl font-bold text-wl-text mb-8">
            Événements passés
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="bg-linear-to-r from-wl-blue/90 to-wl-blue-dark/90 p-4">
                  <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                    {event.type}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-white">
                    {event.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm text-wl-text-secondary line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-wl-text">
                      <MapPin className="h-4 w-4 text-wl-orange" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-wl-text">
                      <Calendar className="h-4 w-4 text-wl-orange" />
                      {event.year}
                    </div>
                  </div>
                  <div className="border-t border-wl-border pt-4">
                    <span className="text-xs text-wl-text-secondary">
                      {event.audience}
                    </span>
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
