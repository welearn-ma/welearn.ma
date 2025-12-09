import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Formations Diplômantes",
    description:
      "Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
    icon: GraduationCap,
    href: "/formations/diplomantes",
    programs: [
      {
        name: "Executive Masters",
        href: "/formations/diplomantes/executive-masters",
      },
      {
        name: "Licences Professionnelles",
        href: "/formations/diplomantes/licences-pro",
      },
    ],
  },
  {
    title: "Formations Certifiantes",
    description:
      "Certifications professionnelles et formations sur mesure pour les entreprises.",
    icon: Award,
    href: "/formations/certifiantes",
    programs: [
      {
        name: "BIM Foundations Professional",
        href: "/formations/certifiantes/bim-foundations",
      },
      {
        name: "Catalogue des formations intra",
        href: "/formations/certifiantes/catalogue",
      },
      {
        name: "Formations sur mesure",
        href: "/formations/certifiantes/sur-mesure",
      },
    ],
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Explorez notre offre"
          title="Catégories de formations"
          description="Choisissez le parcours qui correspond à vos objectifs professionnels."
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-secondary rounded-2xl p-8 lg:p-10"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
                <category.icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-sans text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {category.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {category.description}
              </p>

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

              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
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
  );
}
