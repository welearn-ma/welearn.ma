import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Compass, Zap, Search, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Compass,
    title: "Stratégie",
    description:
      "Définition de votre stratégie de transformation et feuille de route opérationnelle.",
    href: "/conseil/strategie",
    features: [
      "Diagnostic stratégique",
      "Vision et objectifs",
      "Feuille de route",
      "Indicateurs de performance",
    ],
  },
  {
    icon: Zap,
    title: "Transformation digitale",
    description:
      "Accompagnement dans la digitalisation de vos processus et l'adoption des outils numériques.",
    href: "/conseil/transformation",
    features: [
      "Analyse des processus",
      "Choix des outils",
      "Conduite du changement",
      "Formation des équipes",
    ],
  },
  {
    icon: Search,
    title: "Études, audits & diagnostics",
    description:
      "Analyses approfondies pour identifier les leviers d'amélioration de votre organisation.",
    href: "/conseil/audits",
    features: [
      "Audit organisationnel",
      "Benchmark secteur",
      "Études de marché",
      "Recommandations",
    ],
  },
];

export function ConseilServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos services"
          title="Comment pouvons-nous vous aider ?"
          description="Des prestations de conseil adaptées aux enjeux du secteur de la Construction."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-secondary rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 w-fit">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-sans text-xl font-bold text-foreground mb-3">
                {service.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
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
                <Link href={service.href}>
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
