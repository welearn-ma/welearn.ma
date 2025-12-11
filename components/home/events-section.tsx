import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Journées Nationales de l'Architecte",
    location: "Fès",
    date: "2025",
    type: "Conférence",
  },
  {
    title: "Journées Nationales de l'Architecte",
    location: "Erfoud",
    date: "2023",
    type: "Conférence",
  },
  {
    title: "Journées Nationales de l'Architecte",
    location: "Dakhla",
    date: "2021",
    type: "Conférence",
  },
  {
    title: "Journée Scientifique FEDEC",
    location: "Casablanca",
    date: "2019",
    type: "Séminaire",
  },
];

export function EventsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Événements"
          title="Rencontres & Conférences"
          description="Welearn organise régulièrement des événements pour les professionnels du BTP : architectes, bureaux de contrôle, promoteurs immobiliers."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                {event.type}
              </span>
              <h3 className="font-sans text-lg font-semibold text-foreground mb-3 line-clamp-2">
                {event.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            <Link href="/evenements">
              Voir tous les événements
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
