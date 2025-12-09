import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { SectionHeader } from "@/components/section-header"
import { Timeline } from "@/components/timeline"
import { CardGrid } from "@/components/card-grid"
import { TeamGrid } from "@/components/team-grid"
import { Testimonials } from "@/components/testimonials"
import { LogoGrid } from "@/components/logo-grid"
import {
  Award,
  Calendar,
  TrendingUp,
  Globe,
  Target,
  Lightbulb,
  Users,
  Heart,
  Shield,
  Sparkles,
  BookOpen,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "À propos | Welearn",
  description:
    "Découvrez Welearn, EdTech innovante dédiée au secteur de la Construction. Jeune Entreprise Innovante® en France et au Maroc.",
}

const milestones = [
  {
    year: "2018",
    title: "Création de Welearn",
    description:
      "Fondation de Welearn avec la vision de transformer la formation dans le secteur de la Construction au Maroc.",
    icon: Calendar,
  },
  {
    year: "2019",
    title: "Label JEI France",
    description:
      "Obtention du label Jeune Entreprise Innovante® en France, reconnaissance de notre approche pionnière.",
    icon: Award,
  },
  {
    year: "2020",
    title: "Expansion digitale",
    description: "Lancement de notre plateforme LMS et développement de notre offre de formation à distance.",
    icon: TrendingUp,
  },
  {
    year: "2021",
    title: "Partenariats académiques",
    description: "Signature de partenariats stratégiques avec l'EHTP et ESLSCA pour les programmes diplômants.",
    icon: Globe,
  },
  {
    year: "2022",
    title: "Label JEI Maroc",
    description: "Reconnaissance comme Jeune Entreprise Innovante® au Maroc par l'ADD.",
    icon: Award,
  },
  {
    year: "2023",
    title: "Expansion régionale",
    description: "Développement de notre présence en Afrique francophone et lancement de nouveaux programmes.",
    icon: Globe,
  },
]

const missions = [
  {
    icon: Target,
    title: "Former les professionnels de demain",
    description:
      "Proposer des formations de haute qualité adaptées aux enjeux contemporains du secteur de la Construction.",
    color: "bg-primary",
  },
  {
    icon: Lightbulb,
    title: "Innover en pédagogie",
    description:
      "Développer des méthodes d'apprentissage innovantes combinant expertise technique et outils numériques.",
    color: "bg-primary",
  },
  {
    icon: Users,
    title: "Accompagner les entreprises",
    description:
      "Être le partenaire privilégié des entreprises du BTP dans leur stratégie de développement des compétences.",
    color: "bg-primary",
  },
  {
    icon: Globe,
    title: "Rayonner en Afrique",
    description:
      "Contribuer au développement des compétences dans le secteur de la Construction à l'échelle du continent.",
    color: "bg-primary",
  },
  {
    icon: BookOpen,
    title: "Valoriser les certifications",
    description:
      "Permettre l'accès aux certifications internationales reconnues (BIM, PMP®) pour valoriser les parcours.",
    color: "bg-primary",
  },
  {
    icon: Zap,
    title: "Accélérer la transformation",
    description:
      "Accompagner la transformation numérique du secteur de la Construction par la formation et le conseil.",
    color: "bg-primary",
  },
]

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Pionnier dans l'application des nouvelles technologies à la formation construction. Nous explorons constamment de nouvelles approches pédagogiques.",
    color: "bg-blue-500",
  },
  {
    icon: Target,
    title: "Excellence",
    description:
      "Des formations de haut niveau avec des partenaires académiques prestigieux. Nous visons l'excellence dans chaque programme proposé.",
    color: "bg-primary",
  },
  {
    icon: Users,
    title: "Accompagnement",
    description:
      "Un suivi personnalisé pour chaque apprenant et chaque entreprise. Nous croyons en la force de l'accompagnement humain.",
    color: "bg-emerald-600",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Une équipe passionnée par la transmission des savoirs et le développement des compétences dans le secteur de la Construction.",
    color: "bg-rose-500",
  },
  {
    icon: Shield,
    title: "Intégrité",
    description:
      "Transparence et honnêteté dans toutes nos relations. Nous construisons des partenariats durables basés sur la confiance.",
    color: "bg-amber-500",
  },
  {
    icon: Sparkles,
    title: "Impact",
    description:
      "Chaque formation dispensée doit avoir un impact réel sur les compétences et la carrière de nos apprenants.",
    color: "bg-violet-500",
  },
]

