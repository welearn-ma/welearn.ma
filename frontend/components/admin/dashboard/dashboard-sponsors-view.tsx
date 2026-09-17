import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  FolderKanban,
  Mail,
  RefreshCw,
  RotateCcw,
  Search,
  Undo2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminSponsorRecord } from "@/types/sponsor";
import {
  formatDate,
  neutralActionButtonClass,
  REQUEST_STATUS_OPTIONS,
  sponsorProgramLabel,
} from "./dashboard-utils";
import { DashboardSegmentedToggle } from "./dashboard-segmented-toggle";
import { DashboardStatTile } from "./dashboard-stat-tile";
import type { RequestStatus } from "./dashboard-types";

export function DashboardSponsorsView({
  rows,
  totals,
  status,
  onStatusChange,
  search,
  onSearch,
  programFilter,
  onProgramFilter,
  programOptions,
  formationFilter,
  onFormationFilter,
  formationOptions,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
  last24h,
  onLast24h,
  onResetFilters,
  onRefresh,
  onExport,
  onView,
  onContact,
  onMarkTreated,
  onUnmarkTreated,
}: {
  rows: AdminSponsorRecord[];
  totals: { sponsors: number; formations: number; entreprises: number };
  status: RequestStatus;
  onStatusChange: (status: RequestStatus) => void;
  search: string;
  onSearch: (value: string) => void;
  programFilter: string;
  onProgramFilter: (value: string) => void;
  programOptions: Array<{ value: string; label: string }>;
  formationFilter: string;
  onFormationFilter: (value: string) => void;
  formationOptions: Array<{ value: string; label: string }>;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
  last24h: boolean;
  onLast24h: (value: boolean) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onView: (sponsor: AdminSponsorRecord) => void;
  onContact: (email: string) => void;
  onMarkTreated: (id: string) => void;
  onUnmarkTreated: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <DashboardStatTile label="Sponsors" value={totals.sponsors} />
        <DashboardStatTile
          label="Formations parrainées"
          value={totals.formations}
        />
        <DashboardStatTile label="Entreprises" value={totals.entreprises} />
      </div>

      <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
        <div className="border-b border-wl-border p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-wl-text">Sponsors</h2>
              <p className="mt-1 text-sm text-wl-text-secondary">
                Organisations souhaitant parrainer une ou plusieurs formations
              </p>
              <div className="mt-3">
                <DashboardSegmentedToggle
                  value={status}
                  options={REQUEST_STATUS_OPTIONS}
                  onChange={onStatusChange}
                />
              </div>
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
                placeholder="Rechercher un sponsor, entreprise, email, formation..."
                className="border-wl-border bg-white pl-9 text-wl-text placeholder:text-wl-text-tertiary"
              />
            </label>

            <label className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
              <select
                value={programFilter}
                onChange={(event) => onProgramFilter(event.target.value)}
                className="h-9 w-full rounded-md border border-wl-border bg-white pl-9 pr-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20"
              >
                <option value="all">Tous les programmes</option>
                {programOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative">
              <FolderKanban className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
              <select
                value={formationFilter}
                onChange={(event) => onFormationFilter(event.target.value)}
                disabled={!formationOptions.length}
                className="h-9 w-full rounded-md border border-wl-border bg-white pl-9 pr-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20 disabled:cursor-not-allowed disabled:bg-wl-gray-light disabled:text-wl-text-tertiary"
              >
                {formationOptions.length ? (
                  <>
                    <option value="all">Toutes les formations</option>
                    {formationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="all">Aucune formation</option>
                )}
              </select>
            </label>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <label className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => onDateFrom(event.target.value)}
                aria-label="Date de début"
                className="border-wl-border bg-white pl-9 text-wl-text"
              />
            </label>

            <label className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => onDateTo(event.target.value)}
                aria-label="Date de fin"
                className="border-wl-border bg-white pl-9 text-wl-text"
              />
            </label>

            <Button
              type="button"
              variant="outline"
              onClick={() => onLast24h(!last24h)}
              aria-pressed={last24h}
              className={
                last24h
                  ? "border-wl-blue bg-wl-blue text-white hover:bg-wl-blue-dark hover:text-white"
                  : neutralActionButtonClass
              }
            >
              <Clock className="h-4 w-4" />
              Dernières 24h
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onResetFilters}
              className={neutralActionButtonClass}
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-wl-border text-sm">
              <thead>
                <tr className="text-left text-wl-text-secondary">
                  <th className="py-3 pr-4 font-medium">Sponsor</th>
                  <th className="py-3 pr-4 font-medium">Rôle</th>
                  <th className="py-3 pr-4 font-medium">Contact</th>
                  <th className="py-3 pr-4 font-medium">Programme</th>
                  <th className="py-3 pr-4 font-medium">
                    Formations sponsorisées
                  </th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wl-border">
                {rows.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-wl-text">
                        {item.prenom} {item.nom}
                      </p>
                      <p className="text-xs text-wl-text-secondary">
                        {item.entreprise}
                      </p>
                      {status === "treated" && item.treatedBy ? (
                        <p className="mt-1 text-xs text-wl-text-tertiary">
                          Traite par {item.treatedBy}
                        </p>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 text-wl-text-secondary">
                      {item.role || "—"}
                    </td>
                    <td className="py-3 pr-4 text-wl-text-secondary">
                      <p>{item.email}</p>
                      <p>{item.telephone}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant="outline"
                        className="border-wl-border bg-wl-gray-light text-wl-text-secondary"
                      >
                        {sponsorProgramLabel(item.program)}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex max-w-md flex-wrap gap-1.5">
                        {item.formations.length ? (
                          item.formations.map((formation, index) => (
                            <Badge
                              key={`${formation.slug ?? formation.name}-${index}`}
                              variant="outline"
                              className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                            >
                              {formation.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-wl-text-tertiary">
                            {item.program === "fnpi"
                              ? "Contact seul"
                              : "Aucune formation"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-wl-text-secondary">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          className={neutralActionButtonClass}
                          onClick={() => onView(item)}
                        >
                          <Eye className="h-4 w-4" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          className="bg-wl-orange text-white hover:bg-wl-orange-dark"
                          onClick={() => onContact(item.email)}
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                        {status === "new" ? (
                          <Button
                            size="sm"
                            className="bg-wl-blue text-white hover:bg-wl-blue-dark"
                            onClick={() => onMarkTreated(item.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Marquer comme traité
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className={neutralActionButtonClass}
                            onClick={() => onUnmarkTreated(item.id)}
                          >
                            <Undo2 className="h-4 w-4" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!rows.length ? (
            <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
              Aucun sponsor pour le moment.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
