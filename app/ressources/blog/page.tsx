import type { Metadata } from "next"
import { Calendar, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | Welearn",
  description: "Articles et analyses sur la formation professionnelle, le BIM et le secteur BTP.",
}

const articles = [
  {
    id: 1,
    title: "Les tendances de la formation professionnelle en 2025",
    excerpt: "Comment le digital, l'IA et les nouvelles pédagogies transforment la formation continue.",
    author: "Équipe Welearn",
    date: "2025-01-10",
    readTime: "8 min",
    category: "Tendances",
  },
  {
    id: 2,
    title: "BIM Level 2 : Qu'est-ce que cela implique pour les entreprises ?",
    excerpt: "Comprendre les exigences du BIM Level 2 et comment s'y préparer efficacement.",
    author: "Expert BIM",
    date: "2024-12-15",
    readTime: "12 min",
    category: "BIM",
  },
  {
    id: 3,
    title: "Comment construire une académie corporate efficace",
    excerpt: "Les étapes clés pour créer un dispositif de formation interne performant.",
    author: "Équipe Ingénierie",
    date: "2024-11-28",
    readTime: "10 min",
    category: "Corporate",
  },
  {
    id: 4,
    title: "L'impact de la réglementation thermique sur les métiers du BTP",
    excerpt: "Analyse des nouvelles compétences requises face aux évolutions réglementaires.",
    author: "Expert Réglementation",
    date: "2024-11-15",
    readTime: "6 min",
    category: "Réglementation",
  },
  {
    id: 5,
    title: "Blended learning : la formule gagnante pour la formation professionnelle",
    excerpt: "Pourquoi combiner présentiel et digital optimise l'apprentissage des adultes.",
    author: "Équipe Pédagogie",
    date: "2024-10-20",
    readTime: "7 min",
    category: "Pédagogie",
  },
  {
    id: 6,
    title: "ROI de la formation : comment le mesurer concrètement",
    excerpt: "Méthodologies et indicateurs pour évaluer le retour sur investissement formation.",
    author: "Équipe Conseil",
    date: "2024-10-05",
    readTime: "9 min",
    category: "Management",
  },
]

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Analyses & conseils
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">Blog</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Articles de fond, analyses et bonnes pratiques pour les professionnels de la formation et du BTP.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-primary/10" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.readTime} de lecture</span>
                  </div>
                  <h2 className="font-sans text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
