import { X } from "lucide-react";
import type { FormationFilter } from "./types";

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs text-white">
      {label}
      <button onClick={onClear} className="hover:opacity-80">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function ActiveFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: {
  filters: FormationFilter;
  onFilterChange: (filters: FormationFilter) => void;
  onClearFilters: () => void;
}) {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "",
  );

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <span className="text-sm font-medium text-foreground">
        Filtres actifs :
      </span>
      <div className="flex flex-wrap gap-2">
        {filters.search ? (
          <FilterChip
            label={`Recherche: ${filters.search}`}
            onClear={() => onFilterChange({ search: undefined })}
          />
        ) : null}
        {filters.theme ? (
          <FilterChip
            label={filters.theme}
            onClear={() => onFilterChange({ theme: undefined })}
          />
        ) : null}
        {filters.format ? (
          <FilterChip
            label={filters.format}
            onClear={() => onFilterChange({ format: undefined })}
          />
        ) : null}
        {filters.level ? (
          <FilterChip
            label={filters.level}
            onClear={() => onFilterChange({ level: undefined })}
          />
        ) : null}
        {filters.duration ? (
          <FilterChip
            label={filters.duration}
            onClear={() => onFilterChange({ duration: undefined })}
          />
        ) : null}
      </div>
      <button
        onClick={onClearFilters}
        className="ml-auto text-xs font-medium text-primary hover:underline"
      >
        Réinitialiser
      </button>
    </div>
  );
}
