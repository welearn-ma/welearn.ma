export type AdminView = "inscriptions" | "formations" | "activite";
export type DateFilter = "all" | "7d" | "30d" | "90d";

export type FormationSummary = {
  title: string;
  count: number;
  latest: string;
  companiesCount: number;
};
