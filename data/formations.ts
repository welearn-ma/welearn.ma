export type Formation = {
  slug: string;
  title: string;
  subtitle: string;
  category: "diplomante" | "certifiante";
  duration: string;
  level: string;
  language: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  modules: { title: string; description: string }[];
  instructors?: { name: string; title: string }[];
  imageUrl?: string;
};

export const formations: Formation[] = [
  {
    slug: "mastere-management-projets-btp",
    title: "Mastère Exécutif en Management de Projets BTP",
    subtitle:
      "Pilotez des projets de construction complexes avec une approche stratégique, financière et opérationnelle.",
    category: "diplomante",
    duration: "12 mois",
    level: "Cadres & managers",
    language: "Français",
    shortDescription:
      "Un programme diplômant orienté leadership, planification et performance des projets BTP.",
    longDescription:
      "Ce mastère exécutif accompagne les responsables d'affaires, chefs de projet et directeurs de travaux dans la maîtrise des leviers de performance. Il couvre l'ensemble du cycle projet, de l'avant-projet à la livraison, avec un fort accent sur la gouvernance, la maîtrise des risques, les coûts et la conduite d'équipe dans les environnements BTP.",
    highlights: [
      "Approche orientée cas réels de projets BTP",
      "Méthodes de planification, pilotage et contrôle des coûts",
      "Compétences en leadership et management transversal",
      "Évaluation finale basée sur un projet professionnel",
    ],
    modules: [
      {
        title: "Stratégie et gouvernance de projet",
        description:
          "Structuration du portefeuille projets, cadrage stratégique et pilotage par la valeur.",
      },
      {
        title: "Planification, budget et risques",
        description:
          "Méthodes de planification avancée, contrôle budgétaire et gestion proactive des risques.",
      },
      {
        title: "Management d'équipe chantier",
        description:
          "Communication, coordination inter-métiers et gestion de la performance collective.",
      },
      {
        title: "Qualité, sécurité et conformité",
        description:
          "Mise en place des standards QSE et gestion des audits en contexte opérationnel.",
      },
    ],
    instructors: [
      { name: "Nadia El Mansouri", title: "Directrice de Programme BTP" },
      {
        name: "Youssef Benjelloun",
        title: "Consultant Senior PMO Construction",
      },
    ],
  },
  {
    slug: "bim-foundations-professional",
    title: "BIM Foundations Professional",
    subtitle:
      "Développez les fondamentaux BIM et préparez la certification reconnue internationalement.",
    category: "certifiante",
    duration: "21h / 1 mois",
    level: "Professionnel",
    language: "Français / Anglais",
    shortDescription:
      "Une formation certifiante pour structurer vos pratiques BIM selon les standards openBIM.",
    longDescription:
      "Cette formation certifiante permet d'acquérir les bases indispensables pour collaborer efficacement dans des projets BIM. Les participants maîtrisent les concepts clés, les rôles, les processus et la gestion des informations selon les standards internationaux. Le parcours inclut une préparation ciblée à la certification Foundations.",
    highlights: [
      "Préparation intensive à la certification Foundations",
      "Standards openBIM et collaboration interdisciplinaire",
      "Études de cas de coordination projet",
      "Accompagnement par des experts BIM terrain",
    ],
    modules: [
      {
        title: "Fondamentaux BIM et vocabulaire",
        description:
          "Concepts, bénéfices et cycle de vie de l'information dans un projet BIM.",
      },
      {
        title: "Processus collaboratifs",
        description:
          "Organisation des rôles, échanges de données et coordination entre acteurs.",
      },
      {
        title: "Standards et conformité",
        description:
          "Introduction aux standards openBIM et bonnes pratiques de structuration des livrables.",
      },
      {
        title: "Préparation examen",
        description:
          "Exercices guidés, quiz et simulation des conditions d'évaluation.",
      },
    ],
    instructors: [{ name: "Sara Ouhssine", title: "BIM Manager & Formatrice" }],
  },
  {
    slug: "concepteur-parcours-digital-learning",
    title: "Concepteur de Parcours Digital Learning",
    subtitle:
      "Concevez des formations e-learning engageantes et mesurables pour vos équipes.",
    category: "certifiante",
    duration: "8 semaines",
    level: "Intermédiaire",
    language: "Français",
    shortDescription:
      "Une certification pratique pour créer, structurer et déployer des contenus digitaux à impact.",
    longDescription:
      "Ce parcours outille les professionnels formation, RH et experts métiers pour transformer des contenus techniques en expériences d'apprentissage efficaces. Le programme combine ingénierie pédagogique, scénarisation, outils auteurs et pilotage de la performance de formation via des indicateurs concrets.",
    highlights: [
      "Méthode complète de design pédagogique digital",
      "Storyboarding et production de modules interactifs",
      "Bonnes pratiques d'animation asynchrone et tutorat",
      "Mesure des résultats d'apprentissage",
    ],
    modules: [
      {
        title: "Ingénierie pédagogique digitale",
        description:
          "Analyse des besoins, définition des objectifs et architecture de parcours blended.",
      },
      {
        title: "Scénarisation et storyboard",
        description:
          "Transformation de contenus experts en expériences pédagogiques structurées.",
      },
      {
        title: "Production et outils auteurs",
        description:
          "Création de ressources e-learning interactives et accessibles.",
      },
      {
        title: "Déploiement et évaluation",
        description:
          "Publication LMS, suivi des KPIs et amélioration continue des parcours.",
      },
    ],
  },
];

export function getFormationBySlug(slug: string) {
  return formations.find((formation) => formation.slug === slug);
}
