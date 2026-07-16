import { Download, Eye, Filter, Mail, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminSponsorRecord } from "@/types/sponsor";
import { formatDate, neutralActionButtonClass } from "./dashboard-utils";

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-wl-border bg-wl-gray-light px-4 py-3">
      <p className="text-2xl font-semibold text-wl-blue">{value}</p>
      <p className="mt-0.5 text-xs text-wl-text-secondary">{label}</p>
    </div>
  );
}

export function DashboardSponsorsView({
  rows,
  search,
  onSearch,
  programFilter,
  onProgramFilter,
  programOptions,
  onRefresh,
  onExport,
  onView,
  onContact,
}: {
  rows: AdminSponsorRecord[];
  search: string;
  onSearch: (value: string) => void;
  programFilter: string;
  onProgramFilter: (value: string) => void;
  programOptions: Array<{ value: string; label: string }>;
  onRefresh: () => void;
  onExport: () => void;
  onView: (sponsor: AdminSponsorRecord) => void;
  onContact: (email: string) => void;
}) {
  const totalMoocs = rows.reduce(
    (sum, item) => sum + item.formations.length,
    0,
  );
  const uniqueCompanies = new Set(
    rows.map((item) => item.entreprise.trim().toLowerCase()),
  ).size;

  return (
    <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
      <div className="border-b border-wl-border p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-wl-text">Sponsors</h2>
            <p className="mt-1 text-sm text-wl-text-secondary">
              Organisations souhaitant parrainer un ou plusieurs MOOCs
            </p>
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

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatTile label="Sponsors" value={rows.length} />
          <StatTile label="MOOCs parrainés" value={totalMoocs} />
          <StatTile label="Entreprises" value={uniqueCompanies} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
            <Input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Rechercher un sponsor, entreprise, email, MOOC..."
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
                <th className="py-3 pr-4 font-medium">MOOCs sponsorisés</th>
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
                  </td>
                  <td className="py-3 pr-4 text-wl-text-secondary">
                    {item.role || "—"}
                  </td>
                  <td className="py-3 pr-4 text-wl-text-secondary">
                    <p>{item.email}</p>
                    <p>{item.telephone}</p>
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
                          Aucun MOOC
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
  );
}
