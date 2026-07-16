import type { Metadata } from "next";
import {
  Award,
  Building2,
  Droplets,
  Eye,
  Flame,
  Layers,
  Package,
  Target,
} from "lucide-react";
import {
  SponsoringLanding,
  type SponsoringLandingProps,
} from "@/components/sponsoring/sponsoring-landing";
import { FORMATION_SLUGS } from "@/lib/sponsoring/formations";

export const metadata: Metadata = {
  title: "Programme Digital Learning — ANEP × Welearn | Welearn",
  description:
    "L'Agence Nationale des Équipements Publics et Welearn lancent une série de MOOCs gratuits destinés aux professionnels de la construction : entreprises, industriels, bureaux d'études, banques et assurances.",
};

const CONTENT: SponsoringLandingProps = {
  hero: {
    eyebrow: "Programme Digital Learning — ANEP × Welearn",
    titleLead: "Devenez partenaire des",
    titleEmphasis: "MOOCs qui forment toute la filière construction",
    subtitle:
      "L'Agence Nationale des Équipements Publics et Welearn lancent une série de MOOCs gratuits destinés aux professionnels de la construction : entreprises, industriels, bureaux d'études, banques et assurances.",
    partnerName: "ANEP",
    partnerLogo: "/partners/anep.webp",
    chips: [
      "MOOCs gratuits",
      "En ligne, accessible à tout moment",
      "Vidéos courtes et ludiques",
    ],
  },
  contexte: {
    heading:
      "L'ANEP, acteur clé du BTP au Maroc, investit dans la compétence de toute la filière",
    paragraphs: [
      "L'Agence Nationale des Équipements Publics (ANEP), maître d'ouvrage délégué de l'investissement public et locomotive du secteur du BTP au Maroc, reconnaît l'importance cruciale de la compétence dans le succès de ses missions et du développement du pays.",
      "Dans ce contexte, l'ANEP a lancé son Programme Digital Learning : une série de MOOCs (Massive Open Online Course) sur mesure, visant à standardiser et à accélérer la montée en compétences des professionnels du secteur et de l'ensemble de son écosystème.",
      "Ce programme est porté en partenariat avec Welearn, entreprise marocaine pionnière de l'Edtech, qui accompagne l'ANEP dans la conception, le pilotage et la réalisation de chaque MOOC, développé en étroite collaboration avec les équipes de l'ANEP afin de proposer des contenus opérationnels, modernes et ancrés dans les réalités du terrain.",
    ],
    cardTitle: "Ce qu'est un MOOC, concrètement",
    cardPoints: [
      "Un parcours de formation en ligne, gratuit et accessible à tout moment",
      "Des vidéos courtes et ludiques, organisées par blocs thématiques",
      "Des ressources pédagogiques multiples : quiz d'évaluation, forums de discussion",
    ],
  },
  programme: {
    eyebrow: "Le Programme Digital Learning",
    heading: "Une série de MOOCs conçus pour toute la filière construction",
    intro:
      "Chaque MOOC a été développé en étroite collaboration avec des experts du terrain, pour proposer des contenus opérationnels, concrets et adaptés aux besoins réels des professionnels du secteur.",
    items: [
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
    ],
  },
  pourquoi: {
    heading:
      "Gagnez en visibilité auprès de l'ANEP, présentez vos produits et valorisez votre marque auprès de toute la filière construction",
    quoteBefore:
      "Les malfaçons, les non-conformités et le manque de formation figurent parmi les",
    quoteEmphasis: "principales causes de sinistres et de litiges",
    quoteAfter:
      "dans la construction. En soutenant le Programme Digital Learning, vous contribuez à la montée en compétence de toute la filière et à l'amélioration de la qualité des ouvrages.",
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
          "Vos catalogues produits intégrés comme ressources pédagogiques supplémentaires ; vous présentez vos solutions constructives directement auprès des participants.",
      },
    ],
  },
  form: {
    program: "mooc",
    heading: "Rejoignez nos partenaires",
    subtitle:
      "Laissez-nous vos coordonnées : notre équipe revient vers vous avec le dossier de partenariat correspondant.",
    // Liste sponsorisable dédiée (≠ cartes du programme) : l'Étanchéité est
    // découpée en 3 sous-formations. Slugs canoniques du référentiel
    // (lib/sponsoring/formations.ts) — les libellés affichés en dérivent.
    sponsorItems: FORMATION_SLUGS,
  },
  contacts: [
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
  ],
  legal:
    "Programme Digital Learning conçu et piloté par l'ANEP en partenariat avec Welearn. ANEP — Agence Nationale des Équipements Publics · en partenariat avec Welearn · Espace 300, Technopark, Casablanca",
};

export default function SponsoringMoocPage() {
  return <SponsoringLanding {...CONTENT} />;
}
