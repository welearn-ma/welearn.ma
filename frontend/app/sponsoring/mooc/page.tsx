import type { Metadata } from "next";
import {
  Award,
  Building2,
  CheckCircle,
  Droplets,
  Eye,
  Flame,
  GraduationCap,
  Layers,
  Mail,
  Package,
  Phone,
  Target,
} from "lucide-react";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";

export const metadata: Metadata = {
  title: "Programme Digital Learning — ANEP × Welearn | Welearn",
  description:
    "L'Agence Nationale des Équipements Publics et Welearn lancent une série de MOOCs gratuits destinés aux professionnels de la construction : entreprises, industriels, bureaux d'études, banques et assurances.",
};

const MOOC_DEFINITION_POINTS = [
  "Un parcours de formation en ligne, gratuit et accessible à tout moment",
  "Des vidéos courtes et ludiques, organisées par blocs thématiques",
  "Des ressources pédagogiques multiples : quiz d'évaluation, forums de discussion",
];

const MOOCS = [
  {
    icon: Droplets,
    title: "MOOC Étanchéité",
    description:
      "Comment assurer une bonne exécution de l'étanchéité et limiter les reprises de chantier : étanchéité et isolation des toitures terrasses et toitures inclinées · étanchéité des façades · étanchéité des sous-sols, salles d'eau & gradins",
  },
  {
    icon: Layers,
    title: "MOOC Plancher Béton",
    description:
      "Comment garantir un bon choix de plancher et assurer sa bonne mise en œuvre sur les chantiers : les fondamentaux pour comprendre les planchers · les planchers coulés en place · les planchers préfabriqués et mixtes · choisir et concevoir son plancher",
  },
  {
    icon: Building2,
    title: "MOOC Fondamentaux BIM",
    description:
      "Comprendre le BIM (Building Information Modeling) et accompagner la transformation numérique du secteur : écosystème de la construction, genèse et déploiement du BIM dans le monde · normes et terminologie, cadre normatif, maturité et développement du BIM",
  },
  {
    icon: Flame,
    title: "MOOC Sécurité Incendie",
    description:
      "Comment assurer la conformité aux normes de sécurité incendie et protéger les collaborateurs : introduction à la sécurité incendie dans le bâtiment · classification des bâtiments et ERP / Code du travail · dispositions générales et particulières ERP · IGH · Code du travail",
  },
];

const FORM_ITEMS = MOOCS.map((mooc) => mooc.title);

const BENEFITS = [
  {
    icon: Eye,
    title: "Visibilité maximale",
    description:
      "Une légitimité technique et institutionnelle unique, au sein d'un des plus importants écosystèmes de la construction au Maroc, avec une visibilité continue auprès d'une audience qualifiée.",
  },
  {
    icon: Award,
    title: "Image de marque premium",
    description:
      "Vous contribuez à la montée en compétences de vos clients et prescripteurs : votre marque est associée à leur réussite professionnelle, un investissement à forte valeur ajoutée.",
  },
  {
    icon: Target,
    title: "Audience ultra-ciblée",
    description:
      "Un accès direct aux prescripteurs et clients clés, des retours immédiats sur les besoins en solutions, et un accès privilégié à une communauté de professionnels à fort potentiel.",
  },
  {
    icon: Package,
    title: "Exposition de vos produits",
    description:
      "Vos catalogues produits intégrés comme ressources pédagogiques supplémentaires ; vous présentez vos solutions constructives directement auprès des participants.",
  },
];

const CONTACTS = [
  {
    name: "Hassan Jaï",
    role: "CEO, Welearn",
    phone: "+212 661 299 245",
    email: "hassan.jai@welearn.ma",
  },
  {
    name: "Oumaima Dakir",
    role: "Directrice technique, Welearn",
    phone: "+212 6 61 53 66 69",
    email: "oumaima.dakir@welearn.ma",
  },
  {
    name: "Mohamed Taha Mazoz",
    role: "Responsable commercial, Welearn",
    phone: "+212 7 03 17 50 52",
    email: "taha.mazoz@welearn.ma",
  },
];

