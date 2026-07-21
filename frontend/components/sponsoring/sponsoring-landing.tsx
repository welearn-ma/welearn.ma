import Image from "next/image";
import { CheckCircle, ChevronRight, type LucideIcon } from "lucide-react";
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
    /**
     * Chemin du logo partenaire — le fichier doit exister dans /public.
     * Utiliser un visuel recadré sur le pictogramme + sigle (sans le
     * sous-texte multilingue), sous peine d'un rendu illisible/pixelisé
     * une fois réduit à la hauteur du bandeau du hero.
     */
    partnerLogo: string;
    /** Dimensions intrinsèques du fichier ci-dessus, pour un ratio correct. */
    partnerLogoWidth: number;
    partnerLogoHeight: number;
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
     * Slugs canoniques des éléments sponsorisables (référentiel
     * lib/sponsoring/formations.ts), indépendants des cartes du programme
     * affichées. Le formulaire soumet le slug (sponsor_formations.
     * formation_slug) et affiche le libellé dérivé du référentiel. Liste
     * vide = formulaire contact seul, sans sélecteur.
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
      {/* min-h = viewport moins la navbar sticky (72px, en flux) : le hero
          remplit exactement la première vue, la section suivante commence
          au pli — ni bande blanche, ni débordement. */}
      <section className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-10 lg:py-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/3" />
        <div className="relative mx-auto w-full max-w-6xl px-4 text-center lg:px-8">
          {/* Lockup co-brandé Welearn × partenaire, horizontal au-dessus du
              contenu. Il remplace le badge texte : les logos disent déjà le
              partenariat. */}
          <div className="mx-auto mb-7 w-fit">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-lg sm:gap-4 lg:px-5 lg:py-3">
              {/* welearn-logo.png : canevas carré aux larges marges
                  transparentes — cadrage sur la bande du wordmark. */}
              <div className="relative aspect-[2.9/1] w-24 overflow-hidden sm:w-28 lg:w-32">
                <Image
                  src="/images/welearn-logo.png"
                  alt="Welearn"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <span
                aria-hidden
                className="text-sm font-light leading-none text-wl-text-tertiary"
              >
                ×
              </span>
              <Image
                src={hero.partnerLogo}
                alt={hero.partnerName}
                width={hero.partnerLogoWidth}
                height={hero.partnerLogoHeight}
                className="h-9 w-auto object-contain sm:h-10 lg:h-12"
              />
            </div>
          </div>

          <h1 className="mb-4 font-sans text-3xl font-bold leading-tight tracking-tight text-balance text-white sm:text-4xl xl:text-5xl">
            {hero.titleLead}{" "}
            <span className="text-wl-highlight">{hero.titleEmphasis}</span>
          </h1>
          <p className="mx-auto mb-5 max-w-4xl text-base leading-relaxed text-white/75 md:text-lg">
            {hero.subtitle}
          </p>
          <div className="mb-7 flex flex-wrap justify-center gap-2">
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
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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

          <div className="grid items-stretch gap-10 md:grid-cols-2">
            <div className="space-y-4">
              {contexte.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-justify text-base leading-relaxed text-wl-text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-8">
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
          <p className="mb-10 text-base leading-relaxed text-wl-text-secondary">
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
