import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  FormationDetailHero,
  FormationAudience,
  FormationWhy,
  FormationObjectives,
  FormationProgram,
  FormationTeaching,
  FormationInscription,
  FormationTestimonials,
} from "@/features/formations/sections";
import { RegistrationForm } from "@/features/formations/RegistrationForm";
import { getFormationBySlug, getAllFormationSlugs } from "@/data/formations";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllFormationSlugs().map((slug) => ({ slug }));
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
    title: formation.seo.title,
    description: formation.seo.description,
    keywords: formation.seo.keywords,
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
      <FormationDetailHero
        badges={formation.badges}
        title={formation.title}
        subtitle={formation.subtitle}
        partnerLine={formation.partnerLine}
        infoBanner={formation.infoBanner}
        heroImage={formation.heroImage}
        ctaPrimary={formation.ctaPrimary}
        ctaSecondary={formation.ctaSecondary}
      />
      <FormationAudience
        profiles={formation.profiles}
        prerequisites={formation.prerequisites}
      />
      <FormationWhy text={formation.pourquoi} />
      <FormationObjectives objectives={formation.objectives} />
      <FormationProgram
        modules={formation.modules}
        finalBlocks={formation.finalBlocks}
        certification={formation.certification}
      />
      <FormationTeaching cards={formation.teaching} />
      <FormationInscription
        steps={formation.steps}
        session={formation.session}
        ctaLabel={formation.ctaInscription}
      />
      <FormationTestimonials testimonials={formation.testimonials} />

      {/* ── REGISTRATION FORM (do not modify) ── */}
      <section id="registration-form" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-5 text-2xl font-bold text-wl-text">
            Demander une inscription
          </h2>
          <RegistrationForm
            formationSlug={formation.slug}
            formationTitle={formation.title}
          />
        </div>
      </section>
    </>
  );
}
