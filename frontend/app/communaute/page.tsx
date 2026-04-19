import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import {
  Calendar,
  BookOpen,
  ArrowRight,
  Users,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Communauté | Welearn",
  description:
    "Rejoignez la communauté Welearn : événements professionnels, articles de blog, et ressources pour les acteurs du BTP, de l'architecture et de l'immobilier.",
};

const featuredPosts = [
  {
    id: 1,
    title:
      "L'intelligence artificielle au service de l'ingénierie de formation",
    excerpt:
      "Comment les outils d'IA transforment la conception pédagogique et permettent de personnaliser les parcours de formation pour les professionnels du BTP.",
    category: "Innovation pédagogique",
    date: "10 avril 2026",
    readTime: "5 min",
    slug: "ia-ingenierie-formation",
  },
  {
    id: 2,
    title: "BIM et formation : préparer les équipes aux nouveaux standards",
    excerpt:
      "Le BIM impose une transformation profonde des pratiques. Découvrez comment accompagner vos équipes vers la maîtrise de ces outils incontournables.",
    category: "BIM & Digital",
    date: "28 mars 2026",
    readTime: "7 min",
    slug: "bim-formation-equipes",
  },
  {
    id: 3,
    title: "Le contrat spécial de formation (CSF) : mode d'emploi 2026",
    excerpt:
      "Tout ce que les entreprises marocaines doivent savoir sur le CSF : éligibilité, plafonds de remboursement, procédures et bonnes pratiques.",
    category: "CSF & Financement",
    date: "15 mars 2026",
    readTime: "6 min",
    slug: "csf-mode-emploi-2026",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Journées Nationales de l'Architecte 2025",
    location: "Fès",
    date: "15 mars 2025",
    type: "Conférence",
  },
  {
    id: 2,
    title: "Forum BIM Maroc",
    location: "Casablanca",
    date: "20 mai 2025",
    type: "Forum",
  },
];

export default function CommunautePage() {
  return (
    <>
      <PageHero
        title="Notre Communauté"
        description="Un espace d'échange, de partage et d'inspiration pour les professionnels du BTP, de l'architecture et de l'immobilier."
        eyebrow="Communauté Welearn"
        size="lg"
      />

      {/* Pillars */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Blog card */}
            <Link
              href="/blog"
              className="group flex flex-col gap-6 rounded-2xl border border-wl-border bg-wl-gray-light p-10 hover:border-wl-blue/30 hover:shadow-[0_8px_32px_rgba(27,95,170,0.10)] transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-wl-blue-tint">
                <BookOpen className="h-7 w-7 text-wl-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-wl-text mb-3 group-hover:text-wl-blue transition-colors">
                  Blog & Ressources
                </h2>
                <p className="text-wl-text-secondary leading-relaxed">
                  Articles de fond, guides pratiques et actualités sectorielles
                  rédigés par nos experts pour enrichir vos pratiques
                  professionnelles.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-wl-blue">
                Lire les articles{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Events card */}
            <Link
              href="/evenements"
              className="group flex flex-col gap-6 rounded-2xl border border-wl-border bg-wl-gray-light p-10 hover:border-wl-orange/30 hover:shadow-[0_8px_32px_rgba(232,114,28,0.10)] transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-wl-orange-tint">
                <Calendar className="h-7 w-7 text-wl-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-wl-text mb-3 group-hover:text-wl-orange transition-colors">
                  Événements
                </h2>
                <p className="text-wl-text-secondary leading-relaxed">
                  Conférences, forums et séminaires organisés ou co-organisés
                  par Welearn pour réunir les professionnels du secteur autour
                  des grands enjeux du moment.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-wl-orange">
                Voir les événements{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest blog posts */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold text-wl-orange uppercase tracking-widest mb-2">
                Blog
              </p>
              <h2 className="text-3xl font-bold text-wl-text">
                Derniers articles
              </h2>
            </div>
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-wl-border text-wl-blue hover:bg-wl-blue-tint"
              >
                Tous les articles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                {/* Placeholder image area */}
                <div className="h-44 bg-wl-blue-tint flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-wl-blue/30" />
                </div>
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-wl-text leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-wl-text-secondary leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-wl-text-secondary pt-2 border-t border-wl-border">
                    <span>{post.date}</span>
                    <span>{post.readTime} de lecture</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events snapshot */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold text-wl-orange uppercase tracking-widest mb-2">
                Événements
              </p>
              <h2 className="text-3xl font-bold text-wl-text">
                Prochains rendez-vous
              </h2>
            </div>
            <Link href="/evenements">
              <Button
                variant="outline"
                className="border-wl-border text-wl-blue hover:bg-wl-blue-tint"
              >
                Tous les événements <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-5 rounded-xl border border-wl-border bg-wl-gray-light p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-wl-blue-tint">
                  <Calendar className="h-6 w-6 text-wl-blue" />
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest mb-1">
                    {event.type}
                  </span>
                  <h3 className="font-bold text-wl-text mb-1">{event.title}</h3>
                  <p className="text-sm text-wl-text-secondary">
                    {event.location} — {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-wl-blue-dark">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez la communauté Welearn
          </h2>
          <p className="text-lg text-white/75 mb-8 max-w-2xl mx-auto leading-relaxed">
            Restez informé de nos prochains événements, accédez à nos ressources
            exclusives et échangez avec les professionnels de votre secteur.
          </p>
          <Link href="/contact">
            <Button className="bg-wl-orange hover:bg-wl-orange-dark text-white font-semibold px-8 py-3 text-base">
              Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
