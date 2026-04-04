"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock3, GraduationCap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import formationsData from "@/data/formations.json";

type DiplomanteBadge = "Executive Masters" | "Licence Pro";
type FormationDomain =
  | "BIM"
  | "BTP"
  | "Immobilier"
  | "Digital & IA"
  | "Management";
type FormationLevel =
  | "Débutant"
  | "Intermédiaire"
  | "Avancé"
  | "Tous niveaux"
  | "Professionnel";

interface Diplomante {
  id: number;
  slug?: string;
  title: string;
  type: "Diplomante";
  badge: DiplomanteBadge;
  domain: FormationDomain;
  provider: string;
  issuer: string | null;
  format: string[];
  duration: string;
  level: FormationLevel;
  target: string[];
  summary: string;
  objectives: string[];
  modules: string[];
  accreditation: string | null;
  contact: null;
  featured: boolean;
  tags?: string[];
}

const diplomantes = (formationsData.formations as unknown[]).filter(
  (f) => (f as { type: string }).type === "Diplomante",
) as Diplomante[];

interface ActiveFilters {
  badge: DiplomanteBadge | "all";
  domain: FormationDomain | "all";
  duration: string | "all";
}

const defaultFilters: ActiveFilters = {
  badge: "all",
  domain: "all",
  duration: "all",
};

const badgeClasses: Record<DiplomanteBadge, string> = {
  "Executive Masters": "bg-primary/10 text-primary border-primary/25",
  "Licence Pro": "bg-amber-50 text-amber-700 border-amber-200",
};

const domainStripeClasses: Record<FormationDomain, string> = {
  BIM: "bg-sky-500",
  BTP: "bg-emerald-500",
  Immobilier: "bg-amber-500",
  "Digital & IA": "bg-violet-500",
  Management: "bg-cyan-600",
};

const levelIndicatorClasses: Record<FormationLevel, string> = {
  Débutant: "bg-emerald-100 text-emerald-700",
  Intermédiaire: "bg-amber-100 text-amber-700",
  Avancé: "bg-rose-100 text-rose-700",
  "Tous niveaux": "bg-slate-100 text-slate-700",
  Professionnel: "bg-indigo-100 text-indigo-700",
};

function getFormationSlug(diplomante: Diplomante) {
  if (diplomante.slug) {
    return diplomante.slug;
  }

  return "mastere-management-projets-btp";
}

export function DiplomantesCataloguePage() {
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

  const badgeOptions = useMemo(
    () => [...new Set(diplomantes.map((d) => d.badge))],
    [],
  );
  const domainOptions = useMemo(
    () => [...new Set(diplomantes.map((d) => d.domain))],
    [],
  );
  const durationOptions = useMemo(
    () => [...new Set(diplomantes.map((d) => d.duration))],
    [],
  );

  const filtered = useMemo(() => {
    return diplomantes.filter((d) => {
      const badgeMatch = filters.badge === "all" || d.badge === filters.badge;
      const domainMatch =
        filters.domain === "all" || d.domain === filters.domain;
      const durationMatch =
        filters.duration === "all" || d.duration === filters.duration;
      return badgeMatch && domainMatch && durationMatch;
    });
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        {/* Filters */}
        <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Catégorie
              </label>
              <select
                value={filters.badge}
                onChange={(e) =>
                  setFilters((c) => ({
                    ...c,
                    badge: e.target.value as ActiveFilters["badge"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">Toutes</option>
                {badgeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Domaine
              </label>
              <select
                value={filters.domain}
                onChange={(e) =>
                  setFilters((c) => ({
                    ...c,
                    domain: e.target.value as ActiveFilters["domain"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">Tous</option>
                {domainOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Durée
              </label>
              <select
                value={filters.duration}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, duration: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">Toutes</option>
                {durationOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.badge !== "all" && (
              <button
                type="button"
                onClick={() => setFilters((c) => ({ ...c, badge: "all" }))}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Catégorie : {filters.badge}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.domain !== "all" && (
              <button
                type="button"
                onClick={() => setFilters((c) => ({ ...c, domain: "all" }))}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Domaine : {filters.domain}
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.duration !== "all" && (
              <button
                type="button"
                onClick={() => setFilters((c) => ({ ...c, duration: "all" }))}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                Durée : {filters.duration}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} programme{filtered.length > 1 ? "s" : ""} trouvé
              {filtered.length > 1 ? "s" : ""}
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

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              Aucun programme ne correspond à vos filtres
            </h3>
            <p className="mt-2 text-muted-foreground">
              Ajustez les critères pour afficher de nouvelles options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((diplomante) => (
              <Link
                key={diplomante.id}
                href={`/formations/${getFormationSlug(diplomante)}`}
                className="block h-full"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div
                    className={`h-1.5 w-full ${domainStripeClasses[diplomante.domain]}`}
                  />

                  <div className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={badgeClasses[diplomante.badge]}
                      >
                        {diplomante.badge}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {diplomante.domain}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-foreground">
                      {diplomante.title}
                    </h3>

                    {diplomante.issuer && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <strong>Partenaire :</strong> {diplomante.issuer}
                        </span>
                      </p>
                    )}

                    {diplomante.tags && diplomante.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {diplomante.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        <Clock3 className="h-3.5 w-3.5 text-primary" />
                        {diplomante.duration}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${levelIndicatorClasses[diplomante.level]}`}
                      >
                        {diplomante.level}
                      </span>
                    </div>

                    <p className="mt-3 overflow-hidden text-sm leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {diplomante.summary}
                    </p>

                    <div className="mt-auto pt-5">
                      <Button
                        asChild
                        className="w-full bg-primary text-white hover:bg-primary/90"
                      >
                        <span>
                          En savoir plus
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
