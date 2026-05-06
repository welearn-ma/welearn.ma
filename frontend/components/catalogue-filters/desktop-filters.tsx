import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "./filter-select";
import type { FormationFilter } from "./types";

const desktopSelectClassName =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary";

export function DesktopFilters({
  filters,
  themes,
  levels,
  durations,
  onFilterChange,
}: {
  filters: FormationFilter;
  themes: string[];
  levels: string[];
  durations: string[];
  onFilterChange: (filters: FormationFilter) => void;
}) {
  return (
    <div className="hidden md:block">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(event) =>
              onFilterChange({ search: event.target.value || undefined })
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Thème"
          value={filters.theme}
          options={themes}
          placeholder="Tous les thèmes"
          onChange={(theme) => onFilterChange({ theme })}
          className={desktopSelectClassName}
        />
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            Format
          </label>
          <select
            value={filters.format || ""}
            onChange={(event) =>
              onFilterChange({
                format: (event.target.value || undefined) as
                  | "presentiel"
                  | "digital"
                  | "blended"
                  | undefined,
              })
            }
            className={desktopSelectClassName}
          >
            <option value="">Tous les formats</option>
            <option value="presentiel">Présentiel</option>
            <option value="digital">Digital</option>
            <option value="blended">Blended (Mixte)</option>
          </select>
        </div>
        <FilterSelect
          label="Niveau"
          value={filters.level}
          options={levels}
          placeholder="Tous les niveaux"
          onChange={(level) => onFilterChange({ level })}
          className={desktopSelectClassName}
        />
        <FilterSelect
          label="Durée"
          value={filters.duration}
          options={durations}
          placeholder="Toutes les durées"
          onChange={(duration) => onFilterChange({ duration })}
          className={desktopSelectClassName}
        />
      </div>
    </div>
  );
}
