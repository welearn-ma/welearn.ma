import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Search, FileText, BarChart3, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "Études, Audits & Diagnostics | Conseil & Transformation | Welearn",
  description: "Analyses approfondies pour identifier les leviers d'amélioration de votre organisation.",
}

const services = [
  {
    icon: Search,
    title: "Audit organisationnel",
    description: "Analyse de votre organisation, processus et compétences pour identifier les axes d'amélioration.",
  },
  {
    icon: BarChart3,
    title: "Benchmark secteur",
    description: "Comparaison de vos pratiques avec les meilleures du secteur de la Construction.",
  },
  {
    icon: FileText,
    title: "Études de marché",
    description: "Analyses de marché et études sectorielles pour éclairer vos décisions stratégiques.",
  },
  {
    icon: Lightbulb,
    title: "Recommandations",
    description: "Préconisations concrètes et plan d'action pour mettre en œuvre les améliorations identifiées.",
  },
]

export default function AuditsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">Études, Audits & Diagnostics</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Des analyses approfondies pour comprendre votre situation et identifier les leviers de performance.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Nos prestations"
            title="Des analyses sur-mesure"
            description="Nous réalisons des études et audits adaptés à vos problématiques spécifiques."
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
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">Besoin d'un diagnostic ?</h2>
          <p className="text-lg text-white/90 mb-8">Contactez-nous pour discuter de vos besoins en analyse et audit.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
