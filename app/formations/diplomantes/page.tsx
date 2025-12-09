import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Formations Diplômantes | Welearn",
  description: "Executive Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
}

const programs = [
  {
    category: "Executive Masters",
    href: "/formations/diplomantes/executive-masters",
    description: "Programmes d'excellence pour cadres et dirigeants",
    items: [
      {
        title: "Mastère Spécialisé BIM et ses Applications",
        partner: "EHTP",
        duration: "12 mois",
        badges: ["CGE", "BuildingSmart"],
      },
      {
        title: "Executive Master Ingénierie Immobilière",
        partner: "EHTP",
        duration: "18 mois",
        badges: ["Executive", "Expert"],
      },
      {
        title: "Executive Master Management de Projet – Expert BIM",
        partner: "ESLSCA",
        duration: "12 mois",
        badges: ["PMP®", "BIM"],
      },
    ],
  },
  {
    category: "Licences Professionnelles",
    href: "/formations/diplomantes/licences-pro",
    description: "Diplômes universitaires reconnus par l'État",
    items: [
      {
        title: "Licence Pro Conduite de Travaux BIM",
        partner: "Université",
        duration: "12 mois",
        badges: ["Bac+3", "BIM"],
      },
      {
        title: "Licence Pro Management de Projet Construction",
        partner: "Université",
        duration: "12 mois",
        badges: ["Bac+3", "Management"],
      },
    ],
  },
]

export default function DiplomantesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <GraduationCap className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Formations Diplômantes</span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">
            Masters & Licences Professionnelles
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Des programmes accrédités en partenariat avec les grandes écoles d'ingénieurs et universités.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-16">
            {programs.map((section) => (
              <div key={section.category}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-sans text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {section.category}
                    </h2>
                    <p className="text-muted-foreground">{section.description}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="hidden md:flex border-primary text-primary bg-transparent"
                  >
                    <Link href={section.href}>
                      Voir tout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, index) => (
                    <div key={index} className="bg-secondary rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.badges.map((badge) => (
                          <Badge key={badge} className="bg-primary/10 text-primary border-0">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-sans text-lg font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-primary text-sm font-medium mb-4">En partenariat avec {item.partner}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-6 md:hidden border-primary text-primary bg-transparent"
                >
                  <Link href={section.href}>
                    Voir tout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