const team = [
  {
    name: "Mohamed Alami",
    role: "Fondateur & CEO",
    bio: "Expert en transformation digitale du secteur BTP avec plus de 15 ans d'expérience.",
    image: "/ceo-portrait.png",
  },
  {
    name: "Sarah Bennis",
    role: "Directrice Pédagogique",
    bio: "Spécialiste en ingénierie de formation et développement des compétences.",
    image: "/professional-woman-director.png",
  },
  {
    name: "Karim Tazi",
    role: "Directeur BIM",
    bio: "Expert BIM certifié BuildingSmart, coordinateur de projets complexes.",
    image: "/professional-man-bim-expert-portrait.jpg",
  },
  {
    name: "Fatima Zahra El Ouafi",
    role: "Responsable Digital Learning",
    bio: "Experte en conception de contenus e-learning et plateformes LMS.",
    image: "/professional-woman-digital-learning-portrait.jpg",
  },
  {
    name: "Youssef Amrani",
    role: "Directeur Commercial",
    bio: "Développement des partenariats et relations entreprises.",
    image: "/professional-sales-director.png",
  },
  {
    name: "Nadia Berrada",
    role: "Responsable Relations Académiques",
    bio: "Coordination des partenariats avec les grandes écoles et universités.",
    image: "/professional-woman-academic-portrait.jpg",
  },
]

const clients = [
  { name: "OCP", logo: "/ocp-corporate-logo.jpg" },
  { name: "ONCF", logo: "/oncf-railway-corporate-logo.jpg" },
  { name: "Addoha", logo: "/addoha-real-estate-logo.jpg" },
  { name: "Alliances", logo: "/alliances-construction-logo.jpg" },
  { name: "SGTM", logo: "/sgtm-construction-corporate-logo.jpg" },
  { name: "Jet Contractors", logo: "/jet-contractors-construction-logo.jpg" },
  { name: "LafargeHolcim", logo: "/lafargeholcim-cement-logo.jpg" },
  { name: "Sonasid", logo: "/sonasid-steel-corporate-logo.jpg" },
]

const testimonials = [
  {
    quote:
      "Welearn nous a accompagnés dans la mise en place d'un programme de formation BIM complet pour nos équipes. Les résultats sont au-delà de nos attentes.",
    author: "Directeur Technique",
    company: "Grand Groupe BTP",
  },
  {
    quote:
      "La qualité pédagogique et l'expertise des formateurs Welearn ont permis à nos collaborateurs de monter rapidement en compétences sur les outils BIM.",
    author: "DRH",
    company: "Promoteur Immobilier",
  },
  {
    quote:
      "Un partenaire de confiance pour notre stratégie de formation. L'accompagnement CSF a été particulièrement précieux.",
    author: "Directeur Formation",
    company: "Entreprise de Construction",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="À propos de Welearn"
        description="EdTech destinée au secteur de la Construction, reconnue comme Jeune Entreprise Innovante® en France et au Maroc."
        badge={{ icon: Award, text: "Jeune Entreprise Innovante®" }}
      />

      {/* Overview Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Qui sommes-nous
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                Former les professionnels de demain
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welearn est née de la conviction que le secteur de la Construction a besoin d'une formation adaptée
                  aux enjeux contemporains : digitalisation, transition écologique, et excellence opérationnelle.
                </p>
                <p>
                  Reconnue comme <strong className="text-foreground">Jeune Entreprise Innovante®</strong> en France et
                  au Maroc, nous bénéficions également de la reconnaissance de l'
                  <strong className="text-foreground">Agence de Développement du Digital (ADD)</strong> pour notre
                  approche pionnière.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/modern-office-team-collaboration-construction-trai.jpg"
                  alt="Équipe Welearn"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Histoire Section */}
      <section id="histoire" className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre parcours"
            title="Notre Histoire"
            description="De la vision à la réalité : découvrez le parcours de Welearn depuis sa création."
          />
          <Timeline items={milestones} />
        </div>
      </section>

      {/* Missions Section */}
      <section id="missions" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre engagement"
            title="Nos Missions"
            description="Les missions qui guident notre action au quotidien pour transformer la formation professionnelle."
          />
          <CardGrid items={missions} columns={3} />
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/construction-site-workers-training-bim-technology.jpg"
                alt="Formation sur chantier"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Notre approche
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                L'excellence au service de la Construction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nous combinons expertise technique, innovation pédagogique et accompagnement personnalisé pour offrir
                des formations qui répondent aux défis réels du secteur de la Construction.
              </p>
              <ul className="space-y-3">
                {["Formateurs experts du secteur", "Méthodes pédagogiques innovantes", "Suivi personnalisé"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section id="valeurs" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Ce qui nous guide"
            title="Nos Valeurs"
            description="Les principes fondamentaux qui définissent notre identité et guident nos actions."
          />
          <CardGrid items={values} columns={3} />
        </div>
      </section>

      {/* Équipe Section */}
      <section id="equipe" className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Les experts"
            title="Notre Équipe"
            description="Des experts passionnés au service de votre développement professionnel."
          />
          <TeamGrid members={team} />
        </div>
      </section>

      {/* Références Section */}
      <section id="references" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Nos clients"
            title="Nos Références"
            description="Des leaders du secteur de la Construction nous font confiance."
          />
          <LogoGrid logos={clients} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader eyebrow="Témoignages" title="Ce qu'ils disent de nous" description="" />
          <Testimonials items={testimonials} />
        </div>
      </section>
    </>
  )
}
