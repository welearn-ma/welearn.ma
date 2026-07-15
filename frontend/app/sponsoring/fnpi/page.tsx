import type { Metadata } from "next";
import {
  Award,
  Briefcase,
  Calculator,
  CheckCircle,
  Eye,
  HardHat,
  Mail,
  Megaphone,
  Package,
  Phone,
  Scale,
  Target,
  Users,
} from "lucide-react";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";

export const metadata: Metadata = {
  title: "Formation FNPI × Welearn | Welearn",
  description:
    "La Fédération Nationale de la Promotion Immobilière et Welearn lancent un programme de formation présentielle destiné à l'ensemble des professionnels de la promotion immobilière au Maroc.",
};

const PROGRAM_DEFINITION_POINTS = [
  "Un programme structuré, dispensé en salle par des experts du secteur",
  "Des sessions intensives par département métier, couvrant les compétences clés",
  "Une audience qualitative : Top Management, direction technique, juridique, financière, commerciale",
  "Des ressources pédagogiques multiples : cas pratiques, ateliers, mises en situation, évaluations",
];

const DEPARTMENTS = [
  {
    icon: Briefcase,
    title: "Top Management",
    description:
      "Le marché immobilier · Pilotage économique et financier · Réglementations et assurances · Leadership et efficacité personnelle",
  },
  {
    icon: HardHat,
    title: "Département Technique",
    description:
      "Gros œuvre et enveloppe (fondations, structure béton armé, étanchéité, isolation thermique, façades) · Logistique et approvisionnement",
  },
  {
    icon: Calculator,
    title: "Département Finance & Achat",
    description:
      "Comptabilité et gestion financière (comptabilité et fiscalité immobilière) · Achat et valorisation (passation et gestion des marchés, approvisionnements)",
  },
  {
    icon: Scale,
    title: "Département Juridique & Administratif",
    description:
      "Copropriété et syndic · Contentieux et conformité (gestion des contentieux, prévention des risques juridiques, relations avec les administrations)",
  },
  {
    icon: Megaphone,
    title: "Marketing, Commercial & SAV",
    description:
      "Vente et négociation : parcours client, argumentaire de vente, gestion de réservations, techniques de négociation, matériaux & finitions",
  },
];

const FORM_ITEMS = DEPARTMENTS.map((department) => department.title);

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
      "Vos catalogues produits intégrés comme ressources pédagogiques officielles ; vous présentez vos solutions constructives directement auprès des participants.",
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
    name: "Mohamed Taha Mazoz",
    role: "Responsable commercial, Welearn",
    phone: "+212 7 03 17 50 52",
    email: "taha.mazoz@welearn.ma",
  },
  {
    name: "Omar Oukrid",
    role: "Directeur Général Délégué, FNPI",
    email: "omar.oukrid@fnpi.ma",
  },
] as Array<{ name: string; role: string; phone?: string; email: string }>;

export default function SponsoringFnpiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-16 lg:py-24">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/3" />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-sm">
            <Users className="h-4 w-4 text-white" />
            <span className="text-sm font-medium tracking-wide text-white/90">
              Formation FNPI × Welearn
            </span>
          </div>
          <h1 className="mb-5 font-sans text-4xl font-bold leading-tight tracking-tight text-balance text-white md:text-5xl">
            Formation FNPI — Devenez partenaire de la montée en compétences de
            la filière immobilière
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/75">
            La Fédération Nationale de la Promotion Immobilière et Welearn
            lancent un programme de formation présentielle destiné à
            l'ensemble des professionnels de la promotion immobilière au
            Maroc.
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
                La FNPI, acteur clé de la construction au Maroc, croit
                fortement dans la compétence
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-wl-text-secondary">
                <p>
                  La Fédération Nationale de la Promotion Immobilière (FNPI)
                  regroupe les promoteurs immobiliers du Maroc, acteurs majeurs
                  du développement urbain. La qualité des constructions
                  livrées dépend directement de la compétence des équipes sur
                  le terrain : former les professionnels du secteur, c'est
                  garantir des ouvrages conformes, durables et sécurisés.
                </p>
                <p>
                  Dans ce contexte, la FNPI lance son programme de Formation
                  présentielle FNPI : un dispositif structuré, dispensé en
                  salle et encadré par des experts du secteur, visant à
                  standardiser et accélérer la montée en compétences de ses
                  adhérents, de leurs équipes et de l'ensemble de
                  l'écosystème.
                </p>
                <p>
                  Ce programme couvre l'ensemble des métiers de la promotion
                  immobilière, du top management aux départements techniques,
                  financiers, juridiques et commerciaux, avec des sessions
                  intensives par département métier et des ressources
                  pédagogiques multiples (cas pratiques, ateliers, mises en
                  situation, évaluations).
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-wl-border bg-wl-blue-tint p-8 lg:p-10">
              <h3 className="mb-6 text-xl font-semibold text-wl-text">
                Ce que c'est concrètement
              </h3>
              <ul className="space-y-4">
                {PROGRAM_DEFINITION_POINTS.map((point) => (
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

      {/* Programme prévisionnel */}
      <section className="bg-wl-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange">
              Programme prévisionnel
            </span>
            <h2 className="mb-4 font-sans text-3xl font-bold text-balance text-wl-text md:text-4xl">
              Le contenu de la formation FNPI, structuré par départements
              métiers
            </h2>
            <p className="text-lg leading-relaxed text-wl-text-secondary">
              Chaque module a été développé en étroite collaboration avec des
              experts du terrain, pour proposer des formations
              opérationnelles, concrètes et adaptées aux besoins réels des
              professionnels de la promotion immobilière.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((department) => (
              <div
                key={department.title}
                className="rounded-2xl border border-wl-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wl-blue-tint">
                  <department.icon className="h-6 w-6 text-wl-blue" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-wl-text">
                  {department.title}
                </h3>
                <p className="text-sm leading-relaxed text-wl-text-secondary">
                  {department.description}
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
              Gagnez en visibilité auprès de la FNPI, présentez vos produits
              et valorisez votre marque auprès de toute la filière immobilière
            </h2>
            <p className="text-lg leading-relaxed text-wl-text-secondary">
              Les malfaçons et non-conformités figurent parmi les principales
              causes de litiges et de dégradation prématurée des bâtiments. En
              soutenant la formation FNPI, vous contribuez à la montée en
              compétence de toute la filière construction et participez à
              l'amélioration de la qualité des ouvrages livrés.
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
              montée en compétences de toute la filière immobilière
            </p>
            <p className="text-wl-text-secondary">
              Laissez-nous vos coordonnées : notre équipe revient vers vous
              avec le dossier de partenariat correspondant.
            </p>
          </div>
          <SponsorshipForm program="fnpi" items={FORM_ITEMS} />
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
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 text-wl-text-secondary transition-colors hover:text-wl-blue"
                    >
                      <Phone className="h-4 w-4 text-wl-blue" />
                      {contact.phone}
                    </a>
                  )}
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
            Welearn est mandaté par la FNPI pour la recherche, la négociation
            et la commercialisation des partenariats et sponsorings de ses
            cycles de formation. FNPI — Fédération Nationale des Promoteurs
            Immobiliers · en partenariat avec Welearn · Espace 300,
            Technopark, Casablanca
          </p>
        </div>
      </section>
    </>
  );
}
