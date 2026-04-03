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
  title: "Executive Master en Ingénierie Immobilière | Welearn",
  description:
    "Formation immobilier Maroc, executive master immobilier, formation ingénierie immobilière Casablanca, formation investissement immobilier, master immobilier EHTP",
};

const data: FormationPageData = {
  slug: "master-immobilier",
  title: "Executive Master en Ingénierie Immobilière",
  subtitle:
    "Maîtrisez l'ensemble de la chaîne de valeur immobilière — de l'investissement à l'exploitation — avec le programme exécutif de référence pour les professionnels du secteur.",
  partnerLine: "Partenaire académique : École Hassania des Travaux Publics (EHTP)",
  badges: ["Executive Master", "EHTP", "Formation exécutive"],
  infoBanner: [
    { icon: Clock, value: "18 mois", label: "Durée" },
    { icon: Briefcase, value: "Temps partiel aménagé", label: "Format" },
    { icon: CalendarDays, value: "Novembre 2026", label: "Rentrée" },
    { icon: MapPin, value: "EHTP Casablanca", label: "Lieu" },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80",
  ctaPrimary: "Déposer ma candidature",
  ctaSecondary: "Télécharger la brochure",
  profiles: [
    "Ingénieurs",
    "Architectes",
    "Financiers",
    "Assureurs",
    "Juristes",
    "Cadres et gestionnaires opérant dans le secteur immobilier",
    "Promoteurs",
    "Asset Managers",
    "Responsables patrimoine",
    "Cadres des administrations publiques liées à l'urbanisme et l'habitat",
  ],
  prerequisites: [
    "Minimum Bac+4 avec expérience professionnelle",
    "Sélection sur dossier et entretien approfondi",
  ],
  pourquoi:
    "Le secteur immobilier marocain traverse une phase de structuration et de professionnalisation accélérée. Nouvelles réglementations, montages financiers complexes, exigences de durabilité, digitalisation des processus — les professionnels de l'immobilier doivent élargir leurs compétences bien au-delà de leur spécialité d'origine. Cet Executive Master couvre l'intégralité de la chaîne de valeur immobilière avec une approche résolument pratique : études de cas réels, projets terrain et intervention de professionnels expérimentés.",
  objectives: [
    "Maîtriser les règles et pratiques de l'urbanisme, de l'aménagement du territoire et du droit foncier et immobilier.",
    "Piloter les mécanismes d'investissement immobilier, les différents modes de financement et le processus complet de montage et de réalisation d'une opération immobilière.",
    "Évaluer un bien ou un portefeuille immobilier et reconnaître les spécificités de la mission d'évaluation et de gestion immobilière.",
    "Gérer les aspects juridiques, contractuels, fiscaux et comptables des opérations immobilières.",
    "Appréhender les technologies de construction, les dysfonctionnements pouvant affecter les constructions et les fondamentaux de l'économie de construction.",
    "Commercialiser efficacement un projet immobilier en maîtrisant les techniques de vente et de marketing.",
    "Comprendre les enjeux de la ConTech et de la PropTech et leurs cas d'usages dans l'immobilier de demain.",
  ],
  modules: [
    { number: 1, title: "Urbanisme et aménagement des territoires", description: "Cadre réglementaire de l'urbanisme au Maroc, documents d'urbanisme, planification territoriale et enjeux d'aménagement." },
    { number: 2, title: "Droit foncier et immobilier", description: "Régime foncier marocain, immatriculation foncière, copropriété, baux, contentieux immobilier et évolutions réglementaires." },
    { number: 3, title: "Investissement et gestion des actifs immobiliers", description: "Analyse d'opportunités, stratégies d'investissement, gestion de portefeuille, indicateurs de performance." },
    { number: 4, title: "Financement des projets immobiliers", description: "Montages financiers, financement bancaire, structures alternatives, partenariats public-privé et gestion des risques." },
    { number: 5, title: "Le marché de l'immobilier", description: "Analyse des marchés résidentiel, tertiaire et commercial. Tendances, cycles et facteurs de prix." },
    { number: 6, title: "Évaluation et expertise immobilière", description: "Méthodes d'évaluation (par comparaison, par le revenu, par le coût), expertise judiciaire et normes professionnelles." },
    { number: 7, title: "Management et innovation dans un projet immobilier", description: "Pilotage de projets, lean construction et intégration des nouvelles technologies." },
    { number: 8, title: "Marketing et commercialisation", description: "Stratégies de commercialisation, marketing digital immobilier, relation client et techniques de vente." },
    { number: 9, title: "Comptabilité et fiscalité immobilière", description: "Régime fiscal, TVA immobilière, droits d'enregistrement, comptabilité des promoteurs." },
    { number: 10, title: "Exploitation et maintenance", description: "Gestion technique des bâtiments, Facility Management, performance énergétique et cycle de vie." },
  ],
  finalBlocks: [
    {
      badge: "Extra",
      title: "Conférences & événements",
      description:
        "Interventions de professionnels de haut niveau, visites de terrain et networking sectoriel.",
      variant: "blue",
    },
    {
      badge: "Thèse",
      title: "Thèse professionnelle",
      description:
        "Projet de recherche appliquée encadré, en lien avec une problématique immobilière concrète.",
      variant: "orange",
    },
  ],
  teaching: [
    {
      icon: Users,
      title: "Intervenants",
      items: [
        "Experts certifiés",
        "Professionnels du secteur immobilier en activité",
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
      text: "Cours en présentiel à l'EHTP et aux locaux Welearn.",
    },
  ],
  steps: [
    { number: 1, title: "Formulaire de pré-inscription", description: "Remplissez le formulaire de pré-inscription en ligne." },
    { number: 2, title: "Dossier de candidature", description: "Déposez votre dossier de candidature complet." },
    { number: 3, title: "Entretien approfondi", description: "Passez un entretien approfondi avec la commission de sélection." },
  ],
  session: "Novembre 2026",
  ctaInscription: "Déposer ma candidature",
  testimonials: [
    {
      quote: "L'Executive Master en Ingénierie Immobilière m'a donné une vision complète du secteur. Les intervenants sont des professionnels reconnus qui partagent leur expérience terrain.",
      author: "Prénom Nom",
      role: "Promoteur Immobilier",
      company: "Groupe A",
    },
    {
      quote: "Cette formation m'a permis de monter en compétences sur les aspects juridiques et financiers de l'immobilier. Un programme indispensable pour tout professionnel du secteur.",
      author: "Prénom Nom",
      role: "Asset Manager",
      company: "Entreprise B",
    },
  ],
};

export default function MasterImmobilierPage() {
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
            formationSlug="master-immobilier"
            formationTitle="Executive Master en Ingénierie Immobilière"
          />
        </div>
      </section>

      <StickyRegistrationCTA formationTitle="Executive Master en Ingénierie Immobilière" />
    </>
  );
}
