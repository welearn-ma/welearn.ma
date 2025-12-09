import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileVideo, Play, Headphones, Glasses, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Développement de contenus e-learning | Welearn",
  description: "Conception de contenus digitaux sur-mesure : vidéos, capsules, MOOC, réalité virtuelle.",
}

const formats = [
  {
    icon: FileVideo,
    title: "Capsules vidéo",
    description: "Vidéos courtes et percutantes pour le micro-learning.",
    examples: ["Tutoriels techniques", "Témoignages experts", "Démonstrations produits"],
  },
  {
    icon: Play,
    title: "Modules interactifs",
    description: "E-learning scénarisé avec quiz et exercices pratiques.",
    examples: ["Parcours gamifiés", "Simulations", "Cas pratiques"],
  },
  {
    icon: Headphones,
    title: "MOOC",
    description: "Formations en ligne complètes avec certification.",
    examples: ["Parcours structurés", "Évaluations continues", "Certificats"],
  },
  {
    icon: Glasses,
    title: "Réalité virtuelle",
    description: "Expériences immersives pour la formation technique.",
    examples: ["Sécurité chantier", "Gestes métier", "Procédures"],
  },
]

const portfolio = [
  { title: "MOOC Technologie Béton", client: "Industriel ciment", type: "MOOC" },
  { title: "Capsules Sécurité VR", client: "Groupe BTP", type: "VR" },
  { title: "E-learning Produits", client: "Distributeur matériaux", type: "E-learning" },
  { title: "Série YouTube BIM", client: "Welearn", type: "Vidéo" },
]

const steps = [
  { step: "1", title: "Cadrage", description: "Analyse des objectifs pédagogiques et du public cible" },
  { step: "2", title: "Conception", description: "Scénarisation et storyboarding des contenus" },
  { step: "3", title: "Production", description: "Réalisation des contenus (tournage, animation, développement)" },
  { step: "4", title: "Déploiement", description: "Intégration sur votre plateforme et suivi" },
]

export default function ContenusElearningPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Production de contenus
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Développement de contenus e-learning
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Conception et production de contenus pédagogiques digitaux sur-mesure pour vos formations.
          </p>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Nos formats"
            title="Des contenus adaptés à vos besoins"
            description="Nous produisons tous types de contenus pédagogiques digitaux."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((format) => (
              <div key={format.title} className="bg-secondary rounded-2xl p-6">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <format.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">{format.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{format.description}</p>
                <ul className="space-y-1">
                  {format.examples.map((example, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre processus"
            title="Comment nous travaillons"
            description="Une méthodologie éprouvée pour des contenus de qualité."
          />

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-6">
                  <span className="text-4xl font-bold text-primary/20 mb-2 block">{step.step}</span>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Portfolio"
            title="Quelques réalisations"
            description="Découvrez des exemples de contenus que nous avons produits."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((item, idx) => (
              <div key={idx} className="group bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video bg-primary/10 relative">
                  <Image
                    src={`/.jpg?height=200&width=350&query=${encodeURIComponent(item.title + " elearning content")}`}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-foreground">{item.type}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.client}</p>
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
            Vous avez un projet de contenu e-learning ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Discutons ensemble de vos besoins et voyons comment nous pouvons vous accompagner.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/contact">
              Demander un devis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
