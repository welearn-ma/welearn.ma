"use client";

import { DashboardActivityList } from "../dashboard/dashboard-activity-list";
import { DashboardFormationCandidatesModal } from "../dashboard/dashboard-formation-candidates-modal";
import { DashboardFormationsGrid } from "../dashboard/dashboard-formations-grid";
import { DashboardInscriptionsTable } from "../dashboard/dashboard-inscriptions-table";
import { DashboardRequestModal } from "../dashboard/dashboard-request-modal";
import { DashboardSessionHeader } from "../dashboard/dashboard-session-header";
import { DashboardSidebar } from "../dashboard/dashboard-sidebar";
import { DashboardViewShell } from "../dashboard/dashboard-view-shell";
import { exportCsv } from "../dashboard/dashboard-utils";
import { useAdminDashboardController } from "./use-admin-dashboard-controller";

export function AdminDashboard({
  adminEmail,
  accessToken,
}: {
  adminEmail?: string;
  accessToken: string;
}) {
  const controller = useAdminDashboardController(accessToken);

  return (
    <div className="min-h-screen bg-wl-gray-light pt-10 pb-4">
      <div className="grid w-full gap-6 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <DashboardSidebar
          view={controller.view}
          onViewChange={controller.handleViewChange}
          totalRows={controller.totalRows}
          last24h={controller.last24h}
        />

        <div className="space-y-6">
          <DashboardSessionHeader
            adminEmail={adminEmail}
            onLogout={controller.handleLogout}
          />

          {controller.notice ? (
            <div className="rounded-xl border border-wl-orange/30 bg-wl-orange-tint px-4 py-3 text-sm text-wl-text-secondary">
              {controller.notice}
            </div>
          ) : null}

          {controller.view === "inscriptions" ? (
            <DashboardViewShell
              title="Demandes d'inscription"
              subtitle="Vue operationnelle des leads entrants par formation"
              search={controller.search}
              onSearch={controller.setSearch}
              dateFilter={controller.dateFilter}
              onDateFilter={controller.setDateFilter}
              formationFilter={controller.formationFilter}
              onFormationFilter={controller.setFormationFilter}
              formationOptions={controller.formationOptions}
              onRefresh={() => void controller.refreshData()}
              onExport={() => exportCsv(controller.filteredRows)}
            >
              <DashboardInscriptionsTable
                rows={controller.filteredRows}
                onView={controller.handleViewRequest}
                onContact={controller.handleContact}
              />
            </DashboardViewShell>
          ) : null}

          {controller.view === "formations" ? (
            <DashboardViewShell
              title="Performance par formation"
              subtitle="Vision consolidee des inscriptions par programme"
              search={controller.search}
              onSearch={controller.setSearch}
              dateFilter={controller.dateFilter}
              onDateFilter={controller.setDateFilter}
              formationFilter={controller.formationFilter}
              onFormationFilter={controller.setFormationFilter}
              formationOptions={controller.formationOptions}
              onRefresh={() => void controller.refreshData()}
              onExport={() => exportCsv(controller.filteredRows)}
            >
              <DashboardFormationsGrid
                rows={controller.groupedByFormation}
                onSelectFormation={controller.handleSelectFormation}
              />
            </DashboardViewShell>
          ) : null}

          {controller.view === "activite" ? (
            <DashboardViewShell
              title="Flux d'activite"
              subtitle="Chronologie des demandes et signaux commerciaux"
              search={controller.search}
              onSearch={controller.setSearch}
              dateFilter={controller.dateFilter}
              onDateFilter={controller.setDateFilter}
              formationFilter={controller.formationFilter}
              onFormationFilter={controller.setFormationFilter}
              formationOptions={controller.formationOptions}
              onRefresh={() => void controller.refreshData()}
              onExport={() => exportCsv(controller.filteredRows)}
            >
              <DashboardActivityList rows={controller.filteredRows} />
            </DashboardViewShell>
          ) : null}

          {controller.loading ? (
            <p className="text-sm text-wl-text-secondary">
              Chargement du dashboard...
            </p>
          ) : null}

          {controller.selectedRequest ? (
            <DashboardRequestModal
              selectedRequest={controller.selectedRequest}
              onClose={() => controller.setSelectedRequest(null)}
              onContact={controller.handleContact}
            />
          ) : null}

          {controller.selectedFormationTitle ? (
            <DashboardFormationCandidatesModal
              formationTitle={controller.selectedFormationTitle}
              rows={controller.selectedFormationRows}
              onClose={controller.closeFormationModal}
              onView={controller.handleViewRequest}
              onContact={controller.handleContact}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
