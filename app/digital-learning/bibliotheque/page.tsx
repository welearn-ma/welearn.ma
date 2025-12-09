import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, Play, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Bibliothèque de cours e-learning | Welearn",
  description: "Catalogue de cours en ligne sur les thématiques clés du BTP : BIM, béton, étanchéité, sécurité.",
}

const courses = [
  {
    title: "Technologie Béton",
    category: "Matériaux",
    duration: "4h",
    modules: 24,
    learners: 1100,
    description: "Formation complète sur la technologie du béton : composition, mise en œuvre, pathologies.",
  },
  {
    title: "Étanchéité Bâtiment",
    category: "Techniques",
    duration: "3h",
    modules: 18,
    learners: 500,
    description: "Maîtrisez les techniques d'étanchéité : toitures, fondations, façades.",
  },
  {
    title: "Introduction au BIM",
    category: "BIM",
    duration: "2h",
    modules: 12,
    learners: 800,
    description: "Découvrez les fondamentaux du Building Information Modeling.",
  },
  {
    title: "Sécurité Chantier",
    category: "Sécurité",
    duration: "2h30",
    modules: 15,
    learners: 1500,
    description: "Les règles essentielles de sécurité sur les chantiers de construction.",
  },
  {
    title: "Réglementation Thermique",
    category: "Réglementation",
    duration: "3h",
    modules: 20,
    learners: 600,
    description: "Comprendre et appliquer la réglementation thermique RE2020.",
  },
  {
    title: "Lecture de Plans",
    category: "Fondamentaux",
    duration: "2h",
    modules: 10,
    learners: 900,
    description: "Apprendre à lire et interpréter les plans de construction.",
  },
]

const categories = ["Tous", "BIM", "Matériaux", "Techniques", "Sécurité", "Réglementation", "Fondamentaux"]

export default function BibliothequePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Catalogue de cours
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Bibliothèque de cours e-learning
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Accédez à notre catalogue de formations en ligne sur les thématiques clés du secteur Construction.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Nos cours"
            title="Explorez notre catalogue"
            description="Des formations accessibles 24/7 pour monter en compétences à votre rythme."
          />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "Tous" ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${category === "Tous" ? "bg-primary text-white" : "hover:bg-primary/10"}`}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-secondary rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-video bg-primary/10 relative flex items-center justify-center">
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-full group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Play className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <Badge className="absolute top-3 right-3 bg-white text-foreground">{course.category}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-sans text-lg font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.learners}+
                    </span>
                  </div>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Link href="/contact">Accéder au cours</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Vous souhaitez accéder à la bibliothèque complète ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Créez votre compte sur notre plateforme LMS pour accéder à tous nos cours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="https://welearn.ac" target="_blank">
                Créer un compte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/contact">Demander un accès entreprise</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
