import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import {
  getPublishedArticleBySlug,
  getPublishedArticleSlugs,
} from "@/lib/blog";
import { formatArticleDate } from "@/lib/blog-date";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable | Welearn" };
  }

  return {
    title: `${article.title} | Welearn`,
    description: article.excerpt ?? undefined,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Link
          href="/blog/"
          className="flex w-fit items-center gap-2 text-sm font-semibold text-wl-blue hover:underline mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au blog
        </Link>

        {article.category && (
          <span className="inline-block text-xs font-semibold text-wl-orange uppercase tracking-widest mb-4">
            {article.category}
          </span>
        )}

        <h1 className="text-3xl lg:text-4xl font-bold text-wl-text leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-sm text-wl-text-secondary mb-10">
          {formatArticleDate(article.published_at)}
        </p>

        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full rounded-2xl mb-12 object-cover"
          />
        )}

        <div className="wl-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt ?? ""} className="rounded-lg w-full" />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wl-blue underline hover:text-wl-blue-dark"
                >
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
