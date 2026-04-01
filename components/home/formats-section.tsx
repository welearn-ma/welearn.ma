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
    iconBg: "bg-wl-blue-tint",
    iconColor: "text-wl-blue",
    barColor: "bg-wl-blue",
    featured: false,
  },
  {
    icon: Settings,
    title: "Formations sur mesure",
    description:
      "Programmes intra-entreprise : analyse des besoins, ingénierie pédagogique, déploiement, évaluation. Accompagnement remboursement CSF inclus.",
    href: "/ingenierie",
    cta: "Demander un programme sur mesure",
    iconBg: "bg-wl-orange-tint",
    iconColor: "text-wl-orange",
    barColor: "bg-wl-orange",
    featured: true,
  },
  {
    icon: Monitor,
    title: "Digital Learning",
    description:
      "Plateforme LMS welearn.ac : MOOCs, e-learning, VR, micro-learning, produits par notre studio intégré.",
    href: "https://welearn.ac",
    cta: "Accéder à la plateforme",
    iconBg: "bg-wl-success-tint",
    iconColor: "text-wl-success",
    barColor: "bg-wl-success",
    external: true,
    featured: false,
  },
  {
    icon: Building2,
    title: "Académies d'entreprise",
    description:
      "Structurer le développement des compétences à grande échelle : stratégie, parcours, plateforme, déploiement.",
    href: "/contact",
    cta: "En savoir plus",
    iconBg: "bg-wl-purple-tint",
    iconColor: "text-wl-accent-purple",
    barColor: "bg-wl-accent-purple",
    featured: false,
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
                className={`group relative flex flex-col overflow-hidden rounded-xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${
                  solution.featured
                    ? "border-2 border-wl-orange"
                    : "border border-wl-border"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${solution.barColor}`}
                />
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${solution.iconBg}`}
                >
                  <Icon
                    className={`h-6 w-6 ${solution.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-sans text-lg font-bold text-wl-text mb-3 leading-snug">
                  {solution.title}
                </h3>
                <p className="text-sm text-wl-text-secondary leading-relaxed flex-1 mb-6">
                  {solution.description}
                </p>
                <Button
                  asChild
                  size="sm"
                  className={`w-full transition-colors ${
                    solution.featured
                      ? "bg-wl-orange hover:bg-wl-orange-dark text-white border-0"
                      : "bg-transparent border border-wl-border text-wl-text-secondary hover:border-wl-blue hover:text-wl-blue"
                  }`}
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
