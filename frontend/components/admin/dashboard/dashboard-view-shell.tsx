import {
  CalendarDays,
  Download,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { neutralActionButtonClass } from "./dashboard-utils";
import type { DateFilter } from "./dashboard-types";

export function DashboardViewShell({
  title,
  subtitle,
  search,
  onSearch,
  dateFilter,
  onDateFilter,
  formationFilter,
  onFormationFilter,
  formationOptions,
  onRefresh,
  onExport,
  children,
}: {
  title: string;
  subtitle: string;
  search: string;
  onSearch: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilter: (value: DateFilter) => void;
  formationFilter: string;
  onFormationFilter: (value: string) => void;
  formationOptions: string[];
  onRefresh: () => void;
  onExport: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
      <div className="border-b border-wl-border p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-wl-text">{title}</h2>
            <p className="mt-1 text-sm text-wl-text-secondary">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onRefresh}
              variant="outline"
              className={`w-full sm:w-auto ${neutralActionButtonClass}`}
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button
              onClick={onExport}
              className="w-full bg-wl-blue text-white hover:bg-wl-blue-dark sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
            <Input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Rechercher un nom, email, formation..."
              className="border-wl-border bg-white pl-9 text-wl-text placeholder:text-wl-text-tertiary"
            />
          </label>

          <label className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
            <select
              value={dateFilter}
              onChange={(event) =>
                onDateFilter(event.target.value as DateFilter)
              }
              className="h-9 w-full rounded-md border border-wl-border bg-white pl-9 pr-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20"
            >
              <option value="all">Toutes les dates</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
          </label>

          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
            <select
              value={formationFilter}
              onChange={(event) => onFormationFilter(event.target.value)}
              className="h-9 w-full rounded-md border border-wl-border bg-white pl-9 pr-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20"
            >
              <option value="all">Toutes les formations</option>
              {formationOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}
