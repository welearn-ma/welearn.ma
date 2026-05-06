"use client";

import { useMemo, useState } from "react";
import { CatalogueEmptyState } from "../catalogue-shared/catalogue-empty-state";
import { defaultFilters, diplomantes } from "./constants";
import { DiplomanteCatalogueCard } from "./diplomante-card";
import { DiplomantesCatalogueFiltersPanel } from "./filters-panel";
import type { ActiveFilters } from "./types";

export function DiplomantesCataloguePage() {
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

  const filtered = useMemo(() => {
    return diplomantes.filter((item) => {
      const badgeMatch =
        filters.badge === "all" || item.badge === filters.badge;
      const domainMatch =
        filters.domain === "all" || item.domain === filters.domain;
      const durationMatch =
        filters.duration === "all" || item.duration === filters.duration;

      return badgeMatch && domainMatch && durationMatch;
    });
  }, [filters]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <DiplomantesCatalogueFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          filteredCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <CatalogueEmptyState
            title="Aucun programme ne correspond à vos filtres"
            description="Ajustez les critères pour afficher de nouvelles options."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((diplomante) => (
              <DiplomanteCatalogueCard
                key={diplomante.id}
                diplomante={diplomante}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
