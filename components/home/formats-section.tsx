import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings, Monitor, Building2, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: GraduationCap,
    title: "Formations diplômantes",
    description:
      "Mastère Spécialisé BIM, Executive Master Ingénierie Immobilière, Certification BIM Foundations — co-construits avec l'EHTP.",
    href: "/formations",
    cta: "Découvrir nos programmes",
    accentColor: "oklch(0.25 0.08 250)",
  },
  {
    icon: Settings,
    title: "Formations sur mesure",
    description:
      "Programmes intra-entreprise : analyse des besoins, ingénierie pédagogique, déploiement, évaluation. Accompagnement remboursement CSF inclus.",
    href: "/ingenierie",
    cta: "Demander un programme sur mesure",
    accentColor: "oklch(0.35 0.08 250)",
  },
  {
    icon: Monitor,
    title: "Digital Learning",
    description:
      "Plateforme LMS welearn.ac : MOOCs, e-learning, VR, micro-learning, produits par notre studio intégré.",
    href: "https://welearn.ac",
    cta: "Accéder à la plateforme",
    accentColor: "oklch(0.45 0.08 250)",
    external: true,
  },
  {
    icon: Building2,
    title: "Académies d'entreprise",
    description:
      "Structurer le développement des compétences à grande échelle : stratégie, parcours, plateforme, déploiement.",
    href: "/contact",
    cta: "En savoir plus",
    accentColor: "oklch(0.55 0.08 250)",
  },
];

export function FormatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos solutions"
          title="Des solutions adaptées à chaque besoin"
          description="Professionnel en quête de certification, entreprise souhaitant monter en compétences ou institution cherchant un partenaire stratégique — Welearn s'adapte à votre contexte."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 hover:shadow-xl hover:border-transparent transition-all duration-300"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: solution.accentColor }}
                />
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${solution.accentColor} 12%, transparent)`,
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: solution.accentColor }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-3 leading-snug">
                  {solution.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                  {solution.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:border-(--color-welearn-navy) group-hover:text-(--color-welearn-navy) bg-transparent transition-colors"
                >
                  <Link
                    href={solution.href}
                    {...(solution.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {solution.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
