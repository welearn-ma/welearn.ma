import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Briefcase, MapPin, CalendarDays, Users, GraduationCap } from "lucide-react";
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
import { formations, getFormationBySlug } from "@/data/formations";
import type { FormationModule, FinalBlock, TeachingCard, InscriptionStep, Testimonial } from "@/types/formation-page";

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

function buildModules(formation: NonNullable<ReturnType<typeof getFormationBySlug>>): FormationModule[] {
  return formation.modules.map((mod, idx) => ({
    number: idx + 1,
    title: mod.title,
    description: mod.description,
  }));
}

function buildTeaching(formation: NonNullable<ReturnType<typeof getFormationBySlug>>): TeachingCard[] {
  const cards: TeachingCard[] = [];

  if (formation.instructors && formation.instructors.length > 0) {
    cards.push({
      icon: Users,
      title: "Intervenants",
      items: formation.instructors.map((i) => `${i.name} — ${i.title}`),
    });
  }

  cards.push({
    icon: GraduationCap,
    title: "Approche pédagogique",
    items: formation.highlights,
  });

  cards.push({
    icon: MapPin,
    title: "Format",
    text: `${formation.duration} · ${formation.level} · ${formation.language}`,
  });

  return cards;
}

const defaultSteps: InscriptionStep[] = [
  { number: 1, title: "Pré-inscription en ligne", description: "Remplissez le formulaire de pré-inscription." },
  { number: 2, title: "Dossier de candidature", description: "Déposez votre dossier complet." },
  { number: 3, title: "Confirmation", description: "Recevez votre confirmation d'inscription." },
];

// TODO: replace with real testimonials
const defaultTestimonials: Testimonial[] = [
  {
    quote: "Une formation de qualité qui m'a permis de monter en compétences rapidement. L'accompagnement pédagogique est excellent.",
    author: "Prénom Nom",
    role: "Professionnel",
    company: "Entreprise A",
  },
  {
    quote: "Le contenu est directement applicable en contexte professionnel. Je recommande vivement ce programme.",
    author: "Prénom Nom",
    role: "Professionnel",
    company: "Entreprise B",
  },
];

export default async function FormationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const formation = getFormationBySlug(slug);

  if (!formation) {
    notFound();
  }

  const modules = buildModules(formation);
  const teaching = buildTeaching(formation);

  const finalBlocks: FinalBlock[] = [];

  const heroImage = formation.imageUrl
    ?? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80";

  const badges = formation.category === "diplomante"
    ? ["Formation diplômante", formation.level]
    : ["Formation certifiante", formation.level];

  return (
    <>
      <FormationDetailHero
        badges={badges}
        title={formation.title}
        subtitle={formation.subtitle}
        partnerLine={`${formation.duration} · ${formation.language}`}
        infoBanner={[
          { icon: Clock, value: formation.duration, label: "Durée" },
          { icon: Briefcase, value: formation.level, label: "Niveau" },
          { icon: CalendarDays, value: formation.language, label: "Langue" },
          { icon: MapPin, value: formation.category === "diplomante" ? "Présentiel" : "En ligne", label: "Format" },
        ]}
        heroImage={heroImage}
        ctaPrimary="Déposer ma candidature"
        ctaSecondary="Télécharger la brochure"
      />
      <FormationAudience
        profiles={[formation.level]}
        prerequisites={[formation.shortDescription]}
      />
      <FormationWhy text={formation.longDescription} />
      <FormationObjectives objectives={formation.highlights} />
      <FormationProgram modules={modules} finalBlocks={finalBlocks} />
      <FormationTeaching cards={teaching} />
      <FormationInscription
        steps={defaultSteps}
        session="Prochaine session disponible"
        ctaLabel="Déposer ma candidature"
      />
      <FormationTestimonials testimonials={defaultTestimonials} />

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

      <StickyRegistrationCTA formationTitle={formation.title} />
    </>
  );
}
