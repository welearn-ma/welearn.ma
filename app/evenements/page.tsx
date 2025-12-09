import type { Metadata } from "next"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Événements | Welearn",
  description: "Conférences, séminaires et événements organisés par Welearn pour les professionnels du BTP.",
}

const upcomingEvents = [
  {
    id: 1,
    title: "Journées Nationales de l'Architecte 2025",
    location: "Fès",
    date: "2025-03-15",
    type: "Conférence",
    description: "Événement majeur réunissant les architectes du Maroc autour des enjeux contemporains.",
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
]

const pastEvents = [
  {
    id: 3,
    title: "Journées Nationales de l'Architecte",
    location: "Erfoud",
    year: "2023",
    type: "Conférence",
    description: "Édition 2023 dans le décor unique d'Erfoud, explorant l'architecture durable au Sahara.",
    audience: "Architectes, urbanistes, maîtres d'ouvrage",
  },
  {
    id: 4,
    title: "Journées Nationales de l'Architecte",
    location: "Dakhla",
    year: "2021",
    type: "Conférence",
    description: "Une édition exceptionnelle à Dakhla sur le thème de l'architecture littorale.",
    audience: "Architectes, urbanistes, maîtres d'ouvrage",
  },
  {
    id: 5,
    title: "Journée Scientifique FEDEC",
    location: "Casablanca",
    year: "2019",
    type: "Séminaire",
    description: "Séminaire technique organisé avec la FEDEC sur les innovations du secteur construction.",
    audience: "Bureaux de contrôle, ingénieurs, entreprises BTP",
  },
  {
    id: 6,
    title: "Journée Scientifique de l'Immobilier",
    location: "Casablanca",
    year: "2018",
    type: "Conférence",
    description: "Première édition de notre événement phare sur les enjeux de l'immobilier au Maroc.",
    audience: "Promoteurs, investisseurs, professionnels de l'immobilier",
  },
]

export default function EvenementsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Rencontres professionnelles
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Événements
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Conférences, séminaires et forums pour les professionnels du BTP, de l'architecture et de l'immobilier.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-sans text-3xl font-bold text-foreground mb-8">Événements à venir</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow border-2 border-primary"
              >
                <div className="bg-primary p-6">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-3">
                    {event.type}
                  </span>
                  <h3 className="font-sans text-xl font-bold text-white">{event.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      {event.audience}
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    S'inscrire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Past Events */}
          <h2 className="font-sans text-3xl font-bold text-foreground mb-8">Événements passés</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-primary/80 p-4">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-2">
                    {event.type}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-white">{event.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {event.year}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{event.audience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
