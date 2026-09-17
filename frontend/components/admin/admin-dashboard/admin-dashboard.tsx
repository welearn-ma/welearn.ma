"use client";

import { DashboardActivityView } from "../dashboard/dashboard-activity-view";
import { DashboardFormationCandidatesModal } from "../dashboard/dashboard-formation-candidates-modal";
import { DashboardInscriptionsView } from "../dashboard/dashboard-inscriptions-view";
import { DashboardRequestModal } from "../dashboard/dashboard-request-modal";
import { DashboardSessionHeader } from "../dashboard/dashboard-session-header";
import { DashboardSidebar } from "../dashboard/dashboard-sidebar";
import { DashboardSponsorModal } from "../dashboard/dashboard-sponsor-modal";
import { DashboardSponsorsView } from "../dashboard/dashboard-sponsors-view";
import { exportCsv, exportSponsorsCsv } from "../dashboard/dashboard-utils";
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
            <DashboardInscriptionsView
              rows={controller.filteredRows}
              totals={controller.inscriptionsTotals}
              status={controller.registrationStatus}
              onStatusChange={controller.setRegistrationStatus}
              displayMode={controller.inscriptionsDisplayMode}
              onDisplayModeChange={controller.setInscriptionsDisplayMode}
              groupedByFormation={controller.groupedByFormation}
              onSelectFormation={controller.handleSelectFormation}
              search={controller.search}
              onSearch={controller.setSearch}
              dateFilter={controller.dateFilter}
              onDateFilter={controller.setDateFilter}
              formationFilter={controller.formationFilter}
              onFormationFilter={controller.setFormationFilter}
              formationOptions={controller.formationOptions}
              onRefresh={() => void controller.refreshData()}
              onExport={() => exportCsv(controller.filteredRows)}
              onView={controller.handleViewRequest}
              onContact={controller.handleContact}
              onMarkTreated={controller.handleMarkTreated}
              onUnmarkTreated={controller.handleUnmarkTreated}
            />
          ) : null}

          {controller.view === "activite" ? (
            <DashboardActivityView
              items={controller.activityRows}
              actorEmailFilter={controller.activityActorEmailFilter}
              onActorEmailFilter={controller.setActivityActorEmailFilter}
              onRefresh={() => void controller.refreshActivity()}
            />
          ) : null}

          {controller.view === "sponsors" ? (
            <DashboardSponsorsView
              rows={controller.filteredSponsors}
              totals={controller.sponsorTotals}
              status={controller.sponsorStatus}
              onStatusChange={controller.setSponsorStatus}
              search={controller.sponsorSearch}
              onSearch={controller.setSponsorSearch}
              programFilter={controller.sponsorProgramFilter}
              onProgramFilter={controller.setSponsorProgramFilter}
              programOptions={controller.sponsorProgramOptions}
              formationFilter={controller.sponsorFormationFilter}
              onFormationFilter={controller.setSponsorFormationFilter}
              formationOptions={controller.sponsorFormationOptions}
              dateFrom={controller.sponsorDateFrom}
              onDateFrom={controller.setSponsorDateFrom}
              dateTo={controller.sponsorDateTo}
              onDateTo={controller.setSponsorDateTo}
              last24h={controller.sponsorLast24h}
              onLast24h={controller.setSponsorLast24h}
              onResetFilters={controller.resetSponsorFilters}
              onRefresh={() => void controller.refreshSponsors()}
              onExport={() => exportSponsorsCsv(controller.filteredSponsors)}
              onView={controller.setSelectedSponsor}
              onContact={controller.handleContact}
              onMarkTreated={controller.handleMarkSponsorTreated}
              onUnmarkTreated={controller.handleUnmarkSponsorTreated}
            />
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
              onMarkTreated={controller.handleMarkTreated}
              onUnmarkTreated={controller.handleUnmarkTreated}
            />
          ) : null}

          {controller.selectedSponsor ? (
            <DashboardSponsorModal
              selectedSponsor={controller.selectedSponsor}
              onClose={() => controller.setSelectedSponsor(null)}
              onContact={controller.handleContact}
              onMarkTreated={controller.handleMarkSponsorTreated}
              onUnmarkTreated={controller.handleUnmarkSponsorTreated}
            />
          ) : null}

          {controller.selectedFormationTitle ? (
            <DashboardFormationCandidatesModal
              formationTitle={controller.selectedFormationTitle}
              rows={controller.selectedFormationRows}
              status={controller.registrationStatus}
              onClose={controller.closeFormationModal}
              onView={controller.handleViewRequest}
              onContact={controller.handleContact}
              onMarkTreated={controller.handleMarkTreated}
              onUnmarkTreated={controller.handleUnmarkTreated}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
