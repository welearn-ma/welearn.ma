import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ArrowRight } from "lucide-react"

const programs = [
  {
    title: "Mastère Spécialisé BIM et ses Applications",
    partner: "EHTP",
    duration: "12 mois",
    format: "Modulaire",
    badges: ["Accréditation CGE", "Label BIM Manager"],
    description:
      "Formation complète au BIM avec certification BuildingSmart et accréditation de la Conférence des Grandes Écoles.",
    href: "/programs#ms-bim",
  },
  {
    title: "Executive Master Ingénierie Immobilière",
    partner: "EHTP",
    duration: "18 mois",
    format: "Executive",
    badges: ["Executive", "Case Studies"],
    description:
      "Maîtrisez la chaîne de valeur immobilière : valorisation, finance, durabilité et gestion des risques.",
    href: "/programs#em-immo",
  },
  {
    title: "Executive Master Management de Projet - Expert BIM",
    partner: "ESLSCA & Welearn",
    duration: "12 mois",
    format: "Hybride",
    badges: ["PMP® Prep", "BIM Foundations"],
    description: "Double expertise en management de projet et BIM avec préparation aux certifications internationales.",
    href: "/programs#em-pm-bim",
  },
]

export function ProgramsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Masters & Certifications"
          title="Programmes phares"
          description="Des formations diplômantes d'excellence en partenariat avec les grandes écoles d'ingénieurs."
        />

        <div className="space-y-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group bg-secondary rounded-2xl p-6 lg:p-8 hover:bg-(--color-welearn-navy) transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {program.badges.map((badge, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-primary/10 text-primary group-hover:bg-white/10 group-hover:text-white"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-sans text-xl lg:text-2xl font-bold text-foreground group-hover:text-white mb-2 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-primary group-hover:text-white/80 mb-3 font-medium transition-colors">
                    En partenariat avec {program.partner}
                  </p>
                  <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                    {program.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-3 lg:min-w-[200px]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/70">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/70">
                    <Users className="h-4 w-4" />
                    <span>{program.format}</span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary group-hover:bg-white group-hover:text-primary text-white mt-2"
                  >
                    <Link href={program.href}>
                      Détails
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            <Link href="/programs">
              Voir tous les programmes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
