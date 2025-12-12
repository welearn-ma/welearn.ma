import { SectionHeader } from "@/components/section-header";
import { CardGrid } from "@/components/card-grid";
import {
  Lightbulb,
  Target,
  Heart,
  Zap,
  BookOpen,
  Handshake,
} from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Des fois, pour avancer, il est nécessaire d'envisager ce qui ne l'a jamais encore été. Innover donc, devient pour nous un démultiplicateur de possibilités. Ce n'est, à nos yeux, ni un label ni une image de marque, mais plutôt une extension infinie des horizons.",
    color: "bg-blue-500",
  },
  {
    icon: Target,
    title: "Excellence",
    description:
      "Nous répondons aux besoins de nos clients, avec des produits et des services excellents, conçus et montés selon des critères d'excellence. Nous ne considérons pas cette valeur comme une marque de luxe, mais plutôt comme le standard qui doit nous accompagner partout dans la vie.",
    color: "bg-primary",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "La passion nous propulse, et nous pousse vers les horizons les plus ouverts et les plus larges. Cela nous dote d'une dynamique permanente, transformant ainsi, challenge après challenge, en succès après succès.",
    color: "bg-rose-500",
  },
  {
    icon: Zap,
    title: "Audace",
    description:
      "Le progrès commence lorsqu'on écarte le mot 'impossible' de notre dictionnaire. Ainsi, pour matérialiser un succès, nous avons de l'ambition, nous osons, et nous tentons en permanence tout ce à quoi nous pourrions avoir accès.",
    color: "bg-amber-500",
  },
  {
    icon: BookOpen,
    title: "Transmission",
    description:
      "Le partage des savoirs et des expériences est au cœur de notre mission. Nous croyons que la transmission des connaissances est le vecteur principal du progrès et du développement durable dans le secteur de la construction.",
    color: "bg-emerald-600",
  },
  {
    icon: Handshake,
    title: "Engagement",
    description:
      "Nous nous engageons pleinement auprès de nos partenaires et apprenants, en incarnant nos valeurs au quotidien. Notre engagement est la promesse de résultats durables, d'une écoute active et d'une collaboration sincère pour transformer les aspirations en réalités concrètes.",
    color: "bg-indigo-600",
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