export default function SponsoringMoocPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-16 lg:py-24">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/3" />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 text-white" />
            <span className="text-sm font-medium tracking-wide text-white/90">
              Programme Digital Learning — ANEP × Welearn
            </span>
          </div>
          <h1 className="mb-5 font-sans text-4xl font-bold leading-tight tracking-tight text-balance text-white md:text-5xl">
            Devenez partenaire des MOOCs qui forment toute la filière
            construction
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/75">
            L'Agence Nationale des Équipements Publics et Welearn lancent une
            série de MOOCs gratuits destinés aux professionnels de la
            construction : entreprises, industriels, bureaux d'études, banques
            et assurances.
          </p>
        </div>
      </section>

      {/* Contexte & Définition */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange">
                Contexte & Définition
              </span>
              <h2 className="mb-6 font-sans text-3xl font-bold text-balance text-wl-text md:text-4xl">
                L'ANEP, acteur clé du BTP au Maroc, investit dans la compétence
                de toute la filière
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-wl-text-secondary">
                <p>
                  L'Agence Nationale des Équipements Publics (ANEP), maître
                  d'ouvrage délégué de l'investissement public et locomotive du
                  secteur du BTP au Maroc, reconnaît l'importance cruciale de
                  la compétence dans le succès de ses missions et du
                  développement du pays.
                </p>
                <p>
                  Dans ce contexte, l'ANEP a lancé son Programme Digital
                  Learning : une série de MOOCs (Massive Open Online Course)
                  sur mesure, visant à standardiser et à accélérer la montée en
                  compétences des professionnels du secteur et de l'ensemble de
                  son écosystème.
                </p>
                <p>
                  Ce programme est porté en partenariat avec Welearn,
                  entreprise marocaine pionnière de l'Edtech, qui accompagne
                  l'ANEP dans la conception, le pilotage et la réalisation de
                  chaque MOOC, développé en étroite collaboration avec les
                  équipes de l'ANEP afin de proposer des contenus
                  opérationnels, modernes et ancrés dans les réalités du
                  terrain.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-wl-border bg-wl-blue-tint p-8 lg:p-10">
              <h3 className="mb-6 text-xl font-semibold text-wl-text">
                Ce qu'est un MOOC, concrètement
              </h3>
              <ul className="space-y-4">
                {MOOC_DEFINITION_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wl-blue" />
                    <span className="text-wl-text">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Le Programme Digital Learning */}
      <section className="bg-wl-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange">
              Le Programme Digital Learning
            </span>
            <h2 className="mb-4 font-sans text-3xl font-bold text-balance text-wl-text md:text-4xl">
              Une série de MOOCs conçus pour toute la filière construction
            </h2>
            <p className="text-lg leading-relaxed text-wl-text-secondary">
              Chaque MOOC a été développé en étroite collaboration avec des
              experts du terrain, pour proposer des contenus opérationnels,
              concrets et adaptés aux besoins réels des professionnels du
              secteur.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {MOOCS.map((mooc) => (
              <div
                key={mooc.title}
                className="rounded-2xl border border-wl-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wl-blue-tint">
                  <mooc.icon className="h-6 w-6 text-wl-blue" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-wl-text">
                  {mooc.title}
                </h3>
                <p className="text-sm leading-relaxed text-wl-text-secondary">
                  {mooc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange">
              Pourquoi devenir partenaire
            </span>
            <h2 className="mb-4 font-sans text-3xl font-bold text-balance text-wl-text md:text-4xl">
              Gagnez en visibilité auprès de l'ANEP, présentez vos produits et
              valorisez votre marque auprès de toute la filière construction
            </h2>
            <p className="text-lg leading-relaxed text-wl-text-secondary">
              Les malfaçons, les non-conformités et le manque de formation
              figurent parmi les principales causes de sinistres et de litiges
              dans la construction. En soutenant le Programme Digital Learning,
              vous contribuez à la montée en compétence de toute la filière et
              à l'amélioration de la qualité des ouvrages.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-wl-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wl-orange-tint">
                  <benefit.icon className="h-6 w-6 text-wl-orange" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-wl-text">
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
        className="scroll-mt-24 bg-wl-gray-light py-16 lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold text-balance text-wl-text md:text-4xl">
              Rejoignez nos partenaires
            </h2>
            <p className="mb-2 text-lg leading-relaxed text-wl-text-secondary">
              Gagnez en visibilité, valorisez votre marque et accompagnez la
              montée en compétences de toute la filière construction
            </p>
            <p className="text-wl-text-secondary">
              Laissez-nous vos coordonnées : notre équipe revient vers vous
              avec le dossier de partenariat correspondant.
            </p>
          </div>
          <SponsorshipForm program="mooc" items={FORM_ITEMS} />
        </div>
      </section>

      {/* Contacts */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {CONTACTS.map((contact) => (
              <div
                key={contact.name}
                className="rounded-2xl border border-wl-border bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-lg font-semibold text-wl-text">
                  {contact.name}
                </h3>
                <p className="mb-4 text-sm text-wl-text-secondary">
                  {contact.role}
                </p>
                <div className="space-y-2 text-sm">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 text-wl-text-secondary transition-colors hover:text-wl-blue"
                  >
                    <Phone className="h-4 w-4 text-wl-blue" />
                    {contact.phone}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 text-wl-text-secondary transition-colors hover:text-wl-blue"
                  >
                    <Mail className="h-4 w-4 text-wl-blue" />
                    {contact.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mention légale */}
      <section className="border-t border-wl-border bg-wl-gray-light py-8">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <p className="text-sm leading-relaxed text-wl-text-tertiary">
            Programme Digital Learning conçu et piloté par l'ANEP en
            partenariat avec Welearn. ANEP — Agence Nationale des Équipements
            Publics · en partenariat avec Welearn · Espace 300, Technopark,
            Casablanca
          </p>
        </div>
      </section>
    </>
  );
}
