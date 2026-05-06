"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminRegistrations } from "@/lib/api/admin-registrations";
import { clearAdminSessionStorage } from "@/lib/admin-session-storage";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import { DashboardActivityList } from "./dashboard/dashboard-activity-list";
import { DashboardFormationCandidatesModal } from "./dashboard/dashboard-formation-candidates-modal";
import { DashboardFormationsGrid } from "./dashboard/dashboard-formations-grid";
import { DashboardInscriptionsTable } from "./dashboard/dashboard-inscriptions-table";
import { DashboardRequestModal } from "./dashboard/dashboard-request-modal";
import { DashboardSessionHeader } from "./dashboard/dashboard-session-header";
import { DashboardSidebar } from "./dashboard/dashboard-sidebar";
import { DashboardViewShell } from "./dashboard/dashboard-view-shell";
import type {
  AdminView,
  DateFilter,
  FormationSummary,
} from "./dashboard/dashboard-types";
import { exportCsv } from "./dashboard/dashboard-utils";

export function AdminDashboard({
  adminEmail,
  accessToken,
}: {
  adminEmail?: string;
  accessToken: string;
}) {
  const router = useRouter();
  const [view, setView] = useState<AdminView>("inscriptions");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [formationFilter, setFormationFilter] = useState("all");
  const [selectedFormationTitle, setSelectedFormationTitle] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminRegistrationRecord[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRegistrationRecord | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const data = await getAdminRegistrations(accessToken);
      setRows(data);
      if (!data.length) {
        setNotice("Aucune inscription pour le moment.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        clearAdminSessionStorage();
        router.replace("/admin/login");
        return;
      }

      setRows([]);
      setNotice(message || "Impossible de charger les donnees admin.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, router]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

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

  const groupedByFormation = useMemo<FormationSummary[]>(() => {
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

  const selectedFormationRows = useMemo(() => {
    if (!selectedFormationTitle) {
      return [];
    }

    return rows.filter(
      (item) => item.formationTitle === selectedFormationTitle,
    );
  }, [rows, selectedFormationTitle]);

  const totalRows = filteredRows.length;
  const last24h = filteredRows.filter(
    (item) =>
      Date.now() - new Date(item.createdAt).getTime() <= 24 * 60 * 60 * 1000,
  ).length;

  const handleLogout = () => {
    clearAdminSessionStorage();
    router.replace("/admin/login");
  };

  const handleContact = (email: string) => {
    window.open(`mailto:${encodeURIComponent(email)}`);
  };

  const handleViewChange = (nextView: AdminView) => {
    setView(nextView);
    setSearch("");
    setDateFilter("30d");
    setFormationFilter("all");
    setSelectedFormationTitle(null);
    setSelectedRequest(null);
  };

  const handleViewRequest = (record: AdminRegistrationRecord) => {
    setSelectedFormationTitle(null);
    setSelectedRequest(record);
  };

  const handleSelectFormation = (formationTitle: string) => {
    setSelectedFormationTitle(formationTitle);
  };

  return (
    <div className="min-h-screen bg-wl-gray-light pt-10 pb-4">
      <div className="grid w-full gap-6 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <DashboardSidebar
          view={view}
          onViewChange={handleViewChange}
          totalRows={totalRows}
          last24h={last24h}
        />

        <div className="space-y-6">
          <DashboardSessionHeader
            adminEmail={adminEmail}
            onLogout={handleLogout}
          />

          {notice ? (
            <div className="rounded-xl border border-wl-orange/30 bg-wl-orange-tint px-4 py-3 text-sm text-wl-text-secondary">
              {notice}
            </div>
          ) : null}

          {view === "inscriptions" ? (
            <DashboardViewShell
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
              <DashboardInscriptionsTable
                rows={filteredRows}
                onView={handleViewRequest}
                onContact={handleContact}
              />
            </DashboardViewShell>
          ) : null}

          {view === "formations" ? (
            <DashboardViewShell
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
              <DashboardFormationsGrid
                rows={groupedByFormation}
                onSelectFormation={handleSelectFormation}
              />
            </DashboardViewShell>
          ) : null}

          {view === "activite" ? (
            <DashboardViewShell
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
              <DashboardActivityList rows={filteredRows} />
            </DashboardViewShell>
          ) : null}

          {loading ? (
            <p className="text-sm text-wl-text-secondary">
              Chargement du dashboard...
            </p>
          ) : null}

          {selectedRequest ? (
            <DashboardRequestModal
              selectedRequest={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              onContact={handleContact}
            />
          ) : null}

          {selectedFormationTitle ? (
            <DashboardFormationCandidatesModal
              formationTitle={selectedFormationTitle}
              rows={selectedFormationRows}
              onClose={() => setSelectedFormationTitle(null)}
              onView={handleViewRequest}
              onContact={handleContact}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
