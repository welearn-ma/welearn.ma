import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Monitor, BookOpen, FileVideo, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions Digital Learning | Welearn",
  description: "Plateforme LMS, développement de contenus e-learning et bibliothèque de cours pour la construction.",
}

const solutions = [
  {
    icon: Monitor,
    title: "Plateforme LMS",
    description:
      "Notre plateforme propriétaire welearn.ac offre une expérience d'apprentissage optimale avec suivi personnalisé.",
    href: "/digital-learning/lms",
    features: ["Interface intuitive", "Suivi de progression", "Multi-devices"],
  },
  {
    icon: FileVideo,
    title: "Développement de contenus e-learning",
    description:
      "Conception de contenus digitaux sur-mesure : vidéos, capsules, MOOC, réalité virtuelle pour vos formations.",
    href: "/digital-learning/contenus-elearning",
    features: ["Production vidéo", "Modules interactifs", "Réalité virtuelle"],
  },
  {
    icon: BookOpen,
    title: "Bibliothèque de cours e-learning",
    description:
      "Accédez à notre catalogue de cours en ligne sur les thématiques clés du BTP : BIM, béton, étanchéité...",
    href: "/digital-learning/bibliotheque",
    features: ["50+ cours disponibles", "Accès 24/7", "Certificats inclus"],
  },
]

export default function DigitalLearningPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Formation digitale
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Solutions Digital Learning
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Plateforme LMS, contenus sur-mesure et bibliothèque de cours pour digitaliser vos formations.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Nos solutions"
            title="Une offre complète"
            description="Tous les outils et contenus pour réussir votre transformation digitale de la formation."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="bg-secondary rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all"
              >
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 w-fit">
                  <solution.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-sans text-xl font-bold text-foreground mb-3">{solution.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{solution.description}</p>

                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Link href={solution.href}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à digitaliser vos formations ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins et découvrir comment nos solutions peuvent transformer votre
            approche de la formation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/contact">Demander une démonstration</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="https://welearn.ac" target="_blank">
                Accéder au LMS
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
