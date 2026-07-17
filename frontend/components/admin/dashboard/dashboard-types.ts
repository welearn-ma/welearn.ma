import type { AdminRegistrationRecord } from "@/types/admin-registration";
import type { AdminSponsorRecord } from "@/types/sponsor";

export type AdminView =
  | "inscriptions"
  | "formations"
  | "activite"
  | "sponsors";
export type DateFilter = "all" | "7d" | "30d" | "90d";

export type FormationSummary = {
  title: string;
  count: number;
  latest: string;
  companiesCount: number;
};

/**
 * Evenement du flux d'activite. Agregation de tables sources (pas de table
 * d'evenements dediee) : registration_requests -> inscription,
 * sponsors -> sponsor.
 */
export type ActivityItem =
  | { kind: "inscription"; createdAt: string; record: AdminRegistrationRecord }
  | { kind: "sponsor"; createdAt: string; record: AdminSponsorRecord };
