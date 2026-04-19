"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export interface FormationFilter {
  theme?: string;
  format?: "presentiel" | "digital" | "blended";
  level?: string;
  duration?: string;
  search?: string;
}

interface CatalogueFiltersProps {
  onFilterChange: (filters: FormationFilter) => void;
  themes?: string[];
  levels?: string[];
  durations?: string[];
}

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

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "",
  );

  return (
    <div className="space-y-6">
      {/* Simple view - Desktop */}
      <div className="hidden md:block">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une formation..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) =>
                handleFilterChange({ search: e.target.value || undefined })
              }
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Theme Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Thème
            </label>
            <select
              value={filters.theme || ""}
              onChange={(e) =>
                handleFilterChange({ theme: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les thèmes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Format
            </label>
            <select
              value={filters.format || ""}
              onChange={(e) =>
                handleFilterChange({
                  format: (e.target.value || undefined) as
                    | "presentiel"
                    | "digital"
                    | "blended"
                    | undefined,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les formats</option>
              <option value="presentiel">Présentiel</option>
              <option value="digital">Digital</option>
              <option value="blended">Blended (Mixte)</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Niveau
            </label>
            <select
              value={filters.level || ""}
              onChange={(e) =>
                handleFilterChange({ level: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les niveaux</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Durée
            </label>
            <select
              value={filters.duration || ""}
              onChange={(e) =>
                handleFilterChange({ duration: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Toutes les durées</option>
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collapse view - Mobile */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="w-full justify-between"
        >
          <span>Filtrer les formations</span>
          <Search className="h-4 w-4" />
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-4 p-4 bg-secondary rounded-lg">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Rechercher
              </label>
              <Input
                placeholder="Rechercher une formation..."
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange({ search: e.target.value || undefined })
                }
              />
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Thème
              </label>
              <select
                value={filters.theme || ""}
                onChange={(e) =>
                  handleFilterChange({ theme: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                <option value="">Tous les thèmes</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Format
              </label>
              <select
                value={filters.format || ""}
                onChange={(e) =>
                  handleFilterChange({
                    format: (e.target.value || undefined) as
                      | "presentiel"
                      | "digital"
                      | "blended"
                      | undefined,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                <option value="">Tous les formats</option>
                <option value="presentiel">Présentiel</option>
                <option value="digital">Digital</option>
                <option value="blended">Blended (Mixte)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-foreground">
            Filtres actifs :
          </span>
          <div className="flex gap-2 flex-wrap">
            {filters.search && (
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-2">
                Recherche: {filters.search}
                <button
                  onClick={() => handleFilterChange({ search: undefined })}
                  className="hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.theme && (
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-2">
                {filters.theme}
                <button
                  onClick={() => handleFilterChange({ theme: undefined })}
                  className="hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.format && (
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-2">
                {filters.format}
                <button
                  onClick={() => handleFilterChange({ format: undefined })}
                  className="hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.level && (
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-2">
                {filters.level}
                <button
                  onClick={() => handleFilterChange({ level: undefined })}
                  className="hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.duration && (
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-2">
                {filters.duration}
                <button
                  onClick={() => handleFilterChange({ duration: undefined })}
                  className="hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline font-medium ml-auto"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}
