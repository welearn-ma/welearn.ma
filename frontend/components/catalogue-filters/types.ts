export interface FormationFilter {
  theme?: string;
  format?: "presentiel" | "digital" | "blended";
  level?: string;
  duration?: string;
  search?: string;
}

export interface CatalogueFiltersProps {
  onFilterChange: (filters: FormationFilter) => void;
  themes?: string[];
  levels?: string[];
  durations?: string[];
}
