import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Welearn",
  description:
    "Articles, guides et actualités pour les professionnels du BTP, de l'architecture et de l'immobilier. Expertise Welearn.",
};

const categories = [
  "Tous",
  "Innovation pédagogique",
  "BIM & Digital",
  "CSF & Financement",
  "Management",
  "Réglementation",
];

const posts = [
  {
    id: 1,
    title:
      "L'intelligence artificielle au service de l'ingénierie de formation",
    excerpt:
      "Comment les outils d'IA transforment la conception pédagogique et permettent de personnaliser les parcours de formation pour les professionnels du BTP.",
    category: "Innovation pédagogique",
    date: "10 avril 2026",
    readTime: "5 min",
    featured: true,
  },
  {
    id: 2,
    title: "BIM et formation : préparer les équipes aux nouveaux standards",
    excerpt:
      "Le BIM impose une transformation profonde des pratiques. Découvrez comment accompagner vos équipes vers la maîtrise de ces outils incontournables.",
    category: "BIM & Digital",
    date: "28 mars 2026",
    readTime: "7 min",
    featured: false,
  },
  {
    id: 3,
    title: "Le contrat spécial de formation (CSF) : mode d'emploi 2026",
    excerpt:
      "Tout ce que les entreprises marocaines doivent savoir sur le CSF : éligibilité, plafonds de remboursement, procédures et bonnes pratiques.",
    category: "CSF & Financement",
    date: "15 mars 2026",
    readTime: "6 min",
    featured: false,
  },
  {
    id: 4,
    title:
      "Management de projet de construction : les compétences clés en 2026",
    excerpt:
      "Planification, gestion des risques, coordination des équipes — les compétences qui font la différence dans les grands projets de construction aujourd'hui.",
    category: "Management",
    date: "2 mars 2026",
    readTime: "8 min",
    featured: false,
  },
  {
    id: 5,
    title: "Réforme CNSS 2025 : impact sur les obligations de formation",
    excerpt:
      "Les changements réglementaires liés à la réforme CNSS et leurs implications concrètes pour les entreprises du BTP en matière de formation professionnelle.",
    category: "Réglementation",
    date: "18 février 2026",
    readTime: "5 min",
    featured: false,
  },
  {
    id: 6,
    title: "E-learning dans le BTP : retour d'expérience après 3 ans",
    excerpt:
      "Analyse des résultats obtenus sur plus de 2 000 apprenants formés en ligne dans les métiers du bâtiment, de l'architecture et du génie civil.",
    category: "Innovation pédagogique",
    date: "5 février 2026",
    readTime: "9 min",
    featured: false,
  },
];

const featured = posts.find((p) => p.featured)!;
const rest = posts.filter((p) => !p.featured);

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog & Ressources"
        description="Articles de fond, guides pratiques et actualités sectorielles rédigés par les experts Welearn pour enrichir vos pratiques professionnelles."
        eyebrow="Communauté Welearn"
        size="lg"
      />

      {/* Featured article */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-sm font-semibold text-wl-orange uppercase tracking-widest mb-8">
            À la une
          </p>
          <div className="rounded-2xl border border-wl-border overflow-hidden grid lg:grid-cols-2">
            {/* Placeholder image */}
            <div className="h-64 lg:h-auto bg-wl-blue-tint flex items-center justify-center min-h-64">
              <BookOpen className="h-16 w-16 text-wl-blue/25" />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-center p-10 lg:p-14 gap-5">
              <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest">
                {featured.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-wl-text leading-snug">
                {featured.title}
              </h2>
              <p className="text-wl-text-secondary leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-wl-text-secondary">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readTime} de lecture
                </span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-wl-blue cursor-pointer hover:underline">
                  Lire l'article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All articles */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <h2 className="text-3xl font-bold text-wl-text">
              Tous les articles
            </h2>
            {/* Category filters — static for now */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <span
                  key={cat}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? "border-wl-blue bg-wl-blue text-white"
                      : "border-wl-border bg-white text-wl-text-secondary hover:border-wl-blue hover:text-wl-blue"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer"
              >
                {/* Placeholder image */}
                <div className="h-44 bg-wl-blue-tint flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-wl-blue/25" />
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
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} de lecture
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-wl-blue-tint mb-6">
            <BookOpen className="h-8 w-8 text-wl-blue" />
          </div>
          <h2 className="text-3xl font-bold text-wl-text mb-4">
            Ne manquez aucun article
          </h2>
          <p className="text-wl-text-secondary leading-relaxed mb-8">
            Du contenu expert livré directement dans votre boîte mail.
            Actualités sectorielles, guides pratiques et ressources
            pédagogiques, régulièrement.
          </p>
          <a href="/contact">
            <span className="inline-flex items-center gap-2 rounded-lg bg-wl-orange hover:bg-wl-orange-dark text-white font-semibold px-8 py-3 text-base transition-colors cursor-pointer">
              Nous contacter <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
