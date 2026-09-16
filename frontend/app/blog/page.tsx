import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BookOpen, ArrowRight } from "lucide-react";
import { getPublishedArticles } from "@/lib/blog";
import { formatArticleDate } from "@/lib/blog-date";

export const metadata: Metadata = {
  title: "Blog | Welearn",
  description:
    "Articles, guides et actualités pour les professionnels du BTP, de l'architecture et de l'immobilier. Expertise Welearn.",
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHero
        title="Blog & Ressources"
        description="Articles de fond, guides pratiques et actualités sectorielles rédigés par les experts Welearn pour enrichir vos pratiques professionnelles."
        eyebrow="Communauté Welearn"
        size="lg"
      />

      {featured && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <p className="text-sm font-semibold text-wl-orange uppercase tracking-widest mb-8">
              À la une
            </p>
            <Link href={`/blog/${featured.slug}/`}>
              <div className="rounded-2xl border border-wl-border overflow-hidden grid lg:grid-cols-2 cursor-pointer transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="h-64 lg:h-auto min-h-64 bg-wl-blue-tint">
                  {featured.cover_image ? (
                    <img
                      src={featured.cover_image}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-16 w-16 text-wl-blue/25" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-10 lg:p-14 gap-5">
                  {featured.category && (
                    <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest">
                      {featured.category}
                    </span>
                  )}
                  <h2 className="text-2xl lg:text-3xl font-bold text-wl-text leading-snug">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-wl-text-secondary leading-relaxed">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-wl-text-secondary">
                    <span>{formatArticleDate(featured.published_at)}</span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-wl-blue hover:underline">
                      Lire l&apos;article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-wl-text mb-12">
            Tous les articles
          </h2>

          {rest.length === 0 && !featured ? (
            <p className="text-wl-text-secondary">
              Aucun article publié pour le moment.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}/`}>
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer">
                    <div className="h-44 bg-wl-blue-tint">
                      {article.cover_image ? (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-10 w-10 text-wl-blue/25" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-6 gap-4">
                      {article.category && (
                        <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest">
                          {article.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-wl-text leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-wl-text-secondary leading-relaxed flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-wl-text-secondary pt-2 border-t border-wl-border">
                        <span>{formatArticleDate(article.published_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
