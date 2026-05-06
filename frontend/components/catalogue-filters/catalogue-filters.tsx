"use client";

import { useState } from "react";
import { ActiveFilters } from "./active-filters";
import { DesktopFilters } from "./desktop-filters";
import { MobileFilters } from "./mobile-filters";
import type { CatalogueFiltersProps, FormationFilter } from "./types";

export type { CatalogueFiltersProps, FormationFilter } from "./types";

export function CatalogueFilters({
  onFilterChange,
  themes = [
    "BIM",
    "Management",
    "Technique",
    "Sécurité",
    "Réglementation",
    "Digital",
  ],
  levels = ["Débutant", "Intermédiaire", "Avancé"],
  durations = [
    "Moins d'une journée",
    "1-3 jours",
    "1 semaine",
    "Plus d'une semaine",
  ],
}: CatalogueFiltersProps) {
  const [filters, setFilters] = useState<FormationFilter>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: FormationFilter) => {
    const mergedFilters = { ...filters, ...newFilters };
    setFilters(mergedFilters);
    onFilterChange(mergedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      <DesktopFilters
        filters={filters}
        themes={themes}
        levels={levels}
        durations={durations}
        onFilterChange={handleFilterChange}
      />
      <MobileFilters
        filters={filters}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((current) => !current)}
        themes={themes}
        levels={levels}
        durations={durations}
        onFilterChange={handleFilterChange}
      />
      <ActiveFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
