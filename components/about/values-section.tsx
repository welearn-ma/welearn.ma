import { SectionHeader } from "@/components/section-header";
import { CardGrid } from "@/components/card-grid";
import {
  Lightbulb,
  Target,
  Users,
  Heart,
  Shield,
  Sparkles,
} from "lucide-react";

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
];

export function ValuesSection() {
  return (
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
  );
}
