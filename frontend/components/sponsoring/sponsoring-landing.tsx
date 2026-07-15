import Image from "next/image";
import { ArrowRight, CheckCircle, Star, type LucideIcon } from "lucide-react";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";
import type { SponsorProgram } from "@/types/sponsor";
import { Eyebrow } from "@/components/sponsoring/eyebrow";
import { HeroArt } from "@/components/sponsoring/hero-art";
import { Reveal } from "@/components/sponsoring/reveal";
import { SponsoringFab } from "@/components/sponsoring/sponsoring-fab";

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
    /** Début du H1, avant la ligne mise en avant. */
    titleLead: string;
    /** Fin du H1, affichée en wl-tint sur sa propre ligne. */
    titleEmphasis: string;
    subtitle: string;
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
    /** Citation découpée autour du segment mis en avant en wl-tint. */
    quoteBefore: string;
    quoteEmphasis: string;
    quoteAfter: string;
    benefits: LandingItem[];
  };
  form: {
    program: SponsorProgram;
    heading: string;
    /** Les deux lignes d'introduction sous le titre. */
    subtitles: [string, string];
  };
  contacts: LandingContact[];
  legal: string;
};

// Accents des cartes "avantages", appliqués en cycle par index :
// wl-blue / wl-navy / wl-orange / wl-blue.
const BENEFIT_ACCENTS = [
  {
    bar: "bg-wl-blue",
    chip: "bg-wl-chip-blue text-wl-blue group-hover:bg-wl-blue group-hover:text-white",
  },
  {
    bar: "bg-wl-navy",
    chip: "bg-wl-chip-blue text-wl-navy group-hover:bg-wl-navy group-hover:text-white",
  },
  {
    bar: "bg-wl-orange",
    chip: "bg-wl-chip-orange text-wl-orange group-hover:bg-wl-orange group-hover:text-white",
  },
  {
    bar: "bg-wl-blue",
    chip: "bg-wl-chip-blue text-wl-blue group-hover:bg-wl-blue group-hover:text-white",
  },
];

const DARK_BAND_GRADIENT =
  "bg-[linear-gradient(135deg,#0F3A66_0%,#134A86_60%,#1B5FAA_100%)]";

const HATCH_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 18px, rgba(255,255,255,0.03) 18px, rgba(255,255,255,0.03) 19px)",
};

const H2_CLASS =
  "max-w-[680px] text-2xl font-extrabold leading-[1.28] tracking-[-0.2px] text-wl-navy md:text-[29px]";

const BODY_CLASS = "max-w-[680px] text-[15px] leading-[1.85] text-wl-text-secondary";

/**
 * Gabarit visuel partagé des pages sponsoring (/sponsoring/mooc et
 * /sponsoring/fnpi) : même design, contenu injecté via props.
 */
