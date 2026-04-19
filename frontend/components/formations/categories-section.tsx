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
    <section className="py-20 lg:py-28 bg-wl-gray-light">
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
              className="group flex flex-col overflow-hidden rounded-xl border border-wl-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="flex-1 p-8 lg:p-10">
                <div className="inline-flex rounded-2xl bg-wl-blue-tint p-4 mb-6">
                  <category.icon className="h-8 w-8 text-wl-blue" />
                </div>
                <h2 className="font-sans text-2xl lg:text-3xl font-bold text-wl-text mb-3">
                  {category.title}
                </h2>
                <p className="text-wl-text-secondary leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-wl-border bg-wl-blue px-8 py-4 text-base font-semibold text-white transition-colors group-hover:bg-wl-blue-dark">
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
