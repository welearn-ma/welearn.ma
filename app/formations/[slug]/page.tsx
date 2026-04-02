import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { FormationHero } from "@/features/formations/FormationHero";
import { FormationSyllabus } from "@/features/formations/FormationSyllabus";
import { RegistrationForm } from "@/features/formations/RegistrationForm";
import { StickyRegistrationCTA } from "@/features/formations/StickyRegistrationCTA";
import { formations, getFormationBySlug } from "@/data/formations";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return formations.map((formation) => ({ slug: formation.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const formation = getFormationBySlug(slug);

  if (!formation) {
    return { title: "Formation introuvable | Welearn" };
  }

  return {
    title: `${formation.title} | Welearn`,
    description: formation.shortDescription,
  };
}

export default async function FormationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const formation = getFormationBySlug(slug);

  if (!formation) {
    notFound();
  }

  return (
    <>
      <Breadcrumb />
      <FormationHero formation={formation} />

      <main className="bg-white pb-24">
        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            À propos de cette formation
          </h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">
            {formation.longDescription}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {formation.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
          <h2 className="mb-5 text-2xl font-bold text-foreground">Programme</h2>
          <FormationSyllabus modules={formation.modules} />
        </section>

        {formation.instructors && formation.instructors.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
            <h2 className="mb-5 text-2xl font-bold text-foreground">
              Intervenants
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formation.instructors.map((instructor) => (
                <article
                  key={instructor.name}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                >
                  <div
                    className="mb-3 h-12 w-12 rounded-full bg-primary/15"
                    aria-hidden="true"
                  />
                  <h3 className="font-semibold text-foreground">
                    {instructor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {instructor.title}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section
          id="registration-form"
          className="mx-auto max-w-4xl px-4 pb-16 lg:px-8"
        >
          <h2 className="mb-5 text-2xl font-bold text-foreground">
            Demander une inscription
          </h2>
          <RegistrationForm
            formationSlug={formation.slug}
            formationTitle={formation.title}
          />
        </section>
      </main>

      <StickyRegistrationCTA formationTitle={formation.title} />
    </>
  );
}
