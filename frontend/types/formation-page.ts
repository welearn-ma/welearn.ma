import type { LucideIcon } from "lucide-react";

export type InfoBannerItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export type FormationModule = {
  number: number;
  title: string;
  description?: string;
  /** Contenu affiché sous forme de tags (remplace `description` si présent). */
  items?: string[];
};

export type ExpeditionBlock = {
  eyebrow: string;
  title: string;
  /** Repères courts affichés sous le titre (durée, villes…). */
  highlights: string[];
  image: string;
  imageAlt: string;
  sections: { heading: string; paragraphs: string[] }[];
  benefitsTitle: string;
  benefits: { icon: LucideIcon; title: string; text: string }[];
};

export type FinalBlock = {
  badge: string;
  title: string;
  description: string;
  variant: "orange" | "blue";
};

export type TeachingCard = {
  icon: LucideIcon;
  title: string;
  items?: string[];
  text?: string;
};

export type InscriptionStep = {
  number: number;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export type CertificationBlock = {
  title: string;
  text: string;
};

export type FormationSeo = {
  title: string;
  description: string;
  keywords: string;
};

export type FormationPageData = {
  slug: string;
  title: string;
  subtitle: string;
  partnerLine: string;
  badges: string[];
  infoBanner: InfoBannerItem[];
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /**
   * Brochure PDF disponible (bucket Supabase prive `brochures`). Doit rester
   * aligne avec l'allowlist backend/src/config/brochures.ts.
   */
  hasBrochure?: boolean;
  profiles: string[];
  prerequisites: string[];
  pourquoi: string;
  objectives: string[];
  /** Libellé du badge des modules du programme (défaut : "Module"). */
  moduleLabel?: string;
  modules: FormationModule[];
  finalBlocks: FinalBlock[];
  certification?: CertificationBlock;
  /** Section dédiée affichée sous le programme. */
  expedition?: ExpeditionBlock;
  teaching: TeachingCard[];
  steps: InscriptionStep[];
  session: string;
  ctaInscription: string;
  testimonials: Testimonial[];
  seo: FormationSeo;
};
