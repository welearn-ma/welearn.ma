import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Compass, Target, Map, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Stratégie | Conseil & Transformation | Welearn",
  description: "Définition de votre stratégie de transformation et feuille de route opérationnelle.",
}

const services = [
  {
    icon: Compass,
    title: "Vision stratégique",
    description: "Définition de votre vision et de vos ambitions à moyen et long terme.",
  },
  {
    icon: Target,
    title: "Objectifs et KPIs",
    description: "Identification des objectifs mesurables et des indicateurs de performance.",
  },
  {
    icon: Map,
    title: "Feuille de route",
    description: "Élaboration d'un plan d'action détaillé avec jalons et livrables.",
  },
  {
    icon: BarChart3,
    title: "Pilotage",
    description: "Mise en place d'un dispositif de suivi et d'amélioration continue.",
  },
]

export default function ConseilStrategiePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">Conseil Stratégique</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Définissez une vision claire et une feuille de route opérationnelle pour atteindre vos objectifs.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre approche"
            title="Une démarche structurée"
            description="Nous vous accompagnons dans la définition et la mise en œuvre de votre stratégie."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-secondary rounded-2xl p-8">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-sans text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">Prêt à définir votre stratégie ?</h2>
          <p className="text-lg text-white/90 mb-8">Contactez-nous pour discuter de vos enjeux stratégiques.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/contact">Prendre rendez-vous</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
