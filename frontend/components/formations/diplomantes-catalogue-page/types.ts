import type {
  diplomantesFormations,
  FormationDomain,
  FormationLevel,
} from "../../../data/formations-catalogue";

export type DiplomanteBadge = "Executive Masters" | "Licence Pro";

export type Diplomante = (typeof diplomantesFormations)[number] & {
  badge: DiplomanteBadge;
  duration: string;
  format: string[];
  issuer: string | null;
  level: FormationLevel;
  domain: FormationDomain;
};

export interface ActiveFilters {
  badge: DiplomanteBadge | "all";
  domain: FormationDomain | "all";
  duration: string | "all";
}
