import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "./filter-select";
import type { FormationFilter } from "./types";

const mobileSelectClassName =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm";

export function MobileFilters({
  filters,
  isExpanded,
  onToggle,
  themes,
  levels,
  durations,
  onFilterChange,
}: {
  filters: FormationFilter;
  isExpanded: boolean;
  onToggle: () => void;
  themes: string[];
  levels: string[];
  durations: string[];
  onFilterChange: (filters: FormationFilter) => void;
}) {
  return (
    <div className="md:hidden">
      <Button
        onClick={onToggle}
        variant="outline"
        className="w-full justify-between"
      >
        <span>Filtrer les formations</span>
        <Search className="h-4 w-4" />
      </Button>

      {isExpanded ? (
        <div className="mt-4 space-y-4 rounded-lg bg-secondary p-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Rechercher
            </label>
            <Input
              placeholder="Rechercher une formation..."
              value={filters.search || ""}
              onChange={(event) =>
                onFilterChange({ search: event.target.value || undefined })
              }
            />
          </div>

          <FilterSelect
            label="Thème"
            value={filters.theme}
            options={themes}
            placeholder="Tous les thèmes"
            onChange={(theme) => onFilterChange({ theme })}
            className={mobileSelectClassName}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
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
              className={mobileSelectClassName}
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
            className={mobileSelectClassName}
          />

          <FilterSelect
            label="Durée"
            value={filters.duration}
            options={durations}
            placeholder="Toutes les durées"
            onChange={(duration) => onFilterChange({ duration })}
            className={mobileSelectClassName}
          />
        </div>
      ) : null}
    </div>
  );
}
