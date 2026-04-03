import type { Metadata } from "next";
import { Clock, BookOpen, Monitor, MapPin } from "lucide-react";
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
import type { FormationPageData } from "@/types/formation-page";

export const metadata: Metadata = {
  title: "Certification BIM Foundations – Professional | Welearn",
  description:
    "Certification BIM Maroc, BIM Foundations buildingSMART, formation BIM en ligne, certification BIM international, formation BIM e-learning",
};

const data: FormationPageData = {
  slug: "bim-foundations-professional",
  title: "Certification BIM Foundations – Professional",
  subtitle:
    "Obtenez la certification internationale de référence en BIM, délivrée par buildingSMART International. Formation accessible en e-learning ou en présentiel, en seulement 1 mois.",
  partnerLine:
    "Organisme certificateur : buildingSMART International · Organisme accrédité : WeLearn",
  badges: ["Certification internationale", "buildingSMART", "E-learning + Présentiel"],
  infoBanner: [
    { icon: Clock, value: "1 mois", label: "Durée" },
    { icon: BookOpen, value: "21 heures", label: "Volume" },
    { icon: Monitor, value: "E-learning + coaching", label: "Format" },
    { icon: MapPin, value: "En ligne ou présentiel", label: "Lieu" },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
  ctaPrimary: "S'inscrire à la prochaine session",
  ctaSecondary: "Demander plus d'informations",
  profiles: [
    "Architectes",
    "Ingénieurs (structures, fluides, électriques, géomètres-topographes)",
    "Chefs de projets",
    "Coordinateurs",
    "Conducteurs de travaux",
    "Métreurs-vérificateurs",
    "Responsables qualité",
    "Bureaux d'études",
    "Bureaux de contrôle",
    "Entreprises de travaux",
    "Maîtres d'ouvrage",
    "Promoteurs immobiliers",
    "AMO",
    "OPC",
  ],
  prerequisites: [
    "Aucun prérequis technique spécifique",
    "Formation accessible à tous les profils du secteur",
  ],
  pourquoi:
    "Le BIM devient progressivement un standard incontournable dans les marchés de construction, tant au Maroc qu'à l'international. La certification BIM Foundations de buildingSMART International est la référence mondiale pour attester d'un socle de compétences solide et reconnu. En obtenant cette certification, vous démontrez à vos employeurs, clients et partenaires que vous maîtrisez les fondamentaux du BIM — validés par l'organisme international qui définit les standards openBIM. Welearn est l'organisme de formation accrédité par buildingSMART Morocco pour délivrer cette préparation certifiante.",
  objectives: [
    "Maîtriser les fondamentaux du BIM, son cadre normatif et ses principaux cas d'usages à travers le cycle de vie d'un projet.",
    "Comprendre le contexte de développement du BIM, de la transition numérique et de l'écosystème openBIM (standards IFC, BCF, bSDD...).",
    "Connaître les modalités pratiques, économiques et juridiques liées à la mise en œuvre du BIM dans un projet.",
    "Pratiquer le BIM en implémentant un projet de construction sous environnement BIM.",
    "Mettre en place les processus BIM et construire les documents associés (convention BIM, cahier des charges BIM...).",
  ],
  modules: [
    {
      number: 1,
      title: "Transformation Numérique, Origines et Portée Mondiale",
      description:
        "Comprendre les origines de la transformation numérique dans le secteur de la construction, son impact à l'échelle mondiale et les facteurs qui accélèrent l'adoption du BIM.",
    },
    {
      number: 2,
      title: "Normes et terminologies du BIM",
      description:
        "Standards internationaux (ISO 19650), niveaux de maturité, dimensions (3D à 7D), LOD et terminologie essentielle pour communiquer en environnement BIM.",
    },
    {
      number: 3,
      title: "Mise en place d'un projet sous BIM",
      description:
        "Processus BIM, rôles et responsabilités, convention BIM, cahier des charges BIM, plan d'exécution BIM et coordination entre disciplines.",
    },
    {
      number: 4,
      title: "OpenBIM® : Principes, Formats et gouvernance",
      description:
        "Standards IFC, BCF, bSDD, interopérabilité entre logiciels, plateformes collaboratives et enjeux de gouvernance des données.",
    },
    {
      number: 5,
      title: "Adoption du BIM dans une organisation",
      description:
        "Stratégies de déploiement, conduite du changement, évaluation de la maturité BIM et plan de transition.",
    },
  ],
  finalBlocks: [
    {
      badge: "Examen",
      title: "Examen de certification",
      description:
        "Examen en fin de formation. La réussite donne accès au certificat BIM Foundations – Professional délivré par buildingSMART International.",
      variant: "orange",
    },
  ],
  certification: {
    title: "Certification délivrée",
    text: "La réussite de l'examen donne accès au certificat BIM Foundations – Professional délivré par buildingSMART International — la référence mondiale en matière de standards BIM. Ce certificat atteste de votre niveau de compétence, confirmé par un tiers de confiance reconnu à l'échelle internationale. Il est valable partout dans le monde.",
  },
  teaching: [
    {
      icon: Monitor,
      title: "Mode",
      text: "Cours en e-learning sur welearn.ac, avec ateliers de coaching optionnels en visioconférence ou en présentiel.",
    },
    {
      icon: BookOpen,
      title: "Approche pédagogique",
      items: [
        "Cours interactifs",
        "Quizs",
        "Ressources",
        "Simulation d'examen",
        "Coaching personnalisé",
      ],
    },
    {
      icon: Clock,
      title: "Durée",
      text: "21 heures réparties sur 1 mois, à votre rythme.",
    },
  ],
  steps: [
    {
      number: 1,
      title: "Inscription en ligne",
      description:
        "Formulaire en ligne ou par contact direct. Aucune sélection sur dossier.",
    },
    {
      number: 2,
      title: "Accès à la formation",
      description:
        "Accès immédiat à la plateforme e-learning et aux ressources pédagogiques.",
    },
    {
      number: 3,
      title: "Passage de l'examen",
      description: "Examen de certification à l'issue de la formation.",
    },
  ],
  session: "Disponible toute l'année",
  ctaInscription: "S'inscrire maintenant",
  testimonials: [
    {
      quote:
        "La certification BIM Foundations m'a permis de valider mes compétences et de gagner en crédibilité auprès de mes clients. Le format e-learning est très flexible.",
      author: "Prénom Nom",
      role: "Architecte",
      company: "Bureau d'études A",
    },
    {
      quote:
        "Formation très complète et bien structurée. Le coaching personnalisé m'a aidé à bien me préparer pour l'examen. Je recommande vivement.",
      author: "Prénom Nom",
      role: "Ingénieur Structure",
      company: "Entreprise B",
    },
  ],
};

export default function BIMFoundationsPage() {
  return (
    <>
      <FormationDetailHero
        badges={data.badges}
        title={data.title}
        subtitle={data.subtitle}
        partnerLine={data.partnerLine}
        infoBanner={data.infoBanner}
        heroImage={data.heroImage}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
      <FormationAudience profiles={data.profiles} prerequisites={data.prerequisites} />
      <FormationWhy text={data.pourquoi} />
      <FormationObjectives objectives={data.objectives} />
      <FormationProgram
        modules={data.modules}
        finalBlocks={data.finalBlocks}
        certification={data.certification}
      />
      <FormationTeaching cards={data.teaching} />
      <FormationInscription
        steps={data.steps}
        session={data.session}
        ctaLabel={data.ctaInscription}
      />
      <FormationTestimonials testimonials={data.testimonials} />

      {/* ── REGISTRATION FORM (do not modify) ── */}
      <section id="registration-form" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-5 text-2xl font-bold text-wl-text">
            Demander une inscription
          </h2>
          <RegistrationForm
            formationSlug="bim-foundations-professional"
            formationTitle="Certification BIM Foundations – Professional"
          />
        </div>
      </section>

      <StickyRegistrationCTA formationTitle="Certification BIM Foundations – Professional" />
    </>
  );
}
