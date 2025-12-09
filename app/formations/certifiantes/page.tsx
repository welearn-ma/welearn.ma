import type { Metadata } from "next"
import Link from "next/link"
import { Award, ArrowRight, FileCheck, Wrench, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Formations Certifiantes | Welearn",
  description: "Certifications professionnelles BIM et formations sur mesure pour les entreprises.",
}

const sections = [
  {
    title: "BIM Foundations Professional",
    description:
      "Certification officielle BuildingSmart validant vos compétences fondamentales en BIM. Reconnue internationalement.",
    icon: Award,
    href: "/formations/certifiantes/bim-foundations",
    features: ["Certification BuildingSmart", "Reconnaissance mondiale", "Préparation intensive"],
  },
  {
    title: "Catalogue des formations intra",
    description: "Notre catalogue complet de formations techniques pour vos équipes : BIM, logiciels, méthodologies.",
    icon: FileCheck,
    href: "/formations/certifiantes/catalogue",
    features: ["50+ formations disponibles", "Formateurs experts", "Sessions personnalisables"],
  },
  {
    title: "Formations sur mesure",
    description: "Conception de programmes de formation adaptés à vos besoins spécifiques et contexte d'entreprise.",
    icon: Wrench,
    href: "/formations/certifiantes/sur-mesure",
    features: ["Analyse des besoins", "Programme personnalisé", "Suivi et évaluation"],
  },
]

export default function CertifiantesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Award className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Formations Certifiantes</span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">
            Certifications & Formations Intra
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Certifications internationales et formations sur mesure pour développer les compétences de vos équipes.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-secondary rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all"
              >
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 w-fit">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-sans text-xl font-bold text-foreground mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{section.description}</p>

                <ul className="space-y-2 mb-6">
                  {section.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Link href={section.href}>
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
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">Vous êtes une entreprise ?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez nos solutions de formation intra-entreprise et bénéficiez d'un accompagnement personnalisé pour le
            développement des compétences de vos équipes.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
