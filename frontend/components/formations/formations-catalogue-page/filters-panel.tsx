import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formations, defaultFilters } from "./constants";
import type { ActiveFilters } from "./types";

export function FormationsCatalogueFiltersPanel({
  filters,
  onFiltersChange,
}: {
  filters: ActiveFilters;
  onFiltersChange: React.Dispatch<React.SetStateAction<ActiveFilters>>;
}) {
  const typeOptions = [
    ...new Set(formations.map((formation) => formation.type)),
  ];
  const domainOptions = [
    ...new Set(formations.map((formation) => formation.domain)),
  ];
  const formatOptions = [
    ...new Set(formations.flatMap((formation) => formation.format)),
  ];
  const levelOptions = [
    ...new Set(formations.map((formation) => formation.level)),
  ];

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all",
  );

  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                type: event.target.value as ActiveFilters["type"],
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Tous</option>
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
              onFiltersChange((current) => ({
                ...current,
                format: event.target.value as ActiveFilters["format"],
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Tous</option>
            {formatOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Niveau
          </label>
          <select
            value={filters.level}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                level: event.target.value as ActiveFilters["level"],
              }))
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          >
            <option value="all">Tous</option>
            {levelOptions.map((option) => (
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
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.type !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, type: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Type: {filters.type}
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
            Domaine: {filters.domain}
            <X className="h-3 w-3" />
          </button>
        ) : null}
        {filters.format !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, format: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Format: {filters.format}
            <X className="h-3 w-3" />
          </button>
        ) : null}
        {filters.level !== "all" ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange((current) => ({ ...current, level: "all" }))
            }
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
          >
            Niveau: {filters.level}
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {/* Count is rendered by parent next to this panel */}
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
