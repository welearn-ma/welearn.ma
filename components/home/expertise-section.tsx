import { SectionHeader } from "@/components/section-header"
import { Building2, Cpu, Leaf, LineChart, HardHat, Home } from "lucide-react"

const expertises = [
  {
    icon: Cpu,
    title: "BIM & Maquette Numérique",
    description: "Formation complète au Building Information Modeling, de la modélisation à la coordination BIM.",
  },
  {
    icon: Building2,
    title: "Management de Projet",
    description: "Maîtrisez la gestion de projets de construction avec les méthodologies PMP® et agiles.",
  },
  {
    icon: Home,
    title: "Ingénierie Immobilière",
    description: "De la valorisation à la finance immobilière, en passant par la durabilité et les risques.",
  },
  {
    icon: Leaf,
    title: "Efficacité Énergétique",
    description: "Optimisez la performance énergétique des bâtiments selon les normes RT et HQE.",
  },
  {
    icon: HardHat,
    title: "Matériaux de Construction",
    description: "Expertise technique sur les matériaux innovants et traditionnels du secteur BTP.",
  },
  {
    icon: LineChart,
    title: "Executive Education",
    description: "Programmes sur-mesure pour dirigeants et cadres du secteur construction.",
  },
]

export function ExpertiseSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos domaines d'expertise"
          title="Leaders de l'écosystème Construction"
          description="Welearn accompagne les professionnels du BTP dans leur montée en compétences sur les domaines clés du secteur."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertises.map((expertise, index) => (
            <div
              key={index}
              className="group p-6 bg-secondary rounded-2xl hover:bg-(--color-welearn-navy) transition-all duration-300 cursor-pointer"
            >
              <div className="p-3 bg-primary/10 group-hover:bg-white/10 rounded-xl w-fit mb-4 transition-colors">
                <expertise.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-sans text-xl font-semibold mb-2 text-foreground group-hover:text-white transition-colors">
                {expertise.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                {expertise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
