import {
  Clock,
  BookOpen,
  Monitor,
  MapPin,
  CalendarDays,
  Briefcase,
  Users,
  GraduationCap,
  Award,
  Plane,
} from "lucide-react";
import type { FormationPageData } from "@/types/formation-page";

export const formations: Record<string, FormationPageData> = {
  /* ──────────────────────────────────────────────────────────
   * MASTÈRE SPÉCIALISÉ BIM & SES APPLICATIONS
   * ────────────────────────────────────────────────────────── */
  "mastere-bim": {
    slug: "mastere-bim",
    title: "Mastère Spécialisé® BIM & ses Applications",
    subtitle:
      "Le Mastère Spécialisé® BIM & ses applications permet de maîtriser la gestion, à tout moment et en tout lieu, des données d'un projet et d'un chantier dans le secteur de la construction. Il permet aussi une parfaite gestion de l'ouvrage incluant tous ses paramètres.",
    partnerLine:
      "Partenaire académique : École Hassania des Travaux Publics (EHTP)",
    badges: [
      "Mastère Spécialisé®",
      "Accrédité CGE",
      "Labellisé buildingSMART International",
    ],
    infoBanner: [
      { icon: Clock, value: "18 mois", label: "Durée" },
      { icon: Briefcase, value: "Temps partiel aménagé", label: "Format" },
      { icon: CalendarDays, value: "Novembre 2026", label: "Rentrée" },
      { icon: MapPin, value: "EHTP Casablanca", label: "Lieu" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Télécharger la brochure",
    profiles: [
      "Architectes",
      "Ingénieurs Géomètres-Topographes",
      "Ingénieurs Structures",
      "Ingénieurs Électriques & Fluides",
      "Directeurs de projets",
      "Facility Managers",
      "Bureaux d'Études",
      "Bureaux de Contrôle",
      "Entreprises de Travaux",
      "Maîtres d'Ouvrage",
      "Promoteurs Immobiliers",
      "AMO - OPC",
    ],
    prerequisites: [
      "Niveau ingénieur ou architecte.",
      "Professionnels spécialisés de niveau Bac+4 avec +3 ans d'expérience.",
      "Dérogation spéciale pour parcours professionnel particulier.",
    ],
    pourquoi:
      "Le BIM transforme profondément la manière dont les projets de construction sont conçus, coordonnés et livrés. Les professionnels capables de piloter cette transformation sont rares — et très recherchés. Ce Mastère Spécialisé, co-construit par l'EHTP et Welearn, est le seul programme au Maroc à combiner l'accréditation de la Conférence des Grandes Écoles et la labellisation BIM Manager de buildingSMART Maroc. Il offre une flexibilité unique : les participants peuvent étudier par modules selon leurs intérêts, avec une personnalisation adaptée à leurs objectifs professionnels.",
    objectives: [
      "Comprendre le rôle de chaque acteur dans le secteur de la construction.",
      "Comprendre le périmètre d'action en environnement BIM au sein d'un projet.",
      "Identifier le processus de passage d'une organisation séquentielle à celle d'une conduite de projet sous BIM.",
      "Comprendre et appréhender les enjeux, les usages et la valeur ajoutée du BIM.",
      "Utiliser et manipuler les outils de modélisation de type Revit, Tekla, Cype…",
      "Collaborer grâce aux visionneuses IFC et aux plateformes collaboratives.",
    ],
    modules: [
      {
        number: 1,
        title: "BIM et contexte de la Construction 4.0",
        description:
          "Panorama de la transition numérique dans le secteur de la construction. Enjeux, tendances et opportunités du BIM dans un contexte de digitalisation accélérée.",
      },
      {
        number: 2,
        title: "BIM et responsabilités des intervenants & Aspects légaux",
        description:
          "Cadre juridique et contractuel du BIM. Responsabilités de chaque intervenant, aspects réglementaires et implications sur les marchés de travaux.",
      },
      {
        number: 3,
        title: "Interopérabilité des projets sur BIM",
        description:
          "Standards openBIM, formats IFC, échanges de données entre logiciels et intervenants. Mise en place d'un environnement de travail interopérable.",
      },
      {
        number: 4,
        title: "BIM pour un projet de construction",
        description:
          "Application concrète du BIM aux différentes phases d'un projet : programmation, conception, exécution, réception.",
      },
      {
        number: 5,
        title: "De la Réalité à la Maquette : L'ingénierie du Scan-to-BIM",
        description:
          "Technologies de captation 3D, traitement des nuages de points et intégration dans les maquettes numériques.",
      },
      {
        number: 6,
        title: "Management des projets sous BIM",
        description:
          "Mise en place des processus BIM : conventions BIM, plateformes collaboratives, coordination entre les disciplines.",
      },
      {
        number: 7,
        title: "BIM pour les infrastructures",
        description:
          "Application du BIM aux projets d'infrastructure : routes, ponts, réseaux.",
      },
      {
        number: 8,
        title: "CIM et intelligence territoriale",
        description:
          "Du BIM au CIM : modélisation urbaine, Smart City, gestion intelligente des territoires.",
      },
      {
        number: 9,
        title: "BIM pour la Gestion, Exploitation et Maintenance (GEM)",
        description:
          "BIM et exploitation-maintenance : gestion des actifs, Facility Management, jumeau numérique.",
      },
      {
        number: 10,
        title: "Computational Design, IA en BIM et conduite du changement",
        // TODO(contenu): description à fournir — module renommé/élargi (BIM8).
        description: "",
      },
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
          "Professionnels du BIM",
        ],
      },
      {
        icon: GraduationCap,
        title: "Principe de la formation",
        items: [
          "Programme en temps partiel aménagé",
          "11 sessions de trois jours chacune",
          "Cours théoriques & ateliers pratiques",
          "Études de cas et supports e-learning",
          "Thèse professionnelle encadrée",
        ],
      },
      {
        icon: MapPin,
        title: "Lieux",
        items: [
          "Cours théoriques en salle de formation aménagée à l'EHTP.",
          "Cours pratiques en salles équipées en solutions BIM à l'EHTP et aux locaux Welearn.",
        ],
      },
    ],
    steps: [
      {
        number: 1,
        title: "Formulaire de pré-inscription",
        description: "Remplissez le formulaire de pré-inscription en ligne.",
      },
      {
        number: 2,
        title: "Dossier de candidature",
        description: "Déposez votre dossier de candidature complet.",
      },
      {
        number: 3,
        title: "Entretien de sélection",
        description: "Passez un entretien avec la commission de sélection.",
      },
    ],
    session: "Novembre 2026",
    ctaInscription: "Déposer ma candidature",
    testimonials: [
      {
        quote:
          "Le Mastère BIM de Welearn et l'EHTP m'a permis de faire évoluer ma carrière vers le BIM Management. La qualité des intervenants et la double accréditation en font un programme unique au Maroc.",
        author: "Prénom Nom",
        role: "BIM Manager",
        company: "Bureau d'études A",
      },
      {
        quote:
          "Une formation complète qui couvre l'ensemble des dimensions du BIM. Le format modulaire m'a permis de concilier formation et vie professionnelle sans difficulté.",
        author: "Prénom Nom",
        role: "Directeur de Projets",
        company: "Entreprise B",
      },
    ],
    seo: {
      title: "Mastère Spécialisé BIM Maroc — EHTP & Welearn",
      description:
        "Le seul Mastère Spécialisé BIM accrédité CGE et labellisé buildingSMART au Maroc. Co-construit par l'EHTP et Welearn.",
      keywords:
        "mastère spécialisé BIM Maroc, formation BIM Manager Casablanca, mastère BIM EHTP, BIM construction Maroc",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * EXECUTIVE MASTER EN INGÉNIERIE IMMOBILIÈRE
   * ────────────────────────────────────────────────────────── */
  "master-immobilier": {
    slug: "master-immobilier",
    title: "Executive Master en Ingénierie Immobilière",
    subtitle:
      "Maîtrisez l'ensemble de la chaîne de valeur immobilière — de l'investissement à l'exploitation — avec le programme exécutif de référence pour les professionnels du secteur.",
    partnerLine:
      "Partenaire académique : École Hassania des Travaux Publics (EHTP)",
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
      {
        number: 1,
        title: "Urbanisme et aménagement des territoires",
        description:
          "Cadre réglementaire de l'urbanisme au Maroc, documents d'urbanisme, planification territoriale et enjeux d'aménagement.",
      },
      {
        number: 2,
        title: "Droit foncier et immobilier",
        description:
          "Régime foncier marocain, immatriculation foncière, copropriété, baux, contentieux immobilier et évolutions réglementaires.",
      },
      {
        number: 3,
        title: "Investissement et gestion des actifs immobiliers",
        description:
          "Analyse d'opportunités, stratégies d'investissement, gestion de portefeuille, indicateurs de performance.",
      },
      {
        number: 4,
        title: "Financement des projets immobiliers",
        description:
          "Montages financiers, financement bancaire, structures alternatives, partenariats public-privé et gestion des risques.",
      },
      {
        number: 5,
        title: "Le marché de l'immobilier",
        description:
          "Analyse des marchés résidentiel, tertiaire et commercial. Tendances, cycles et facteurs de prix.",
      },
      {
        number: 6,
        title: "Évaluation et expertise immobilière",
        description:
          "Méthodes d'évaluation (par comparaison, par le revenu, par le coût), expertise judiciaire et normes professionnelles.",
      },
      {
        number: 7,
        title: "Management et innovation dans un projet immobilier",
        description:
          "Pilotage de projets, lean construction et intégration des nouvelles technologies.",
      },
      {
        number: 8,
        title: "Marketing et commercialisation",
        description:
          "Stratégies de commercialisation, marketing digital immobilier, relation client et techniques de vente.",
      },
      {
        number: 9,
        title: "Comptabilité et fiscalité immobilière",
        description:
          "Régime fiscal, TVA immobilière, droits d'enregistrement, comptabilité des promoteurs.",
      },
      {
        number: 10,
        title: "Exploitation et maintenance",
        description:
          "Gestion technique des bâtiments, Facility Management, performance énergétique et cycle de vie.",
      },
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
      {
        number: 1,
        title: "Formulaire de pré-inscription",
        description: "Remplissez le formulaire de pré-inscription en ligne.",
      },
      {
        number: 2,
        title: "Dossier de candidature",
        description: "Déposez votre dossier de candidature complet.",
      },
      {
        number: 3,
        title: "Entretien approfondi",
        description:
          "Passez un entretien approfondi avec la commission de sélection.",
      },
    ],
    session: "Novembre 2026",
    ctaInscription: "Déposer ma candidature",
    testimonials: [
      {
        quote:
          "L'Executive Master en Ingénierie Immobilière m'a donné une vision complète du secteur. Les intervenants sont des professionnels reconnus qui partagent leur expérience terrain.",
        author: "Prénom Nom",
        role: "Promoteur Immobilier",
        company: "Groupe A",
      },
      {
        quote:
          "Cette formation m'a permis de monter en compétences sur les aspects juridiques et financiers de l'immobilier. Un programme indispensable pour tout professionnel du secteur.",
        author: "Prénom Nom",
        role: "Asset Manager",
        company: "Entreprise B",
      },
    ],
    seo: {
      title: "Executive Master Ingénierie Immobilière — EHTP & Welearn",
      description:
        "Maîtrisez la chaîne de valeur immobilière avec l'Executive Master co-construit par l'EHTP et Welearn. Formation exécutive pour professionnels du secteur.",
      keywords:
        "formation immobilier Maroc, executive master immobilier, formation ingénierie immobilière Casablanca, master immobilier EHTP",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * EXECUTIVE MASTER DIRECTION & TRANSFORMATION DES PROJETS DE CONSTRUCTION
   * ────────────────────────────────────────────────────────── */
  "executive-master-direction-transformation-projets-construction": {
    slug: "executive-master-direction-transformation-projets-construction",
    title:
      "Executive Master Direction & Transformation des Projets de Construction",
    subtitle:
      "Piloter aujourd'hui, construire demain ! Stratégie · Performance · Durabilité · Digitalisation.",
    partnerLine: "Partenaire académique : École Centrale Casablanca (ECC)",
    badges: [
      "Executive Master",
      "École membre de la CGE",
      "Certification BIM Foundations incluse",
    ],
    infoBanner: [
      { icon: Clock, value: "18 mois", label: "Durée" },
      {
        icon: Briefcase,
        value: "Part-time, 1 week-end toutes les 3 semaines",
        label: "Rythme",
      },
      { icon: CalendarDays, value: "<<RENTREE_ECC>>", label: "Rentrée" },
      {
        icon: MapPin,
        value: "Campus École Centrale Casablanca",
        label: "Lieu",
      },
    ],
    // TODO(contenu): image temporaire réutilisée (masterclass-chantier-ia) — à remplacer.
    heroImage:
      "https://images.unsplash.com/photo-1581092921461-eab10380f308?w=1600&q=80",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Télécharger la brochure",
    profiles: [
      "Chefs de projet & chefs de programme",
      "Maîtrise d'œuvre & AMO",
      "Ingénieurs travaux & ingénieurs études",
      "Directeurs techniques",
    ],
    prerequisites: [
      "Être titulaire d'un Bac+5",
      "Expérience professionnelle requise",
    ],
    pourquoi:
      "L'École Centrale Casablanca et Welearn ont conçu cet Executive Master avec l'ambition de contribuer à l'émergence d'une nouvelle génération de directeurs de projets de construction, capables de porter les transformations du secteur au Maroc et à l'échelle internationale. L'objectif n'est pas simplement de former de meilleurs gestionnaires de projets, mais de faire émerger des dirigeants capables de penser, piloter et diriger les projets de construction de demain.\n\nAux enjeux traditionnels de coûts, de délais et de qualité s'ajoutent désormais des impératifs de transition environnementale, de digitalisation, d'innovation technologique et de création de valeur à long terme. Le programme fait évoluer la posture du participant : de spécialiste à décideur, de chef de projet à directeur, de gestionnaire à acteur de la transformation.",
    objectives: [
      "Prendre de la hauteur : passer d'une vision centrée sur l'exécution d'un projet à une approche intégrant les enjeux de stratégie, de programme et de portefeuille.",
      "Piloter la performance : maîtriser les leviers de performance et prendre des décisions fondées sur la valeur, les coûts, les délais et les risques des projets.",
      "Conduire la transformation digitale : évaluer et gouverner l'adoption des technologies (BIM, Contech, IA, Data) en intégrant les enjeux de gouvernance, d'éthique et de cybersécurité.",
      "Intégrer la durabilité dans la décision : performance énergétique et carbone, décarbonation, certifications environnementales, économie circulaire et financement durable.",
      "Incarner une posture de directeur : développer son leadership, mobiliser et faire évoluer les équipes, conduire le changement, négocier et décider dans des environnements complexes.",
    ],
    modules: [
      {
        number: 1,
        title: "Pilier 1 : L'Homme — Leadership & posture du dirigeant",
        description:
          "Vision & leadership · Management d'équipe · Négociation · Prise de parole en public · Conduite du changement",
      },
      {
        number: 2,
        title:
          "Pilier 2 : Le Process — Stratégie, management de projet, programme et portefeuille & excellence opérationnelle",
        description:
          "Stratégie, portefeuille, programmes & PMO · Fondamentaux du management de projet · Planification & maîtrise des délais en projet de construction · Estimation & maîtrise des coûts (Earned Value & Value Engineering) · Stratégie achats, approvisionnements & qualité projet · Management des risques en projet de construction · Lean Construction & excellence opérationnelle",
      },
      {
        number: 3,
        title: "Pilier 3 : L'Avenir — Digital, innovation & construction durable",
        description:
          "Les fondamentaux du BIM (certification) · Adoption du BIM dans une organisation · Contech & innovation (panorama) · IA pour la construction, data, éthique & cybersécurité · Construction durable : performance énergétique, carbone & trajectoire de décarbonation · Certifications environnementales (LEED / BREEAM / HQE) & normes ISO · Financement vert & achats durables",
      },
    ],
    finalBlocks: [
      {
        badge: "Projet",
        title: "Projet de fin d'études",
        description: "",
        variant: "orange",
      },
    ],
    teaching: [
      {
        icon: CalendarDays,
        title: "Format",
        items: [
          "32 jours de formation",
          "3 blocs de compétences",
          "19 modules & ateliers",
          "1 week-end toutes les 3 semaines",
        ],
      },
      {
        icon: GraduationCap,
        title: "Pédagogie par l'action",
        items: [
          "Études de cas — mises en situation de projets réels",
          "Ateliers appliqués — Lean Construction, Value Engineering & planification collaborative",
          "Projet de fin d'études",
        ],
      },
      {
        icon: Award,
        title: "Atouts",
        items: [
          "Certification internationale BIM Foundations",
          "Accès à l'écosystème et au réseau de l'École Centrale Casablanca",
          "Accès au PMI Membership",
        ],
      },
      {
        icon: Plane,
        title: "Learning Expedition China",
        items: [
          "Immersion de 5 jours entre Pékin, Shanghai et Suzhou",
          "Grands projets, smart building et infrastructures durables",
          "Rencontres avec des acteurs publics, privés et académiques",
        ],
      },
      {
        icon: MapPin,
        title: "Lieu",
        text: "Campus de l'École Centrale Casablanca",
      },
    ],
    steps: [
      {
        number: 1,
        title: "Inscription en ligne",
        description: "Dépôt électronique du dossier de candidature.",
      },
      {
        number: 2,
        title: "Étude du dossier",
        description:
          "Évaluation du parcours, de l'expérience et des prérequis.",
      },
      {
        number: 3,
        title: "Entretien de sélection",
        description:
          "Échange autour du projet professionnel et des motivations.",
      },
      {
        number: 4,
        title: "Confirmation",
        description: "Confirmation de l'admission et inscription définitive.",
      },
    ],
    session: "<<RENTREE_ECC>>",
    ctaInscription: "Déposer ma candidature",
    testimonials: [],
    seo: {
      title:
        "Executive Master Direction & Transformation des Projets de Construction — École Centrale Casablanca & Welearn",
      description:
        "Executive Master co-construit par l'École Centrale Casablanca et Welearn pour former les directeurs de projets de construction : stratégie, performance, durabilité et digitalisation.",
      keywords:
        "executive master construction Maroc, direction de projets de construction, executive master École Centrale Casablanca, management de projet BTP Casablanca",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * LICENCE EXECUTIVE BIM MODELER
   * ────────────────────────────────────────────────────────── */
  "licence-executive-bim-modeler": {
    slug: "licence-executive-bim-modeler",
    title: "Licence Executive BIM Modeler",
    subtitle:
      "Une licence executive pour devenir un professionnel de la modélisation BIM. Donnez une nouvelle dimension à votre carrière dans le BTP.",
    partnerLine:
      "Partenaire académique : Université Internationale de Casablanca (UIC)",
    badges: [
      "Licence Executive",
      "Diplôme Bac+3",
      "Université reconnue par l'État",
    ],
    infoBanner: [
      { icon: Clock, value: "12 mois", label: "Durée" },
      { icon: Briefcase, value: "Week-end", label: "Rythme" },
      { icon: CalendarDays, value: "Novembre 2026", label: "Rentrée" },
      { icon: MapPin, value: "Campus UIC", label: "Lieu" },
    ],
    // TODO(contenu): image temporaire réutilisée (bim-foundations) — à remplacer.
    heroImage:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Télécharger la brochure",
    profiles: [
      "Bâtiment & Génie Civil",
      "Architecture & Design",
      "Topographie & Géomatique",
      "Électricité & Électromécanique",
      "Génie Climatique & CVC",
      "Métiers industriels",
      "Architectes & Projeteurs",
      "Ingénieurs Génie Civil",
      "Techniciens Génie Civil",
      "Chefs de Projets Construction",
      "Bureaux d'études & Ingénierie",
      "Topographes & Géomètres",
      "Conducteurs de Travaux",
    ],
    prerequisites: [
      "Bac+2 ou Bac+3 à dominante technique, scientifique ou liée aux métiers de la construction",
      "Ou professionnel du BTP en activité souhaitant évoluer vers les métiers du BIM",
    ],
    pourquoi:
      "La Licence Executive BIM Modeler est conçue pour permettre aux participants d'acquérir une maîtrise opérationnelle de la modélisation numérique appliquée aux projets de construction. Le programme associe les fondamentaux du BIM, la modélisation, la gestion de l'information, la documentation technique, la collaboration entre disciplines et les principes de coordination des maquettes. À travers des cours pratiques, des exercices et des projets supervisés, les participants développent leur maîtrise des outils et méthodes BIM appliqués à l'architecture, la structure et les systèmes MEP. La formation intègre également les enjeux actuels de l'Open BIM, de l'interopérabilité, de la coordination numérique et de l'automatisation par l'IA.",
    objectives: [
      "Comprendre les fondamentaux du BIM et son rôle dans la transformation digitale du secteur de la construction.",
      "Maîtriser la modélisation BIM et structurer les informations d'une maquette numérique.",
      "Modéliser un projet architectural en 3D à partir de plans 2D, de projets et de données existants.",
      "Modéliser les éléments structurels et assurer leur articulation avec la maquette architecturale.",
      "Modéliser les systèmes MEP : CVC, plomberie et électricité.",
      "Fédérer et coordonner les différentes maquettes et identifier les conflits entre les lots.",
      "Travailler dans un environnement BIM collaboratif et utiliser les principes de l'Open BIM et de l'interopérabilité.",
      "Contrôler la qualité des maquettes et produire des livrables conformes aux exigences BIM.",
      "Exploiter l'automatisation pour optimiser les tâches de modélisation, de contrôle et d'exploitation des données.",
      "Développer une approche projet et opérationnelle grâce à la réalisation de travaux pratiques et d'un bâtiment.",
    ],
    modules: [
      {
        number: 1,
        title: "Les fondamentaux du BIM",
        description:
          "Situer le BIM dans la transformation digitale du secteur et le cycle de vie d'un ouvrage. Maîtriser le vocabulaire, les dimensions, les niveaux de maturité et de développement (LOD). Appréhender le cadre normatif du BIM. Comprendre les cas d'usage et les processus BIM. Appréhender les principes de l'open BIM. Appréhender les principes de l'adoption du BIM.",
      },
      {
        number: 2,
        title: "Initiation aux bases de données appliquées au BIM",
        description:
          "Comprendre la structuration d'une base de données et la nature d'une maquette numérique. Identifier et qualifier les objets BIM. Maîtriser les niveaux de détail, d'information et de documentation. Appliquer les conventions de nommage et les standards de classification.",
      },
      {
        number: 3,
        title: "L'environnement de la modélisation 3D",
        description:
          "Distinguer les méthodes d'acquisition et de reconstitution des données (levé, scan). Comparer les types et outils de modélisation (DAO, CAO, 3D). Interpréter et identifier les exigences des documents BIM (charte, cahier des charges, convention BIM, BEP).",
      },
      {
        number: 4,
        title: "Modélisation architecturale",
        description:
          "Modéliser le lot architectural (murs, dalles, toitures, ouvertures, espaces). Modélisation 3D d'un nouveau projet. Modélisation 3D d'un projet existant à partir de plans CAD. Modélisation 3D d'un projet existant à partir d'un scan 3D (nuage de points). Renseigner le niveau d'information requis. Contrôle qualité de la maquette. Produire les livrables architecturaux conformes aux exigences BIM.",
      },
      {
        number: 5,
        title: "Modélisation structure",
        description:
          "Modéliser le lot structure et l'articuler avec la maquette architecturale. Renseigner les attributs structurels et le niveau d'information requis. Contrôle qualité de la maquette. Produire les livrables structure (plans de coffrage, nomenclatures d'armatures/profilés, quantitatifs).",
      },
      {
        number: 6,
        title: "Modélisation MEP",
        description:
          "Modéliser les réseaux CVC, plomberie et électricité. Tracer et dimensionner les systèmes. Renseigner le niveau d'information requis. Contrôle qualité de la maquette. Gérer les réservations et les interfaces avec les lots ARC et STR. Produire les livrables MEP.",
      },
      {
        number: 7,
        title: "BIM collaboratif",
        description:
          "Mettre en œuvre les formats open BIM et les principes d'interopérabilité. Distinguer closed et open BIM. Fédérer les maquettes disciplinaires et détecter les conflits. Collaborer sur une maquette partagée dans un CDE.",
      },
      {
        number: 8,
        title: "Automatisation IA",
        description:
          "Identifier les cas d'usage de l'automatisation et de l'IA dans un processus BIM. Automatiser des tâches de modélisation et de contrôle. Extraire et exploiter automatiquement les données de la maquette. Réaliser un contrôle qualité automatisé. Déployer les plugins complémentaires.",
      },
    ],
    finalBlocks: [],
    teaching: [
      {
        icon: MapPin,
        title: "Format",
        text: "12 mois · Week-end · Campus UIC",
      },
    ],
    steps: [
      {
        number: 1,
        title: "Inscription en ligne",
        description: "Dépôt électronique du dossier.",
      },
      {
        number: 2,
        title: "Étude du dossier",
        description:
          "Évaluation du parcours, de l'expérience et des prérequis.",
      },
      {
        number: 3,
        title: "Entretien de sélection",
        description:
          "Échange autour du projet professionnel et des motivations.",
      },
      {
        number: 4,
        title: "Confirmation",
        description: "Confirmation de l'admission et inscription définitive.",
      },
    ],
    session: "Novembre 2026",
    ctaInscription: "Déposer ma candidature",
    testimonials: [],
    seo: {
      title: "Licence Executive BIM Modeler — UIC & Welearn",
      description:
        "Une licence executive Bac+3 pour devenir un professionnel de la modélisation BIM, en partenariat avec l'Université Internationale de Casablanca (UIC).",
      keywords:
        "licence BIM Maroc, licence executive BIM Modeler, formation modélisation BIM Casablanca, BIM Modeler UIC",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * CERTIFICATION BIM FOUNDATIONS – PROFESSIONAL
   * ────────────────────────────────────────────────────────── */
  "bim-foundations": {
    slug: "bim-foundations-professional",
    title: "Certification BIM Foundations – Professional",
    subtitle:
      "Obtenez la certification internationale de référence en BIM, délivrée par buildingSMART International. Formation accessible en e-learning ou en présentiel, en seulement 1 mois.",
    partnerLine:
      "Organisme certificateur : buildingSMART International · Organisme accrédité : WeLearn",
    badges: [
      "Certification internationale",
      "buildingSMART",
      "E-learning + Présentiel",
    ],
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
    seo: {
      title:
        "Certification BIM Foundations – Professional | buildingSMART | Welearn",
      description:
        "Obtenez la certification BIM internationale de référence délivrée par buildingSMART International. Préparation en e-learning ou présentiel avec Welearn, organisme accrédité.",
      keywords:
        "certification BIM Maroc, BIM Foundations buildingSMART, formation BIM en ligne, certification BIM international",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * MASTERCLASS LE CHANTIER IA
   * ────────────────────────────────────────────────────────── */
  "masterclass-chantier-ia": {
    slug: "masterclass-chantier-ia",
    title: "MasterClass Le Chantier IA",
    subtitle:
      "Une introduction concrète à l'utilisation de l'IA et du Prompt Engineering pour améliorer la gestion, la prise de décision et le suivi des projets de construction.",
    partnerLine:
      "Programme proposé par WeLearn / BIM Pioneers · Build x AI Lab",
    badges: ["MasterClass", "Non-diplomante", "Initiation"],
    infoBanner: [
      { icon: Clock, value: "1 jour", label: "Durée" },
      { icon: Briefcase, value: "Initiation", label: "Niveau" },
      { icon: CalendarDays, value: "Dates sur demande", label: "Session" },
      { icon: MapPin, value: "Présentiel", label: "Format" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1581092921461-eab10380f308?w=1600&q=80",
    ctaPrimary: "Réserver ma place",
    ctaSecondary: "Demander le programme",
    profiles: [
      "Professionnels du BTP",
      "Chefs de projet construction",
      "Ingénieurs",
      "BIM Managers",
    ],
    prerequisites: [
      "Aucun prérequis technique spécifique",
      "Une expérience terrain en construction est recommandée",
    ],
    pourquoi:
      "L'IA générative transforme déjà la préparation, l'exécution et le pilotage des projets de construction. Cette masterclass vous donne un cadre simple et immédiatement applicable pour comprendre les fondamentaux de l'IA, formuler de meilleurs prompts et intégrer ces outils dans vos pratiques chantier et projet.",
    objectives: [
      "Comprendre les principes fondamentaux de l'Intelligence Artificielle.",
      "Identifier les usages pertinents de l'IA pour les projets de construction.",
      "Formuler des prompts efficaces pour exploiter les outils d'IA générative.",
      "Mettre en pratique ces méthodes à travers des exercices appliqués à des situations réelles de projets de construction.",
    ],
    modules: [
      {
        number: 1,
        title: "Fondamentaux et généralités de l'IA",
        description:
          "Introduction aux concepts clés de l'intelligence artificielle et panorama des outils disponibles.",
      },
      {
        number: 2,
        title: "Les techniques du Prompt Engineering",
        description:
          "Méthodes et bonnes pratiques pour formuler des prompts efficaces à destination des outils d'IA générative.",
      },
      {
        number: 3,
        title: "Exercices pratiques sur des usages spécifiques en construction",
        description:
          "Mise en pratique de l'IA sur des cas réels : prise de décision, analyse d'informations et suivi de projets BTP.",
      },
    ],
    finalBlocks: [
      {
        badge: "Livrable",
        title: "Boîte à outils IA chantier",
        description:
          "Vous repartez avec une base de prompts et un canevas de cas d'usage directement réutilisables dans vos projets.",
        variant: "blue",
      },
    ],
    teaching: [
      {
        icon: Users,
        title: "Intervenants",
        items: [
          "Experts WeLearn",
          "BIM Pioneers",
          "Facilitateurs Build x AI Lab",
        ],
      },
      {
        icon: GraduationCap,
        title: "Approche pédagogique",
        items: [
          "Apports ciblés et démonstrations guidées",
          "Prompt labs orientés construction",
          "Exercices en sous-groupes sur cas projet",
        ],
      },
      {
        icon: MapPin,
        title: "Format",
        text: "Présentiel · 1 jour · Cas pratiques BTP",
      },
    ],
    steps: [
      {
        number: 1,
        title: "Demande d'information",
        description:
          "Contactez-nous via masterclass@welearn.ma ou par téléphone.",
      },
      {
        number: 2,
        title: "Confirmation de session",
        description:
          "Nous vous transmettons la date, le lieu et les modalités de participation.",
      },
      {
        number: 3,
        title: "Participation à la masterclass",
        description:
          "Participez à la journée en présentiel et repartez avec des cas d'usage prêts à l'emploi.",
      },
    ],
    session: "Dates sur demande",
    ctaInscription: "Réserver ma place",
    testimonials: [],
    seo: {
      title: "MasterClass Le Chantier IA | WeLearn",
      description:
        "Découvrez les fondamentaux de l'IA et du Prompt Engineering appliqués au BTP avec la MasterClass Le Chantier IA.",
      keywords:
        "masterclass IA BTP, prompt engineering construction, IA chantier, formation IA construction Maroc",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * MASTÈRE EXÉCUTIF EN MANAGEMENT DE PROJETS BTP (placeholder)
   * ────────────────────────────────────────────────────────── */
  "mastere-management-projets-btp": {
    slug: "mastere-management-projets-btp",
    title: "Mastère Exécutif en Management de Projets BTP",
    subtitle:
      "Pilotez des projets de construction complexes avec une approche stratégique, financière et opérationnelle.",
    partnerLine: "",
    badges: ["Formation diplômante", "Cadres & managers"],
    infoBanner: [
      { icon: Clock, value: "12 mois", label: "Durée" },
      { icon: Briefcase, value: "Cadres & managers", label: "Niveau" },
      { icon: CalendarDays, value: "Français", label: "Langue" },
      { icon: MapPin, value: "Présentiel", label: "Format" },
    ],
    heroImage: "",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Télécharger la brochure",
    profiles: [],
    prerequisites: [],
    pourquoi:
      "Ce mastère exécutif accompagne les responsables d'affaires, chefs de projet et directeurs de travaux dans la maîtrise des leviers de performance. Il couvre l'ensemble du cycle projet, de l'avant-projet à la livraison, avec un fort accent sur la gouvernance, la maîtrise des risques, les coûts et la conduite d'équipe dans les environnements BTP.",
    objectives: [
      "Approche orientée cas réels de projets BTP",
      "Méthodes de planification, pilotage et contrôle des coûts",
      "Compétences en leadership et management transversal",
      "Évaluation finale basée sur un projet professionnel",
    ],
    modules: [
      {
        number: 1,
        title: "Stratégie et gouvernance de projet",
        description:
          "Structuration du portefeuille projets, cadrage stratégique et pilotage par la valeur.",
      },
      {
        number: 2,
        title: "Planification, budget et risques",
        description:
          "Méthodes de planification avancée, contrôle budgétaire et gestion proactive des risques.",
      },
      {
        number: 3,
        title: "Management d'équipe chantier",
        description:
          "Communication, coordination inter-métiers et gestion de la performance collective.",
      },
      {
        number: 4,
        title: "Qualité, sécurité et conformité",
        description:
          "Mise en place des standards QSE et gestion des audits en contexte opérationnel.",
      },
    ],
    finalBlocks: [],
    teaching: [
      {
        icon: Users,
        title: "Intervenants",
        items: [
          "Nadia El Mansouri — Directrice de Programme BTP",
          "Youssef Benjelloun — Consultant Senior PMO Construction",
        ],
      },
      {
        icon: GraduationCap,
        title: "Approche pédagogique",
        items: [
          "Approche orientée cas réels de projets BTP",
          "Méthodes de planification, pilotage et contrôle des coûts",
          "Compétences en leadership et management transversal",
          "Évaluation finale basée sur un projet professionnel",
        ],
      },
      {
        icon: MapPin,
        title: "Format",
        text: "12 mois · Cadres & managers · Français",
      },
    ],
    steps: [
      {
        number: 1,
        title: "Pré-inscription en ligne",
        description: "Remplissez le formulaire de pré-inscription.",
      },
      {
        number: 2,
        title: "Dossier de candidature",
        description: "Déposez votre dossier complet.",
      },
      {
        number: 3,
        title: "Confirmation",
        description: "Recevez votre confirmation d'inscription.",
      },
    ],
    session: "",
    ctaInscription: "Déposer ma candidature",
    testimonials: [],
    seo: {
      title: "Mastère Exécutif Management Projets BTP | Welearn",
      description:
        "Un programme diplômant orienté leadership, planification et performance des projets BTP.",
      keywords:
        "mastère management projets BTP, formation BTP Maroc, management construction",
    },
  },

  /* ──────────────────────────────────────────────────────────
   * CONCEPTEUR DE PARCOURS DIGITAL LEARNING (placeholder)
   * ────────────────────────────────────────────────────────── */
  "concepteur-parcours-digital-learning": {
    slug: "concepteur-parcours-digital-learning",
    title: "Concepteur de Parcours Digital Learning",
    subtitle:
      "Concevez des formations e-learning engageantes et mesurables pour vos équipes.",
    partnerLine: "",
    badges: ["Formation certifiante", "Intermédiaire"],
    infoBanner: [
      { icon: Clock, value: "8 semaines", label: "Durée" },
      { icon: Briefcase, value: "Intermédiaire", label: "Niveau" },
      { icon: CalendarDays, value: "Français", label: "Langue" },
      { icon: MapPin, value: "En ligne", label: "Format" },
    ],
    heroImage: "",
    ctaPrimary: "Déposer ma candidature",
    ctaSecondary: "Télécharger la brochure",
    profiles: [],
    prerequisites: [],
    pourquoi:
      "Ce parcours outille les professionnels formation, RH et experts métiers pour transformer des contenus techniques en expériences d'apprentissage efficaces. Le programme combine ingénierie pédagogique, scénarisation, outils auteurs et pilotage de la performance de formation via des indicateurs concrets.",
    objectives: [
      "Méthode complète de design pédagogique digital",
      "Storyboarding et production de modules interactifs",
      "Bonnes pratiques d'animation asynchrone et tutorat",
      "Mesure des résultats d'apprentissage",
    ],
    modules: [
      {
        number: 1,
        title: "Ingénierie pédagogique digitale",
        description:
          "Analyse des besoins, définition des objectifs et architecture de parcours blended.",
      },
      {
        number: 2,
        title: "Scénarisation et storyboard",
        description:
          "Transformation de contenus experts en expériences pédagogiques structurées.",
      },
      {
        number: 3,
        title: "Production et outils auteurs",
        description:
          "Création de ressources e-learning interactives et accessibles.",
      },
      {
        number: 4,
        title: "Déploiement et évaluation",
        description:
          "Publication LMS, suivi des KPIs et amélioration continue des parcours.",
      },
    ],
    finalBlocks: [],
    teaching: [
      {
        icon: GraduationCap,
        title: "Approche pédagogique",
        items: [
          "Méthode complète de design pédagogique digital",
          "Storyboarding et production de modules interactifs",
          "Bonnes pratiques d'animation asynchrone et tutorat",
          "Mesure des résultats d'apprentissage",
        ],
      },
      {
        icon: MapPin,
        title: "Format",
        text: "8 semaines · Intermédiaire · Français",
      },
    ],
    steps: [
      {
        number: 1,
        title: "Pré-inscription en ligne",
        description: "Remplissez le formulaire de pré-inscription.",
      },
      {
        number: 2,
        title: "Dossier de candidature",
        description: "Déposez votre dossier complet.",
      },
      {
        number: 3,
        title: "Confirmation",
        description: "Recevez votre confirmation d'inscription.",
      },
    ],
    session: "",
    ctaInscription: "Déposer ma candidature",
    testimonials: [],
    seo: {
      title: "Concepteur Parcours Digital Learning | Welearn",
      description:
        "Une certification pratique pour créer, structurer et déployer des contenus digitaux à impact.",
      keywords:
        "formation digital learning, concepteur e-learning, parcours digital Maroc",
    },
  },
};

export function getFormationBySlug(
  slug: string,
): FormationPageData | undefined {
  const byObjectKey = formations[slug];

  if (byObjectKey) {
    return byObjectKey;
  }

  return Object.values(formations).find((formation) => formation.slug === slug);
}

export function getAllFormationSlugs(): string[] {
  return Object.values(formations).map((formation) => formation.slug);
}
