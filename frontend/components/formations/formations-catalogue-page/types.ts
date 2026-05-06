import type {
  FormationDomain,
  FormationFormat,
  FormationLevel,
  FormationType,
} from "../../../data/formations-catalogue";

export interface ActiveFilters {
  type: FormationType | "all";
  domain: FormationDomain | "all";
  format: FormationFormat | "all";
  level: FormationLevel | "all";
}
