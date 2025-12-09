import type { Metadata } from "next"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Lightbulb, BarChart3, Building2, ArrowRight, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Ingénierie de Formation | Welearn",
  description:
    "Solutions sur-mesure pour entreprises : analyse des besoins, conception pédagogique, académies d'entreprise.",
}

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Analyse des besoins",
    description:
      "Diagnostic approfondi des compétences existantes et identification des gaps à combler pour atteindre vos objectifs stratégiques.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Conception pédagogique",
    description:
      "Développement de programmes sur-mesure avec les méthodes les plus adaptées : présentiel, digital, blended learning.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Évaluation & Ajustement",
    description: "Suivi des résultats et amélioration continue des dispositifs de formation pour maximiser l'impact.",
  },
]

const parcours = [
  "BIM pour la Maîtrise d'Ouvrage (MOA)",
  "BIM 4D/5D/6D/7D avancé",
  "Expertise immobilière",
  "Management de projet construction",
  "Efficacité énergétique des bâtiments",
  "Réglementation technique du bâtiment",
]

export default function IngenieriePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Solutions sur-mesure
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Ingénierie de Formation
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Des solutions personnalisées pour développer les compétences de vos équipes et créer votre propre académie
            d'entreprise.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">Une approche sur-mesure</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welearn accompagne les entreprises du secteur Construction dans la conception et le déploiement de
            dispositifs de formation adaptés à leurs enjeux spécifiques. De l'analyse des besoins à l'évaluation des
            résultats, nous vous accompagnons à chaque étape.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre démarche"
            title="Une méthodologie en 3 étapes"
            description="Un processus structuré pour garantir l'efficacité de vos formations."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-bold text-primary/10">{step.number}</span>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-sans text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Academies */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
                Académies d'entreprise
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
                Créez votre académie corporate
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Welearn vous accompagne dans la création et le pilotage de votre propre académie d'entreprise. Formez
                vos collaborateurs en continu avec des parcours personnalisés et une plateforme dédiée.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Parcours de formation personnalisés",
                  "Plateforme LMS dédiée",
                  "Contenus sur-mesure",
                  "Suivi et reporting avancés",
                  "Accompagnement pédagogique",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="h-5 w-5 text-white shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
              >
                <Link href="/contact">
                  Discuter de votre projet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Building2 className="h-16 w-16 text-white mb-6" />
                <h3 className="font-sans text-2xl font-bold text-white mb-4">Votre Académie</h3>
                <p className="text-white/70 mb-6">
                  Structurez et valorisez la formation au sein de votre organisation avec une académie qui porte vos
                  valeurs.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm text-white/70">Personnalisable</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-white/70">Accessible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours Examples */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Exemples de parcours"
            title="Parcours réalisés"
            description="Découvrez quelques exemples de parcours de formation que nous avons conçus pour nos clients."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {parcours.map((parcour, index) => (
              <div
                key={index}
                className="bg-secondary rounded-xl px-6 py-4 hover:bg-(--color-welearn-navy) hover:text-white transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary group-hover:bg-(--color-welearn-gold) rounded-full transition-colors" />
                  <span className="font-medium">{parcour}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <Link href="/contact">
                Demander un devis personnalisé
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
