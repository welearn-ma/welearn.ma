"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  GraduationCap,
  Laptop,
  Layers3,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import formationsData from "@/data/formations.json";

type FormationType = "Certifiante" | "Formation courte";
type FormationBadge = "Certifiante" | "Sur mesure";
type FormationDomain =
  | "BIM"
  | "BTP"
  | "Immobilier"
  | "Digital & IA"
  | "Management";
type FormationFormat = "E-learning" | "Présentiel";
type FormationLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "All levels"
  | "Professional";

interface FormationContact {
  email: string | null;
  phone: string[];
}

interface Formation {
  id: number;
  title: string;
  type: FormationType;
  badge: FormationBadge;
  domain: FormationDomain;
  provider: string;
  issuer: string | null;
  format: FormationFormat[];
  duration: string;
  level: FormationLevel;
  target: string[];
  summary: string;
  objectives: string[];
  modules: string[];
  accreditation: string | null;
  contact: FormationContact | null;
  featured: boolean;
}

const formations = formationsData.formations as Formation[];

interface ActiveFilters {
  type: FormationType | "all";
  domain: FormationDomain | "all";
  format: FormationFormat | "all";
  level: FormationLevel | "all";
}

const defaultFilters: ActiveFilters = {
  type: "all",
  domain: "all",
  format: "all",
  level: "all",
};

const badgeClasses: Record<FormationBadge, string> = {
  Certifiante: "bg-primary/10 text-primary border-primary/25",
  "Sur mesure": "bg-slate-100 text-slate-700 border-slate-200",
};

const domainStripeClasses: Record<FormationDomain, string> = {
  BIM: "bg-sky-500",
  BTP: "bg-emerald-500",
  Immobilier: "bg-amber-500",
  "Digital & IA": "bg-violet-500",
  Management: "bg-cyan-600",
};

const levelIndicatorClasses: Record<FormationLevel, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
  "All levels": "bg-slate-100 text-slate-700",
  Professional: "bg-indigo-100 text-indigo-700",
};

function getFormatIcon(formats: FormationFormat[]) {
  if (formats.includes("Présentiel") && formats.includes("E-learning")) {
    return Layers3;
  }
  if (formats.includes("Présentiel")) {
    return Building2;
  }
  return Laptop;
}

function getCtaHref(formation: Formation) {
  if (formation.featured) {
    return "/formations/certifiantes/bim-foundations";
  }

  return "/formations/certifiantes/sur-mesure";
}

export function FormationsCataloguePage() {
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

  const typeOptions = useMemo(
    () => [...new Set(formations.map((formation) => formation.type))],
    [],
  );
  const domainOptions = useMemo(
    () => [...new Set(formations.map((formation) => formation.domain))],
    [],
  );
  const formatOptions = useMemo(
    () => [...new Set(formations.flatMap((formation) => formation.format))],
    [],
  );
  const levelOptions = useMemo(
    () => [...new Set(formations.map((formation) => formation.level))],
    [],
  );

  const filteredFormations = useMemo(() => {
    return formations.filter((formation) => {
      const typeMatch =
        filters.type === "all" || formation.type === filters.type;
      const domainMatch =
        filters.domain === "all" || formation.domain === filters.domain;
      const formatMatch =
        filters.format === "all" || formation.format.includes(filters.format);
      const levelMatch =
        filters.level === "all" || formation.level === filters.level;

      return typeMatch && domainMatch && formatMatch && levelMatch;
    });
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all",
  );

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    type: event.target.value as ActiveFilters["type"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Format
              </label>
              <select
                value={filters.format}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    format: event.target.value as ActiveFilters["format"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All</option>
                {formatOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    level: event.target.value as ActiveFilters["level"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All</option>
                {levelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Domain
              </label>
              <select
                value={filters.domain}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    domain: event.target.value as ActiveFilters["domain"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All</option>
                {domainOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.type !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({ ...current, type: "all" }))
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Type: {filters.type}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.domain !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({ ...current, domain: "all" }))
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Domaine: {filters.domain}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.format !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({ ...current, format: "all" }))
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Format: {filters.format}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.level !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setFilters((current) => ({ ...current, level: "all" }))
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Niveau: {filters.level}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filteredFormations.length} formations trouvées
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
                className="bg-transparent"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        </div>

        {filteredFormations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              Aucune formation ne correspond à vos filtres
            </h3>
            <p className="mt-2 text-muted-foreground">
              Ajustez les critères pour afficher de nouvelles options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormations.map((formation) => {
              const FormatIcon = getFormatIcon(formation.format);

              return (
                <article
                  key={formation.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`h-1.5 w-full ${domainStripeClasses[formation.domain]}`}
                  />

                  <div className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={badgeClasses[formation.badge]}
                      >
                        {formation.badge}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {formation.domain}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-foreground">
                      {formation.title}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>
                          <strong>Provider:</strong> {formation.provider}
                        </span>
                      </p>
                      {formation.issuer && (
                        <p className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span>
                            <strong>Issuer:</strong> {formation.issuer}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        <FormatIcon className="h-3.5 w-3.5 text-primary" />
                        {formation.format.join(" / ")}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        <Clock3 className="h-3.5 w-3.5 text-primary" />
                        {formation.duration}
                      </span>
                    </div>

                    <div className="mt-4 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold">
                      <span
                        className={`rounded-full px-2.5 py-1 ${levelIndicatorClasses[formation.level]}`}
                      >
                        {formation.level}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {formation.summary}
                    </p>

                    <div className="mt-auto pt-5">
                      <Button
                        asChild
                        className="w-full bg-primary text-white hover:bg-primary/90"
                      >
                        <Link href={getCtaHref(formation)}>
                          En savoir plus
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
