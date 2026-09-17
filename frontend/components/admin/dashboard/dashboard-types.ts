export type AdminView =
  | "inscriptions"
  | "formations"
  | "activite"
  | "sponsors";
export type DateFilter = "all" | "7d" | "30d" | "90d";

/** Onglet Nouveaux/Traités partagé par les vues Inscriptions et Sponsors. */
export type RequestStatus = "new" | "treated";

export type FormationSummary = {
  title: string;
  count: number;
  latest: string;
  companiesCount: number;
};
