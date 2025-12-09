import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeader } from "@/components/section-header"
import { GraduationCap, Award, ArrowRight, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Formations | Welearn",
  description:
    "Découvrez notre catalogue de formations diplômantes et certifiantes dans le BTP, BIM et management de projet.",
}

const categories = [
  {
    title: "Formations Diplômantes",
    description: "Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
    icon: GraduationCap,
    href: "/formations/diplomantes",
    programs: [
      { name: "Executive Masters", href: "/formations/diplomantes/executive-masters" },
      { name: "Licences Professionnelles", href: "/formations/diplomantes/licences-pro" },
    ],
  },
  {
    title: "Formations Certifiantes",
    description: "Certifications professionnelles et formations sur mesure pour les entreprises.",
    icon: Award,
    href: "/formations/certifiantes",
    programs: [
      { name: "BIM Foundations Professional", href: "/formations/certifiantes/bim-foundations" },
      { name: "Catalogue des formations intra", href: "/formations/certifiantes/catalogue" },
      { name: "Formations sur mesure", href: "/formations/certifiantes/sur-mesure" },
    ],
  },
]

const stats = [
  { value: "500+", label: "Professionnels formés", icon: Users },
  { value: "15+", label: "Programmes disponibles", icon: GraduationCap },
  { value: "50+", label: "Entreprises partenaires", icon: Building2 },
  { value: "95%", label: "Taux de satisfaction", icon: Award },
]

export default function FormationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Catalogue de formations
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Nos Formations
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Des programmes adaptés à tous les profils : formations diplômantes, certifiantes et sur mesure pour le
            secteur de la Construction.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Explorez notre offre"
            title="Catégories de formations"
            description="Choisissez le parcours qui correspond à vos objectifs professionnels."
          />

          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category.title} className="bg-secondary rounded-2xl p-8 lg:p-10">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-sans text-2xl lg:text-3xl font-bold text-foreground mb-3">{category.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{category.description}</p>

                <div className="space-y-3 mb-8">
                  {category.programs.map((program) => (
                    <Link
                      key={program.name}
                      href={program.href}
                      className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {program.name}
                      </span>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>

                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Link href={category.href}>
                    Voir toutes les formations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'aide pour choisir votre formation ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nos conseillers sont à votre disposition pour vous orienter vers le programme le plus adapté à votre profil
            et vos objectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/formations/certifiantes/catalogue">Voir le catalogue</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
