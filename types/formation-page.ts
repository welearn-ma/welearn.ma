import type { LucideIcon } from "lucide-react";

export type InfoBannerItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export type FormationModule = {
  number: number;
  title: string;
  description: string;
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
  profiles: string[];
  prerequisites: string[];
  pourquoi: string;
  objectives: string[];
  modules: FormationModule[];
  finalBlocks: FinalBlock[];
  certification?: CertificationBlock;
  teaching: TeachingCard[];
  steps: InscriptionStep[];
  session: string;
  ctaInscription: string;
  testimonials: Testimonial[];
};
