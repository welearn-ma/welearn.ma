import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { GraduationCap, Settings, Monitor, ArrowRight } from "lucide-react"

const formats = [
  {
    icon: GraduationCap,
    title: "Formations Diplômantes",
    description: "Masters et certificats accrédités CGE en partenariat avec les grandes écoles d'ingénieurs.",
    features: ["Mastère Spécialisé BIM – EHTP", "Executive Master Immobilier", "Executive Master Management de Projet"],
    href: "/programs#masters",
    color: "bg-(--color-welearn-navy)",
  },
  {
    icon: Settings,
    title: "Sur-mesure",
    description: "Ingénierie de formation adaptée à vos besoins spécifiques et création d'académies d'entreprise.",
    features: ["Analyse des besoins", "Conception pédagogique", "Académies corporate"],
    href: "/ingenierie",
    color: "bg-(--color-welearn-navy-light)",
  },
  {
    icon: Monitor,
    title: "Digital Learning",
    description: "Capsules micro-learning, MOOCs et contenus digitaux pour une formation flexible et accessible.",
    features: ["Micro-learning YouTube", "MOOCs certifiants", "Contenus white-label"],
    href: "/digital-learning",
    color: "bg-(--color-welearn-navy)",
  },
]

export function FormatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Formats de formation"
          title="Des solutions adaptées à chaque besoin"
          description="Diplômantes, sur-mesure ou digitales : choisissez le format qui correspond à vos objectifs professionnels."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {formats.map((format, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${format.color} p-6`}>
                <format.icon className="h-10 w-10 text-white mb-4" />
                <h3 className="font-sans text-2xl font-bold text-white">{format.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-6 leading-relaxed">{format.description}</p>
                <ul className="space-y-2 mb-6">
                  {format.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full group bg-transparent">
                  <Link href={format.href}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
