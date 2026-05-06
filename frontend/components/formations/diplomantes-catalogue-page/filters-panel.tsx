import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultFilters, diplomantes } from "./constants";
import type { ActiveFilters } from "./types";

export function DiplomantesCatalogueFiltersPanel({
  filters,
  onFiltersChange,
  filteredCount,
}: {
  filters: ActiveFilters;
  onFiltersChange: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  filteredCount: number;
}) {
  const badgeOptions = [...new Set(diplomantes.map((item) => item.badge))];
  const domainOptions = [...new Set(diplomantes.map((item) => item.domain))];
  const durationOptions = [
    ...new Set(diplomantes.map((item) => item.duration)),
  ];
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all",
  );

  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Catégorie
          </label>
          <select
            value={filters.badge}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                badge: event.target.value as ActiveFilters["badge"],
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Toutes</option>
            {badgeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
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
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                domain: event.target.value as ActiveFilters["domain"],
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Tous</option>
            {domainOptions.map((option) => (
              <option key={option} value={option}>
                {option}
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
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                duration: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Toutes</option>
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.badge !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, badge: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Catégorie : {filters.badge}
            <X className="h-3 w-3" />
          </button>
        ) : null}
        {filters.domain !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, domain: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Domaine : {filters.domain}
            <X className="h-3 w-3" />
          </button>
        ) : null}
        {filters.duration !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, duration: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Durée : {filters.duration}
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredCount} programme{filteredCount > 1 ? "s" : ""} trouvé
          {filteredCount > 1 ? "s" : ""}
        </p>
        {hasActiveFilters ? (
          <Button
            variant="outline"
            onClick={() => onFiltersChange(defaultFilters)}
            className="bg-transparent"
          >
            Réinitialiser les filtres
          </Button>
        ) : null}
      </div>
    </div>
  );
}
