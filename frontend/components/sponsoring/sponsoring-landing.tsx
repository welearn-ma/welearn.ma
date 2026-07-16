import Image from "next/image";
import {
  CheckCircle,
  ChevronRight,
  HeartHandshake,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";
import type { SponsorProgram } from "@/types/sponsor";

export type LandingItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type LandingContact = {
  name: string;
  role: string;
  phone?: string;
  email: string;
};

export type SponsoringLandingProps = {
  hero: {
    eyebrow: string;
    /** Début du H1, avant le segment mis en avant. */
    titleLead: string;
    /** Fin du H1, mise en avant en wl-highlight. */
    titleEmphasis: string;
    subtitle: string;
    /** Nom du partenaire co-brandé (alt du logo). */
    partnerName: string;
    /** Chemin du logo partenaire — le fichier doit exister dans /public. */
    partnerLogo: string;
    /** 2 à 4 points de valeur repris du contenu existant de la page. */
    chips: string[];
  };
  contexte: {
    heading: string;
    paragraphs: string[];
    cardTitle: string;
    cardPoints: string[];
  };
  programme: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: LandingItem[];
  };
  pourquoi: {
    heading: string;
    /** Citation découpée autour du segment mis en avant. */
    quoteBefore: string;
    quoteEmphasis: string;
    quoteAfter: string;
    benefits: LandingItem[];
  };
  form: {
    program: SponsorProgram;
    heading: string;
    /** Les deux lignes d'introduction sous le titre. */
    subtitle: string;
    /**
     * Liste dédiée des éléments sponsorisables, indépendante des cartes du
     * programme affichées. Les libellés sont stockés tels quels en base
     * (sponsor_moocs.mooc_name). Liste vide = formulaire contact seul,
     * sans sélecteur.
     */
    sponsorItems: readonly string[];
  };
  contacts: LandingContact[];
  legal: string;
};

/**
 * Gabarit partagé des pages sponsoring (/sponsoring/mooc et /sponsoring/fnpi) :
 * même design, contenu injecté via props. Les motifs visuels reprennent ceux
 * du site (hero /sponsoring, sections des pages formations, bandeau CTA).
 */
export function SponsoringLanding({
  hero,
  contexte,
  programme,
  pourquoi,
  form,
}: SponsoringLandingProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-10 lg:py-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/3" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-sm">
                <HeartHandshake className="h-4 w-4 shrink-0 text-white" />
                <span className="text-sm font-medium tracking-wide text-white/90">
                  {hero.eyebrow}
                </span>
              </div>
              <h1 className="mb-4 font-sans text-3xl font-bold leading-tight tracking-tight text-balance text-white sm:text-4xl xl:text-5xl">
                {hero.titleLead}{" "}
                <span className="text-wl-highlight">{hero.titleEmphasis}</span>
              </h1>
              <p className="mx-auto mb-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg lg:mx-0">
                {hero.subtitle}
              </p>
              <div className="mb-7 flex flex-wrap justify-center gap-2 lg:justify-start">
                {hero.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-wl-highlight" />
                    {chip}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#sponsor-form"
                  className="inline-flex items-center rounded-lg bg-wl-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-wl-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Devenir partenaire
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
                <a
                  href="#programme"
                  className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Découvrir le programme
                </a>
              </div>
            </div>

            {/* Lockup co-brandé Welearn × partenaire */}
            <div className="order-first mx-auto w-fit lg:order-none">
              <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-xl lg:flex-col lg:gap-5 lg:px-12 lg:py-9">
                {/* welearn-logo.png : canevas carré aux larges marges
                    transparentes — cadrage sur la bande du wordmark. */}
                <div className="relative aspect-[2.9/1] w-32 overflow-hidden lg:w-52">
                  <Image
                    src="/images/welearn-logo.png"
                    alt="Welearn"
                    fill
                    sizes="(min-width: 1024px) 208px, 128px"
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden
                  className="flex items-center gap-3 text-base font-light leading-none text-wl-text-tertiary lg:w-full lg:text-lg"
                >
                  <span className="hidden h-px flex-1 bg-wl-border lg:block" />
                  ×
                  <span className="hidden h-px flex-1 bg-wl-border lg:block" />
                </span>
                <Image
                  src={hero.partnerLogo}
                  alt={hero.partnerName}
                  width={180}
                  height={180}
                  className="h-16 w-auto object-contain lg:h-32"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contexte & Définition */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-wl-orange">
            Contexte &amp; Définition
          </p>
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-wl-text">
            {contexte.heading}
          </h2>

          <div className="grid items-start gap-10 md:grid-cols-2">
            <div className="space-y-4">
              {contexte.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-wl-text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-8">
              <h3 className="mb-4 font-semibold text-wl-text">
                {contexte.cardTitle}
              </h3>
              <ul className="space-y-3">
                {contexte.cardPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-base leading-relaxed text-wl-text-secondary"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wl-blue" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programme */}
      <section id="programme" className="scroll-mt-24 bg-wl-gray-light py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-wl-orange">
            {programme.eyebrow}
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-wl-text">
            {programme.heading}
          </h2>
          <p className="mb-10 max-w-3xl text-base leading-relaxed text-wl-text-secondary">
            {programme.intro}
          </p>

          <div className="space-y-4">
            {programme.items.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-wl-border bg-white p-7 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-wl-blue-tint">
                    <item.icon className="h-5 w-5 text-wl-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wl-text">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-wl-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-wl-orange">
            Pourquoi devenir partenaire
          </p>
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-wl-text">
            {pourquoi.heading}
          </h2>

          <div className="mb-10 rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-8">
            <p className="text-base leading-relaxed text-wl-text-secondary">
              {pourquoi.quoteBefore}{" "}
              <span className="font-semibold text-wl-text">
                {pourquoi.quoteEmphasis}
              </span>{" "}
              {pourquoi.quoteAfter}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {pourquoi.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-wl-border bg-white p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-wl-blue-tint">
                  <benefit.icon className="h-5 w-5 text-wl-blue" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-wl-text">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-wl-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section
        id="sponsor-form"
        className="scroll-mt-24 bg-wl-gray-light py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-wl-text">
              {form.heading}
            </h2>
          </div>
          <SponsorshipForm program={form.program} items={form.sponsorItems} />
        </div>
      </section>
    </>
  );
}
