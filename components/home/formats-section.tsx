import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings, Monitor, ArrowRight } from "lucide-react";

const formats = [
  {
    icon: GraduationCap,
    title: "Formations",
    subtitle: "(Diplômantes / Certifiantes)",
    description:
      "Formations délivrées par des tiers de confiance en cobrading ou non avec Welearn. Nous collaborons avec des institutions internationales reconnues sur des thématiques à fort positionnement dans l'écosystème (BIM, Real Estate, Matériaux...).",
    href: "/formations",
    image: "/formats/formations.webp",
  },
  {
    icon: Settings,
    title: "Sur mesure",
    subtitle: "(Intra entreprises)",
    description:
      "Formations entièrement personnalisées pour répondre aux besoins spécifiques d'une seule entreprise. Nous collaborons étroitement avec vous pour concevoir des programmes sur mesure adaptés à vos objectifs, permettant ainsi un ciblage efficace au profit de votre équipe.",
    href: "/ingenierie",
    image: "/formats/surmesure.webp",
  },
  {
    icon: Monitor,
    title: "Tout Digital",
    subtitle: "(MOOC / Capsules / VR&AR)",
    description:
      "La Formation Digital learning de Welearn permet d'apporter de la valeur ajoutée via l'innovation. De part la flexibilité qu'elle procure, Welearn adapte ce process au besoin de la cible, en accommodant le format et les outils pédagogiques.",
    href: "/digital-learning",
    image: "/formats/digital.webp",
  },
];

export function FormatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Formats de formation"
          title="Des solutions adaptées à chaque besoin"
          description="Formations, sur-mesure ou digitales : choisissez le format qui correspond à vos objectifs professionnels."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {formats.map((format, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div
                className="h-48 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url('${format.image}')`,
                }}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="font-sans text-2xl font-bold text-foreground mb-1">
                    {format.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {format.subtitle}
                  </p>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                  {format.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full group bg-transparent"
                >
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
  );
}
