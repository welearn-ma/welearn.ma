import type { Metadata } from "next";
import { Clock, CalendarDays, MapPin, Briefcase, Users, GraduationCap } from "lucide-react";
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
  title: "Mastère Spécialisé BIM Maroc — EHTP & Welearn",
  description:
    "Le seul Mastère Spécialisé BIM accrédité CGE et labellisé buildingSMART au Maroc. Co-construit par l'EHTP et Welearn.",
  keywords:
    "mastère spécialisé BIM Maroc, formation BIM Manager Casablanca, mastère BIM EHTP, BIM construction Maroc",
};

const data: FormationPageData = {
  slug: "mastere-bim",
  title: "Mastère Spécialisé® BIM & ses Applications",
  subtitle:
    "Devenez BIM Manager. Maîtrisez la gestion des données d'un projet de construction, de la conception à l'exploitation, avec le programme de référence au Maroc.",
  partnerLine: "Partenaire académique : École Hassania des Travaux Publics (EHTP)",
  badges: [
    "Mastère Spécialisé®",
    "Accrédité CGE",
    "Labellisé buildingSMART International",
  ],
  infoBanner: [
    { icon: Clock, value: "18 mois", label: "Durée" },
    { icon: Briefcase, value: "Temps partiel aménagé", label: "Format" },
    { icon: CalendarDays, value: "Octobre 2026", label: "Rentrée" },
    { icon: MapPin, value: "EHTP Casablanca", label: "Lieu" },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
  ctaPrimary: "Déposer ma candidature",
  ctaSecondary: "Télécharger la brochure",
  profiles: [
    "Architectes",
    "Ingénieurs (structures, fluides, électriques, géomètres-topographes)",
    "Directeurs de projets",
    "Facility Managers",
    "Bureaux d'études",
    "Bureaux de contrôle",
    "Entreprises de travaux",
    "Maîtres d'ouvrage",
    "Promoteurs immobiliers",
    "AMO",
    "OPC",
  ],
  prerequisites: [
    "Niveau ingénieur ou architecte",
    "Professionnels spécialisés de niveau Bac+4 avec minimum 3 ans d'expérience",
    "Dérogation possible pour parcours professionnel particulier",
  ],
  pourquoi:
    "Le BIM transforme profondément la manière dont les projets de construction sont conçus, coordonnés et livrés. Les professionnels capables de piloter cette transformation sont rares — et très recherchés. Ce Mastère Spécialisé, co-construit par l'EHTP et Welearn, est le seul programme au Maroc à combiner l'accréditation de la Conférence des Grandes Écoles et la labellisation BIM Manager de buildingSMART Maroc. Il offre une flexibilité unique : les participants peuvent étudier par modules selon leurs intérêts, avec une personnalisation adaptée à leurs objectifs professionnels.",
  objectives: [
    "Comprendre le rôle de chaque acteur dans le secteur de la construction et le périmètre d'action en environnement BIM au sein d'un projet.",
    "Maîtriser les enjeux, les usages et la valeur ajoutée du BIM — de la conception à l'exploitation, en passant par les infrastructures et la gestion de patrimoine.",
    "Identifier le processus de passage d'une organisation séquentielle à une conduite de projet sous BIM, y compris les aspects juridiques et réglementaires.",
    "Utiliser les outils de modélisation et collaborer via les visionneuses IFC et les plateformes collaboratives.",
    "Piloter la conduite du changement liée à l'adoption du BIM dans une organisation.",
  ],
  modules: [
    { number: 1, title: "BIM et contexte de la Construction 4.0", description: "Panorama de la transition numérique dans le secteur de la construction. Enjeux, tendances et opportunités du BIM dans un contexte de digitalisation accélérée." },
    { number: 2, title: "BIM et responsabilités des intervenants & Aspects légaux", description: "Cadre juridique et contractuel du BIM. Responsabilités de chaque intervenant, aspects réglementaires et implications sur les marchés de travaux." },
    { number: 3, title: "Interopérabilité des projets sur BIM", description: "Standards openBIM, formats IFC, échanges de données entre logiciels et intervenants. Mise en place d'un environnement de travail interopérable." },
    { number: 4, title: "BIM pour un projet de construction", description: "Application concrète du BIM aux différentes phases d'un projet : programmation, conception, exécution, réception." },
    { number: 5, title: "Captation, collecte & intégration des attributs (Scan to BIM)", description: "Technologies de captation 3D, traitement des nuages de points et intégration dans les maquettes numériques." },
    { number: 6, title: "Management des projets sous BIM (le BIM Collaboratif)", description: "Mise en place des processus BIM : conventions BIM, plateformes collaboratives, coordination entre les disciplines." },
    { number: 7, title: "BIM pour les infrastructures", description: "Application du BIM aux projets d'infrastructure : routes, ponts, réseaux." },
    { number: 8, title: "CIM et intelligence territoriale", description: "Du BIM au CIM : modélisation urbaine, Smart City, gestion intelligente des territoires." },
    { number: 9, title: "BIM pour la gestion d'un patrimoine immobilier", description: "BIM et exploitation-maintenance : gestion des actifs, Facility Management, jumeau numérique." },
    { number: 10, title: "Conduite du changement", description: "Stratégies de déploiement du BIM dans une organisation. Management du changement et mesure de la maturité BIM." },
  ],
  finalBlocks: [
    {
      badge: "Thèse",
      title: "Thèse professionnelle",
      description:
        "Projet appliqué encadré par des experts, permettant de traiter une problématique BIM concrète en lien avec votre contexte professionnel.",
      variant: "orange",
    },
  ],
  teaching: [
    {
      icon: Users,
      title: "Intervenants",
      items: [
        "Experts internationaux certifiés",
        "Professeurs de l'EHTP",
        "Experts solutions et logiciels",
        "Professionnels du BIM en activité",
      ],
    },
    {
      icon: GraduationCap,
      title: "Approche pédagogique",
      items: [
        "Cours théoriques & ateliers pratiques",
        "Études de cas réels",
        "Supports e-learning",
        "Thèse professionnelle encadrée",
      ],
    },
    {
      icon: MapPin,
      title: "Lieux",
      text: "Cours théoriques en salle à l'EHTP. Cours pratiques en salles équipées à l'EHTP et aux locaux Welearn.",
    },
  ],
  steps: [
    { number: 1, title: "Formulaire de pré-inscription", description: "Remplissez le formulaire de pré-inscription en ligne." },
    { number: 2, title: "Dossier de candidature", description: "Déposez votre dossier de candidature complet." },
    { number: 3, title: "Entretien de sélection", description: "Passez un entretien avec la commission de sélection." },
  ],
  session: "Octobre 2026",
  ctaInscription: "Déposer ma candidature",
  testimonials: [
    {
      quote: "Le Mastère BIM de Welearn et l'EHTP m'a permis de faire évoluer ma carrière vers le BIM Management. La qualité des intervenants et la double accréditation en font un programme unique au Maroc.",
      author: "Prénom Nom",
      role: "BIM Manager",
      company: "Bureau d'études A",
    },
    {
      quote: "Une formation complète qui couvre l'ensemble des dimensions du BIM. Le format modulaire m'a permis de concilier formation et vie professionnelle sans difficulté.",
      author: "Prénom Nom",
      role: "Directeur de Projets",
      company: "Entreprise B",
    },
  ],
  seo: {
    title: "Mastère Spécialisé BIM Maroc — EHTP & Welearn",
    description: "Le seul Mastère Spécialisé BIM accrédité CGE et labellisé buildingSMART au Maroc. Co-construit par l'EHTP et Welearn.",
    keywords: "mastère spécialisé BIM Maroc, formation BIM Manager Casablanca, mastère BIM EHTP, BIM construction Maroc",
  },
};

export default function MastereBIMPage() {
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
      <FormationProgram modules={data.modules} finalBlocks={data.finalBlocks} />
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
            formationSlug="mastere-bim"
            formationTitle="Mastère Spécialisé® BIM & ses Applications"
          />
        </div>
      </section>

      <StickyRegistrationCTA formationTitle="Mastère Spécialisé® BIM & ses Applications" />
    </>
  );
}
