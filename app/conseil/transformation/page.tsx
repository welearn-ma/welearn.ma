import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Zap, Settings, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Transformation Digitale | Conseil & Transformation | Welearn",
  description: "Accompagnement dans la digitalisation de vos processus et l'adoption des outils numériques.",
}

const pillars = [
  {
    icon: Settings,
    title: "Processus",
    description: "Optimisation et digitalisation de vos processus métier pour plus d'efficacité.",
  },
  {
    icon: Zap,
    title: "Outils",
    description: "Sélection et déploiement des outils numériques adaptés à vos besoins.",
  },
  {
    icon: Users,
    title: "Compétences",
    description: "Formation et accompagnement des équipes dans l'adoption des nouveaux outils.",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description: "Mesure de l'impact et amélioration continue de votre transformation.",
  },
]

const benefits = [
  "Gain de productivité",
  "Réduction des erreurs",
  "Meilleure collaboration",
  "Traçabilité des données",
  "Prise de décision éclairée",
  "Avantage concurrentiel",
]

export default function TransformationPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">Transformation Digitale</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Accélérez votre transformation digitale avec un accompagnement adapté au secteur de la Construction.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre approche"
            title="Les piliers de la transformation"
            description="Une approche globale pour réussir votre transformation digitale."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="bg-secondary rounded-2xl p-6 text-center">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4">
                  <pillar.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Bénéfices
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
                Pourquoi se transformer ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                La transformation digitale est un levier majeur de compétitivité pour les entreprises du BTP. Elle
                permet d'optimiser les processus, de réduire les coûts et d'améliorer la qualité.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/contact">
                  Lancer votre transformation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
