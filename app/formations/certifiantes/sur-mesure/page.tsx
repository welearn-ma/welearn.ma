import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Wrench, CheckCircle, ArrowRight, MessageSquare, FileText, Users, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Formations Sur Mesure | Welearn",
  description: "Conception de programmes de formation adaptés à vos besoins spécifiques et contexte d'entreprise.",
}

const steps = [
  {
    icon: MessageSquare,
    title: "Analyse des besoins",
    description: "Échange approfondi pour comprendre vos enjeux, objectifs et contraintes.",
  },
  {
    icon: FileText,
    title: "Conception du programme",
    description: "Élaboration d'un programme pédagogique personnalisé avec nos experts.",
  },
  {
    icon: Users,
    title: "Animation de la formation",
    description: "Déploiement de la formation par des formateurs experts dans votre domaine.",
  },
  {
    icon: Rocket,
    title: "Suivi et évaluation",
    description: "Mesure de l'impact et accompagnement post-formation pour ancrer les acquis.",
  },
]

const benefits = [
  "Contenu 100% adapté à votre contexte métier",
  "Exemples et cas pratiques issus de votre entreprise",
  "Planification flexible selon vos contraintes",
  "Formation dans vos locaux ou à distance",
  "Suivi personnalisé des participants",
  "Accompagnement au remboursement CSF",
]

export default function SurMesurePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Wrench className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Solutions Entreprises</span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">Formations Sur Mesure</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Des programmes de formation conçus spécifiquement pour répondre aux besoins de votre entreprise et de vos
            équipes.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre démarche"
            title="Comment ça marche ?"
            description="Un processus structuré pour garantir l'adéquation parfaite entre vos besoins et la formation délivrée."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-secondary rounded-2xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-primary/20">{idx + 1}</span>
                  </div>
                  <h3 className="font-sans text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary/30" />
                  </div>
                )}
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
                Avantages
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
                Pourquoi choisir une formation sur mesure ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Une formation sur mesure garantit un transfert de compétences optimal car elle est construite autour de
                vos problématiques réelles et utilise des exemples issus de votre contexte professionnel.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/contact">
                  Demander un devis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">Prêt à lancer votre projet ?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins et recevoir une proposition personnalisée.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
