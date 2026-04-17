"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Eye,
  Filter,
  FolderKanban,
  Inbox,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAdminRegistrations } from "@/lib/api/admin-registrations";
import type { AdminRegistrationRecord } from "@/types/admin-registration";

type AdminView = "inscriptions" | "formations" | "activite";
type DateFilter = "all" | "7d" | "30d" | "90d";

type ViewConfig = {
  id: AdminView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const viewConfig: ViewConfig[] = [
  { id: "inscriptions", label: "Inscriptions", icon: Inbox },
  { id: "formations", label: "Par formation", icon: FolderKanban },
  { id: "activite", label: "Activite", icon: Activity },
];

const neutralActionButtonClass =
  "border-wl-border text-wl-text-secondary transition-colors hover:border-wl-blue/30 hover:bg-wl-blue-tint hover:text-wl-blue";

const mockRegistrations: AdminRegistrationRecord[] = [
  {
    id: "demo-1",
    fullName: "Salma Bennani",
    email: "salma.bennani@exemple.ma",
    phone: "+212 6 12 34 56 78",
    company: "Atlas Build",
    position: "Chef de projet",
    message: "Interessee par la prochaine cohorte et les pre-requis.",
    formationSlug: "mastere-bim",
    formationTitle: "Mastere Specialise BIM & ses Applications",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "demo-2",
    fullName: "Youssef El Idrissi",
    email: "y.elidrissi@exemple.ma",
    phone: "+212 6 98 76 54 32",
    company: "ImmoNova",
    position: "Asset Manager",
    message: "Je souhaite recevoir le programme detaille.",
    formationSlug: "master-immobilier",
    formationTitle: "Executive Master en Ingenierie Immobiliere",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "demo-3",
    fullName: "Hind Lahrach",
    email: "hind.lahrach@exemple.ma",
    phone: "+212 6 55 44 33 22",
    company: "Cabinet HLP",
    position: "Ingenieure BIM",
    message: "Disponibilites weekend ?",
    formationSlug: "mastere-bim",
    formationTitle: "Mastere Specialise BIM & ses Applications",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toCsv(rows: AdminRegistrationRecord[]) {
  const header = [
    "id",
    "fullName",
    "email",
    "phone",
    "company",
    "position",
    "formationSlug",
    "formationTitle",
    "createdAt",
  ];

  const lines = rows.map((item) =>
    [
      item.id,
      item.fullName,
      item.email,
      item.phone,
      item.company || "",
      item.position || "",
      item.formationSlug,
      item.formationTitle,
      item.createdAt,
    ]
      .map((field) => `"${String(field).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

function exportCsv(rows: AdminRegistrationRecord[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ViewShell({
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

export function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [view, setView] = useState<AdminView>("inscriptions");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [formationFilter, setFormationFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [rows, setRows] =
    useState<AdminRegistrationRecord[]>(mockRegistrations);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRegistrationRecord | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const data = await getAdminRegistrations();
      setRows(data);
      if (!data.length) {
        setNotice("Aucune inscription pour le moment.");
      }
    } catch {
      setRows(mockRegistrations);
      setNotice(
        "API indisponible: affichage de donnees de demonstration pour le dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  const formationOptions = useMemo(
    () => Array.from(new Set(rows.map((item) => item.formationTitle))).sort(),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const now = Date.now();

    return rows.filter((item) => {
      if (
        formationFilter !== "all" &&
        item.formationTitle !== formationFilter
      ) {
        return false;
      }

      if (dateFilter !== "all") {
        const createdAt = new Date(item.createdAt).getTime();
        const maxAgeMs =
          dateFilter === "7d"
            ? 7 * 24 * 60 * 60 * 1000
            : dateFilter === "30d"
              ? 30 * 24 * 60 * 60 * 1000
              : 90 * 24 * 60 * 60 * 1000;

        if (now - createdAt > maxAgeMs) {
          return false;
        }
      }

      if (!search.trim()) {
        return true;
      }

      const needle = search.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(needle) ||
        item.email.toLowerCase().includes(needle) ||
        item.formationTitle.toLowerCase().includes(needle)
      );
    });
  }, [rows, formationFilter, dateFilter, search]);

  const groupedByFormation = useMemo(() => {
    const map = new Map<
      string,
      { count: number; latest: string; companies: Set<string> }
    >();

    for (const item of filteredRows) {
      const existing = map.get(item.formationTitle);

      if (!existing) {
        map.set(item.formationTitle, {
          count: 1,
          latest: item.createdAt,
          companies: new Set(item.company ? [item.company] : []),
        });
        continue;
      }

      existing.count += 1;
      if (new Date(item.createdAt) > new Date(existing.latest)) {
        existing.latest = item.createdAt;
      }
      if (item.company) {
        existing.companies.add(item.company);
      }
    }

    return Array.from(map.entries())
      .map(([title, value]) => ({
        title,
        count: value.count,
        latest: value.latest,
        companiesCount: value.companies.size,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRows]);

  const totalRows = filteredRows.length;
  const last24h = filteredRows.filter(
    (item) =>
      Date.now() - new Date(item.createdAt).getTime() <= 24 * 60 * 60 * 1000,
  ).length;

  return (
    <div className="min-h-screen bg-wl-gray-light pt-10 pb-4">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-wl-border bg-white p-4 shadow-sm">
          <div className="mb-5 rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-4">
            <p className="text-xs uppercase tracking-wide text-wl-blue">
              Admin
            </p>
            <h1 className="mt-1 text-lg font-semibold text-wl-text">
              Tracking Inscriptions
            </h1>
          </div>

          <nav className="space-y-1">
            {viewConfig.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === view;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-wl-blue text-white"
                      : "text-wl-text-secondary hover:bg-wl-gray-light"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 space-y-2 rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-wl-text-secondary">Total filtre</span>
              <strong className="text-wl-text">{totalRows}</strong>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-wl-text-secondary">Dernieres 24h</span>
              <strong className="text-wl-text">{last24h}</strong>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="rounded-2xl border border-wl-border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-wl-blue-tint p-2 text-wl-blue">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-wl-text-tertiary">
                    Session admin
                  </p>
                  <p className="text-sm font-medium text-wl-text">
                    {adminEmail}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  className={neutralActionButtonClass}
                >
                  <a href="/admin/logout">
                    <LogOut className="h-4 w-4" />
                    Se deconnecter
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {notice ? (
            <div className="rounded-xl border border-wl-orange/30 bg-wl-orange-tint px-4 py-3 text-sm text-wl-text-secondary">
              {notice}
            </div>
          ) : null}

          {view === "inscriptions" ? (
            <ViewShell
              title="Demandes d'inscription"
              subtitle="Vue operationnelle des leads entrants par formation"
              search={search}
              onSearch={setSearch}
              dateFilter={dateFilter}
              onDateFilter={setDateFilter}
              formationFilter={formationFilter}
              onFormationFilter={setFormationFilter}
              formationOptions={formationOptions}
              onRefresh={() => void refreshData()}
              onExport={() => exportCsv(filteredRows)}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-wl-border text-sm">
                  <thead>
                    <tr className="text-left text-wl-text-secondary">
                      <th className="py-3 pr-4 font-medium">Demandeur</th>
                      <th className="py-3 pr-4 font-medium">Formation</th>
                      <th className="py-3 pr-4 font-medium">Contact</th>
                      <th className="py-3 pr-4 font-medium">Date</th>
                      <th className="py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wl-border">
                    {filteredRows.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-wl-text">
                            {item.fullName}
                          </p>
                          <p className="text-xs text-wl-text-secondary">
                            {item.company || "Entreprise non renseignee"}
                          </p>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant="outline"
                            className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                          >
                            {item.formationTitle}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-wl-text-secondary">
                          <p>{item.email}</p>
                          <p>{item.phone}</p>
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
                              onClick={() => setSelectedRequest(item)}
                            >
                              <Eye className="h-4 w-4" />
                              Voir
                            </Button>
                            <Button
                              size="sm"
                              className="bg-wl-orange text-white hover:bg-wl-orange-dark"
                              onClick={() =>
                                window.open(
                                  `mailto:${encodeURIComponent(item.email)}`,
                                )
                              }
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

              {!filteredRows.length ? (
                <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
                  Aucun resultat avec les filtres actuels.
                </div>
              ) : null}
            </ViewShell>
          ) : null}

          {view === "formations" ? (
            <ViewShell
              title="Performance par formation"
              subtitle="Vision consolidee des inscriptions par programme"
              search={search}
              onSearch={setSearch}
              dateFilter={dateFilter}
              onDateFilter={setDateFilter}
              formationFilter={formationFilter}
              onFormationFilter={setFormationFilter}
              formationOptions={formationOptions}
              onRefresh={() => void refreshData()}
              onExport={() => exportCsv(filteredRows)}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groupedByFormation.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-wl-border bg-white p-4"
                  >
                    <p className="text-sm text-wl-text-secondary">Formation</p>
                    <h3 className="mt-1 text-base font-semibold text-wl-text">
                      {item.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-wl-text-secondary">
                          Inscriptions
                        </p>
                        <p className="text-2xl font-semibold text-wl-blue">
                          {item.count}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-wl-text-secondary">
                          Entreprises
                        </p>
                        <p className="text-right text-lg font-medium text-wl-text">
                          {item.companiesCount}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-wl-text-secondary">
                      Derniere demande: {formatDate(item.latest)}
                    </p>
                  </article>
                ))}
              </div>

              {!groupedByFormation.length ? (
                <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
                  Aucune formation a afficher avec les filtres actifs.
                </div>
              ) : null}
            </ViewShell>
          ) : null}

          {view === "activite" ? (
            <ViewShell
              title="Flux d'activite"
              subtitle="Chronologie des demandes et signaux commerciaux"
              search={search}
              onSearch={setSearch}
              dateFilter={dateFilter}
              onDateFilter={setDateFilter}
              formationFilter={formationFilter}
              onFormationFilter={setFormationFilter}
              formationOptions={formationOptions}
              onRefresh={() => void refreshData()}
              onExport={() => exportCsv(filteredRows)}
            >
              <ul className="space-y-4">
                {filteredRows.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-wl-border bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-wl-orange/30 bg-wl-orange-tint text-wl-orange"
                      >
                        <Users className="h-3 w-3" />
                        Nouvelle inscription
                      </Badge>
                      <span className="text-xs text-wl-text-secondary">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-wl-text">
                      <strong>{item.fullName}</strong> a demande des
                      informations sur <strong>{item.formationTitle}</strong>.
                    </p>
                  </li>
                ))}
              </ul>

              {!filteredRows.length ? (
                <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
                  Aucun evenement a afficher pour cette periode.
                </div>
              ) : null}
            </ViewShell>
          ) : null}

          {loading ? (
            <p className="text-sm text-wl-text-secondary">
              Chargement du dashboard...
            </p>
          ) : null}

          {selectedRequest ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
              onClick={() => setSelectedRequest(null)}
            >
              <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-wl-border bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Details de la demande"
              >
                <div className="flex items-center justify-between border-b border-wl-border p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-wl-text-tertiary">
                      Demande d'inscription
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-wl-text">
                      {selectedRequest.fullName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-wl-text-secondary transition-colors hover:bg-wl-gray-light"
                    onClick={() => setSelectedRequest(null)}
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
                    <p className="text-xs text-wl-text-tertiary">Email</p>
                    <p className="mt-1 text-sm text-wl-text">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
                    <p className="text-xs text-wl-text-tertiary">Telephone</p>
                    <p className="mt-1 text-sm text-wl-text">
                      {selectedRequest.phone}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
                    <p className="text-xs text-wl-text-tertiary">Entreprise</p>
                    <p className="mt-1 text-sm text-wl-text">
                      {selectedRequest.company || "Non renseignee"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
                    <p className="text-xs text-wl-text-tertiary">Poste</p>
                    <p className="mt-1 text-sm text-wl-text">
                      {selectedRequest.position || "Non renseigne"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
                    <p className="text-xs text-wl-text-tertiary">Formation</p>
                    <p className="mt-1 text-sm text-wl-text">
                      {selectedRequest.formationTitle}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
                    <p className="text-xs text-wl-text-tertiary">
                      Date de soumission
                    </p>
                    <p className="mt-1 text-sm text-wl-text">
                      {formatDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
                    <p className="text-xs text-wl-text-tertiary">Message</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-wl-text">
                      {selectedRequest.message || "Aucun message saisi."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-wl-border p-5">
                  <Button
                    variant="outline"
                    className={neutralActionButtonClass}
                    onClick={() => setSelectedRequest(null)}
                  >
                    Fermer
                  </Button>
                  <Button
                    className="bg-wl-orange text-white hover:bg-wl-orange-dark"
                    onClick={() =>
                      window.open(
                        `mailto:${encodeURIComponent(selectedRequest.email)}`,
                      )
                    }
                  >
                    <Mail className="h-4 w-4" />
                    Contacter
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
