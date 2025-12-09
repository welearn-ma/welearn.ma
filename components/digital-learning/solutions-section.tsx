import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Monitor, BookOpen, FileVideo, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: Monitor,
    title: "Plateforme LMS",
    description:
      "Notre plateforme propriétaire welearn.ac offre une expérience d'apprentissage optimale avec suivi personnalisé.",
    href: "/digital-learning/lms",
    features: ["Interface intuitive", "Suivi de progression", "Multi-devices"],
  },
  {
    icon: FileVideo,
    title: "Développement de contenus e-learning",
    description:
      "Conception de contenus digitaux sur-mesure : vidéos, capsules, MOOC, réalité virtuelle pour vos formations.",
    href: "/digital-learning/contenus-elearning",
    features: ["Production vidéo", "Modules interactifs", "Réalité virtuelle"],
  },
  {
    icon: BookOpen,
    title: "Bibliothèque de cours e-learning",
    description:
      "Accédez à notre catalogue de cours en ligne sur les thématiques clés du BTP : BIM, béton, étanchéité...",
    href: "/digital-learning/bibliotheque",
    features: ["50+ cours disponibles", "Accès 24/7", "Certificats inclus"],
  },
];

export function DigitalLearningSolutionsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos solutions"
          title="Une offre complète"
          description="Tous les outils et contenus pour réussir votre transformation digitale de la formation."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="bg-secondary rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 w-fit">
                <solution.icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-sans text-xl font-bold text-foreground mb-3">
                {solution.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                {solution.description}
              </p>

              <ul className="space-y-2 mb-6">
                {solution.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                <Link href={solution.href}>
                  En savoir plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
