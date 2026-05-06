import { Building2, Laptop, Layers3, type LucideIcon } from "lucide-react";
import {
  certifiantesFormations,
  type FormationBadge,
  type FormationDomain,
  type FormationFormat,
  type FormationLevel,
} from "../../../data/formations-catalogue";
import type { ActiveFilters } from "./types";

export const formations = certifiantesFormations;

export const defaultFilters: ActiveFilters = {
  type: "all",
  domain: "all",
  format: "all",
  level: "all",
};

export const badgeClasses: Record<FormationBadge, string> = {
  Certifiante: "bg-primary/10 text-primary border-primary/25",
  "Sur mesure": "bg-slate-100 text-slate-700 border-slate-200",
  "Executive Masters": "bg-primary/10 text-primary border-primary/25",
  "Licence Pro": "bg-amber-50 text-amber-700 border-amber-200",
  MasterClass: "bg-violet-100 text-violet-700 border-violet-200",
};

export const domainStripeClasses: Record<FormationDomain, string> = {
  BIM: "bg-sky-500",
  BTP: "bg-emerald-500",
  Immobilier: "bg-amber-500",
  "Digital & IA": "bg-violet-500",
  Management: "bg-cyan-600",
};

export const levelIndicatorClasses: Record<FormationLevel, string> = {
  Débutant: "bg-emerald-100 text-emerald-700",
  Intermédiaire: "bg-amber-100 text-amber-700",
  Avancé: "bg-rose-100 text-rose-700",
  "Tous niveaux": "bg-slate-100 text-slate-700",
  Professionnel: "bg-indigo-100 text-indigo-700",
};

export function getFormatIcon(formats: FormationFormat[]): LucideIcon {
  if (formats.includes("Présentiel") && formats.includes("E-learning")) {
    return Layers3;
  }
  if (formats.includes("Présentiel")) {
    return Building2;
  }
  return Laptop;
}
