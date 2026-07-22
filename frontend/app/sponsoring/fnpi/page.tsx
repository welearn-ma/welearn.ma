import type { Metadata } from "next";
import {
  Award,
  Briefcase,
  Calculator,
  Eye,
  HardHat,
  Megaphone,
  Package,
  Scale,
  Target,
} from "lucide-react";
import {
  SponsoringLanding,
  type SponsoringLandingProps,
} from "@/components/sponsoring/sponsoring-landing";

export const metadata: Metadata = {
  title: "Formation FNPI × Welearn | Welearn",
  description:
    "La Fédération Nationale de la Promotion Immobilière et Welearn lancent un programme de formation présentielle destiné à l'ensemble des professionnels de la promotion immobilière au Maroc.",
};

const CONTENT: SponsoringLandingProps = {
  hero: {
    eyebrow: "Formation FNPI × Welearn",
    titleLead: "Plan de formation FNPI - Welearn",
    titleEmphasis:
      "Devenez partenaire de la montée en compétences de la filière immobilière",
    subtitle:
      "Dans le cadre du Plan de Formation FNPI 2026/2027, nous lançons un plan de formation présentielle destiné à l'ensemble des professionnels de la promotion immobilière au Maroc.",
    partnerName: "FNPI",
    partnerLogo: "/partners/fnpi-mark.webp",
    partnerLogoWidth: 1280,
    partnerLogoHeight: 844,
    chips: [
      "Formation présentielle",
      "Encadrée par des experts du secteur",
      "Sessions intensives par département métier",
    ],
  },
  contexte: {
    heading:
      "La FNPI, acteur clé de la construction au Maroc, croit fortement dans la compétence",
    paragraphs: [
      "La Fédération Nationale de la Promotion Immobilière (FNPI) regroupe les promoteurs immobiliers du Maroc, acteurs majeurs du développement urbain. La qualité des constructions livrées dépend directement de la compétence des équipes sur le terrain : former les professionnels du secteur, c'est garantir des ouvrages conformes, durables et sécurisés.",
      "Dans ce contexte, la FNPI lance son programme de Formation présentielle FNPI : un dispositif structuré, dispensé en salle et encadré par des experts du secteur, visant à standardiser et accélérer la montée en compétences de ses adhérents, de leurs équipes et de l'ensemble de l'écosystème.",
      "Ce programme couvre l'ensemble des métiers de la promotion immobilière, du top management aux départements techniques, financiers, juridiques et commerciaux, avec des sessions intensives par département métier et des ressources pédagogiques multiples (cas pratiques, ateliers, mises en situation, évaluations).",
    ],
    cardTitle: "Ce que c'est concrètement",
    cardPoints: [
      "Un programme structuré, dispensé en salle par des experts du secteur",
      "Des sessions intensives par département métier, couvrant les compétences clés",
      "Une audience qualitative : Top Management, direction technique, juridique, financière, commerciale",
      "Des ressources pédagogiques multiples : cas pratiques, ateliers, mises en situation, évaluations",
    ],
  },
  programme: {
    eyebrow: "Programme prévisionnel",
    heading:
      "Le contenu de la formation FNPI, structuré par départements métiers",
    intro:
      "Chaque module a été développé en étroite collaboration avec des experts du terrain, pour proposer des formations opérationnelles, concrètes et adaptées aux besoins réels des professionnels de la promotion immobilière.",
    items: [
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
    ],
  },
  pourquoi: {
    heading:
      "Gagnez en visibilité auprès de la FNPI, présentez vos produits et valorisez votre marque auprès de toute la filière immobilière",
    quoteBefore: "Les malfaçons et non-conformités figurent parmi les",
    quoteEmphasis: "principales causes de litiges",
    quoteAfter:
      "et de dégradation prématurée des bâtiments. En soutenant la formation FNPI, vous contribuez à la montée en compétence de toute la filière construction et participez à l'amélioration de la qualité des ouvrages livrés.",
    benefits: [
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
    ],
  },
  form: {
    program: "fnpi",
    heading: "Rejoignez nos partenaires",
    subtitle:
      "Laissez-nous vos coordonnées : notre équipe revient vers vous avec le dossier de partenariat correspondant.",
    // FNPI : formulaire contact seul — aucun sélecteur de formation.
    sponsorItems: [],
  },
  contacts: [
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
  ],
  legal:
    "Welearn est mandaté par la FNPI pour la recherche, la négociation et la commercialisation des partenariats et sponsorings de ses cycles de formation. FNPI — Fédération Nationale des Promoteurs Immobiliers · en partenariat avec Welearn · Espace 300, Technopark, Casablanca",
};

export default function SponsoringFnpiPage() {
  return <SponsoringLanding {...CONTENT} />;
}
