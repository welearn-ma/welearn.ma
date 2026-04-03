import type { Metadata } from "next";
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
import { StickyRegistrationCTA } from "@/features/formations/StickyRegistrationCTA";
import { getFormationBySlug } from "@/data/formations";

const data = getFormationBySlug("mastere-bim")!;

export const metadata: Metadata = {
  title: data.seo.title,
  description: data.seo.description,
  keywords: data.seo.keywords,
};

export default function MastereBIMPage() {
  return (
    <>
      <FormationDetailHero
        badges={data.badges}
        title={data.title}
        subtitle={data.subtitle}
        partnerLine={data.partnerLine}
        infoBanner={data.infoBanner}
        heroImage={data.heroImage}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
      <FormationAudience profiles={data.profiles} prerequisites={data.prerequisites} />
      <FormationWhy text={data.pourquoi} />
      <FormationObjectives objectives={data.objectives} />
      <FormationProgram modules={data.modules} finalBlocks={data.finalBlocks} />
      <FormationTeaching cards={data.teaching} />
      <FormationInscription
        steps={data.steps}
        session={data.session}
        ctaLabel={data.ctaInscription}
      />
      <FormationTestimonials testimonials={data.testimonials} />

      {/* ── REGISTRATION FORM (do not modify) ── */}
      <section id="registration-form" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-5 text-2xl font-bold text-wl-text">
            Demander une inscription
          </h2>
          <RegistrationForm
            formationSlug="mastere-bim"
            formationTitle="Mastère Spécialisé® BIM & ses Applications"
          />
        </div>
      </section>

      <StickyRegistrationCTA formationTitle="Mastère Spécialisé® BIM & ses Applications" />
    </>
  );
}
