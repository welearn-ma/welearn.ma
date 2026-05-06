"use client";

import { useMemo, useState } from "react";
import { CatalogueEmptyState } from "../catalogue-shared/catalogue-empty-state";
import { defaultFilters, formations } from "./constants";
import { FormationCatalogueCard } from "./formation-card";
import { FormationsCatalogueFiltersPanel } from "./filters-panel";
import type { ActiveFilters } from "./types";

export function FormationsCataloguePage() {
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

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
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
          <FormationsCatalogueFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filteredFormations.length} formations trouvées
            </p>
            {hasActiveFilters ? null : null}
          </div>
        </div>

        {filteredFormations.length === 0 ? (
          <CatalogueEmptyState
            title="Aucune formation ne correspond à vos filtres"
            description="Ajustez les critères pour afficher de nouvelles options."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormations.map((formation) => (
              <FormationCatalogueCard
                key={formation.id}
                formation={formation}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
