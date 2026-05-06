import {
  diplomantesFormations,
  type FormationDomain,
  type FormationLevel,
} from "../../../data/formations-catalogue";
import type { ActiveFilters, Diplomante, DiplomanteBadge } from "./types";

export const diplomantes = diplomantesFormations as Diplomante[];

export const defaultFilters: ActiveFilters = {
  badge: "all",
  domain: "all",
  duration: "all",
};

export const badgeClasses: Record<DiplomanteBadge, string> = {
  "Executive Masters": "bg-primary/10 text-primary border-primary/25",
  "Licence Pro": "bg-amber-50 text-amber-700 border-amber-200",
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
