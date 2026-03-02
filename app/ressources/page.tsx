import type { Metadata } from "next";

import Link from "next/link";
import {
  FileText,
  BookOpen,
  Video,
  Briefcase,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ressources | Welearn",
  description:
    "Actualités, articles, webinaires et études de cas sur la formation professionnelle dans le BTP.",
};

const resourceCategories = [
  {
    title: "Actualités",
    description:
      "Les dernières nouvelles de Welearn et du secteur de la formation professionnelle BTP.",
    href: "/ressources/actualites",
    icon: FileText,
    count: "12 articles",
  },
  {
    title: "Blog / Articles",
    description:
      "Analyses, conseils et bonnes pratiques pour les professionnels du BTP et de la formation.",
    href: "/ressources/blog",
    icon: BookOpen,
    count: "24 articles",
  },
  {
    title: "Webinaires",
    description:
      "Replays de nos webinaires et conférences en ligne sur les thématiques métiers.",
    href: "/ressources/webinaires",
    icon: Video,
    count: "8 replays",
  },
  {
    title: "Études de cas",
    description:
      "Découvrez comment nos clients ont transformé leurs équipes grâce à la formation.",
    href: "/ressources/etudes-de-cas",
    icon: Briefcase,
    count: "15 études",
  },
  {
    title: "FAQ",
    description:
      "Réponses aux questions fréquentes sur nos formations et services.",
    href: "/ressources/faq",
    icon: HelpCircle,
    count: "30+ questions",
  },
];

export default function RessourcesPage() {
  return (
    <>
      <Breadcrumb />
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Centre de ressources
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Ressources
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Actualités, articles de fond, webinaires et études de cas pour
            approfondir vos connaissances.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group bg-secondary rounded-xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-sans text-xl font-bold text-foreground mb-3">
                  {category.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">
                    {category.count}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
