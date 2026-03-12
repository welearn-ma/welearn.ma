import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { GraduationCap, Award, ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Formations Diplômantes",
    description:
      "Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
    icon: GraduationCap,
    href: "/formations/diplomantes",
  },
  {
    title: "Formations Certifiantes",
    description:
      "Certifications professionnelles et formations sur mesure pour les entreprises.",
    icon: Award,
    href: "/formations/certifiantes",
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
            <Link
              key={category.title}
              href={category.href}
              className="group flex flex-col bg-secondary rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="flex-1 p-8 lg:p-10">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-sans text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {category.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 bg-primary group-hover:bg-primary/90 transition-colors px-8 py-4 text-white font-semibold text-base">
                Voir toutes les formations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
