import type { LucideIcon } from "lucide-react";

export type SegmentedToggleOption<T extends string> = {
  id: T;
  label: string;
  icon?: LucideIcon;
};

/** Bascule minimale a options segmentees, reutilisee pour tout choix
 * mutuellement exclusif dans le dashboard (statut, mode d'affichage...). */
export function DashboardSegmentedToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<SegmentedToggleOption<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-wl-border bg-wl-gray-light p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-wl-blue text-white"
                : "text-wl-text-secondary hover:bg-white"
            }`}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