export function SponsoringLanding({
  hero,
  contexte,
  programme,
  pourquoi,
  form,
  contacts,
  legal,
}: SponsoringLandingProps) {
  return (
    <>
      {/* Hero */}
      <section
        id="sponsoring-hero"
        className="relative overflow-hidden bg-[linear-gradient(160deg,#0B2C4E_0%,#0F3A66_46%,#1B5FAA_100%)] pt-16 lg:pt-[90px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
          }}
        />
        <HeroArt />
        <div className="relative mx-auto max-w-[1140px] px-4 lg:px-8">
          <div className="relative z-10 max-w-[600px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-wl-orange/50 bg-wl-orange/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-wl-orange-tint">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-wl-orange"
              />
              {hero.eyebrow}
            </div>
            <h1 className="mb-5 font-sans text-[29px] font-extrabold leading-[1.16] tracking-[-0.3px] text-white md:text-[42px]">
              {hero.titleLead}{" "}
              <span className="block text-wl-tint">{hero.titleEmphasis}</span>
            </h1>
            <p className="mb-9 max-w-[520px] text-base leading-[1.75] text-white/80">
              {hero.subtitle}
            </p>
            <div className="relative z-10 flex flex-wrap gap-3.5 pb-16 lg:pb-[74px]">
              <a
                href="#sponsor-form"
                className="group inline-flex items-center gap-2 rounded-[5px] bg-wl-orange px-[30px] py-[15px] text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(232,114,28,0.4)] transition-all duration-200 hover:bg-wl-orange-dark hover:shadow-[0_14px_32px_rgba(232,114,28,0.5)] motion-safe:hover:-translate-y-0.5"
              >
                Devenir partenaire
                <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contexte & Définition */}
      <section className="bg-white py-[60px] md:py-[88px]">
        <div className="mx-auto max-w-[1140px] px-4 lg:px-8">
          <Reveal className="mb-11">
            <Eyebrow>Contexte & Définition</Eyebrow>
            <h2 className={H2_CLASS}>{contexte.heading}</h2>
          </Reveal>
          <Reveal>
            <div className="grid items-start gap-10 min-[860px]:grid-cols-[1.1fr_0.9fr] min-[860px]:gap-14">
              <div className="space-y-4">
                {contexte.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={BODY_CLASS}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="relative overflow-hidden rounded-xl border border-wl-border bg-wl-gray-light p-[30px]">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#1B5FAA,#0F3A66)]"
                />
                <h3 className="mb-4 flex items-center gap-2.5 text-sm font-bold text-wl-navy">
                  <Star className="h-[18px] w-[18px] shrink-0" />
                  {contexte.cardTitle}
                </h3>
                <ul>
                  {contexte.cardPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 border-b border-wl-border/60 py-2.5 text-[13.5px] leading-[1.6] text-wl-text-secondary last:border-b-0"
                    >
                      <CheckCircle className="mt-0.5 h-[15px] w-[15px] shrink-0 text-wl-blue" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Programme */}
      <section className="bg-wl-gray-light py-[60px] md:py-[88px]">
        <div className="mx-auto max-w-[1140px] px-4 lg:px-8">
          <Reveal className="mb-11">
            <Eyebrow>{programme.eyebrow}</Eyebrow>
            <h2 className={`mb-4 ${H2_CLASS}`}>{programme.heading}</h2>
            <p className={BODY_CLASS}>{programme.intro}</p>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-wl-border bg-white">
              {programme.items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-5 border-b border-wl-border/60 px-5 py-5 transition-colors last:border-b-0 hover:bg-wl-gray-light/60 sm:px-7 sm:py-6"
                >
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-wl-chip-blue text-wl-blue-dark">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[14.5px] font-extrabold text-wl-navy">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-[1.6] text-wl-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="bg-white py-[60px] md:py-[88px]">
        <div className="mx-auto max-w-[1140px] px-4 lg:px-8">
          <Reveal className="mb-11">
            <Eyebrow>Pourquoi devenir partenaire</Eyebrow>
            <h2 className={H2_CLASS}>{pourquoi.heading}</h2>
          </Reveal>

          <Reveal className="mb-10">
            <div
              className={`relative overflow-hidden rounded-[14px] px-6 py-7 md:px-9 md:py-8 ${DARK_BAND_GRADIENT}`}
            >
              <div aria-hidden className="absolute inset-0" style={HATCH_STYLE} />
              <p className="relative max-w-[760px] text-[15px] font-semibold leading-[1.55] text-white md:text-[17px]">
                {pourquoi.quoteBefore}{" "}
                <em className="not-italic text-wl-tint">
                  {pourquoi.quoteEmphasis}
                </em>{" "}
                {pourquoi.quoteAfter}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 min-[900px]:grid-cols-2">
            {pourquoi.benefits.map((benefit, index) => {
              const accent = BENEFIT_ACCENTS[index % BENEFIT_ACCENTS.length];
              return (
                <Reveal
                  key={benefit.title}
                  delay={index * 70}
                  className="h-full"
                >
                  <div className="group relative h-full overflow-hidden rounded-[14px] border border-wl-border bg-white p-7 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_44px_rgba(15,58,102,0.12)] motion-safe:hover:-translate-y-1.5">
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${accent.bar}`}
                    />
                    <div className="mb-4 flex items-center gap-4">
                      <div
                        className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full transition-all duration-300 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:scale-[1.08] ${accent.chip}`}
                      >
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-wl-navy">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-[13px] leading-[1.75] text-wl-text-secondary">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section
        id="sponsor-form"
        className="scroll-mt-24 bg-wl-gray-light py-[60px] md:py-[88px]"
      >
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-extrabold leading-[1.28] tracking-[-0.2px] text-wl-navy md:text-[29px]">
              {form.heading}
            </h2>
            <p className="mb-2 text-[15px] leading-[1.85] text-wl-text-secondary">
              {form.subtitles[0]}
            </p>
            <p className="text-[15px] leading-[1.85] text-wl-text-secondary">
              {form.subtitles[1]}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <SponsorshipForm
              program={form.program}
              items={programme.items.map((item) => item.title)}
            />
          </Reveal>
        </div>
      </section>

      {/* Contacts */}
      <section
        className={`relative overflow-hidden py-14 md:py-[76px] ${DARK_BAND_GRADIENT}`}
      >
        <div aria-hidden className="absolute inset-0" style={HATCH_STYLE} />
        <div className="relative mx-auto max-w-[1140px] px-4 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {contacts.map((contact) => (
                <div key={contact.name} className="min-w-[220px]">
                  <p className="text-[13px] font-bold text-white">
                    {contact.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-[1.6] text-white/60">
                    {contact.role}
                  </p>
                  <p className="mt-0.5 text-xs leading-[1.6] text-white/60">
                    {contact.phone && (
                      <>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="text-wl-tint transition-opacity hover:opacity-75"
                        >
                          {contact.phone}
                        </a>{" "}
                        ·{" "}
                      </>
                    )}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-wl-tint transition-opacity hover:opacity-75"
                    >
                      {contact.email}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mention légale */}
      <section className="bg-wl-navy-deep py-8">
        <div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex items-center rounded-md bg-white px-3 py-1.5">
            <Image
              src="/images/welearn-logo.png"
              alt="Welearn"
              width={80}
              height={80}
              className="h-6 w-auto"
            />
          </div>
          <p className="max-w-[560px] text-[11px] leading-[1.65] text-white/40">
            {legal}
          </p>
        </div>
      </section>

      <SponsoringFab heroId="sponsoring-hero" targetId="sponsor-form" />
    </>
  );
}
