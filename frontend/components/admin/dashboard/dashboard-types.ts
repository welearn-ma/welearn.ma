export type AdminView = "inscriptions" | "activite" | "sponsors";
export type DateFilter = "all" | "7d" | "30d" | "90d";

/** Onglet Nouveaux/Traités partagé par les vues Inscriptions et Sponsors. */
export type RequestStatus = "new" | "treated";

/** Filtre d'origine de la vue Inscriptions (registration_requests.source). */
export type SourceFilter = "inscription" | "brochure" | "all";

/** Mode d'affichage de la vue Inscriptions : liste des étudiants ou cartes par formation. */
export type InscriptionsDisplayMode = "students" | "formations";

export type FormationSummary = {
  title: string;
  count: number;
  latest: string;
  companiesCount: number;
};
