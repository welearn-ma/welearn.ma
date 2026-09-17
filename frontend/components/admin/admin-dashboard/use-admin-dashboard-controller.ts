"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminRegistrations,
  updateRegistrationTreated,
} from "@/lib/api/admin-registrations";
import {
  getAdminSponsors,
  updateSponsorTreated,
} from "@/lib/api/admin-sponsors";
import { getAdminActivity } from "@/lib/api/admin-activity";
import { clearAdminSessionStorage } from "@/lib/admin-session-storage";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import type { AdminSponsorRecord } from "@/types/sponsor";
import type { AdminActivityRecord } from "@/types/admin-activity";
import type {
  AdminView,
  DateFilter,
  FormationSummary,
  InscriptionsDisplayMode,
  RequestStatus,
} from "../dashboard/dashboard-types";
import { sponsorProgramLabel } from "../dashboard/dashboard-utils";

export function useAdminDashboardController(accessToken: string) {
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
  const [registrationStatus, setRegistrationStatus] =
    useState<RequestStatus>("new");
  const [inscriptionsDisplayMode, setInscriptionsDisplayMode] =
    useState<InscriptionsDisplayMode>("students");
  const [rows, setRows] = useState<AdminRegistrationRecord[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRegistrationRecord | null>(null);
  const [sponsorStatus, setSponsorStatus] = useState<RequestStatus>("new");
  const [sponsorRows, setSponsorRows] = useState<AdminSponsorRecord[]>([]);
  const [sponsorSearch, setSponsorSearch] = useState("");
  const [sponsorProgramFilter, setSponsorProgramFilter] = useState("all");
  const [sponsorFormationFilter, setSponsorFormationFilter] = useState("all");
  const [sponsorDateFrom, setSponsorDateFrom] = useState("");
  const [sponsorDateTo, setSponsorDateTo] = useState("");
  const [sponsorLast24h, setSponsorLast24h] = useState(false);
  const [selectedSponsor, setSelectedSponsor] =
    useState<AdminSponsorRecord | null>(null);
  const [activityRows, setActivityRows] = useState<AdminActivityRecord[]>([]);
  const [activityActorEmailFilter, setActivityActorEmailFilter] =
    useState("");

  const handleUnauthorized = useCallback(() => {
    clearAdminSessionStorage();
    router.replace("/admin/login");
  }, [router]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const data = await getAdminRegistrations(accessToken, registrationStatus);
      setRows(data);
      if (!data.length) {
        setNotice(
          registrationStatus === "new"
            ? "Aucune inscription pour le moment."
            : "Aucune inscription traitee pour le moment.",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        handleUnauthorized();
        return;
      }

      setRows([]);
      setNotice(message || "Impossible de charger les donnees admin.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, registrationStatus, handleUnauthorized]);

  const refreshSponsors = useCallback(async () => {
    try {
      const data = await getAdminSponsors(accessToken, sponsorStatus);
      setSponsorRows(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        handleUnauthorized();
        return;
      }

      setSponsorRows([]);
    }
  }, [accessToken, sponsorStatus, handleUnauthorized]);

  const refreshActivity = useCallback(async () => {
    try {
      const data = await getAdminActivity(accessToken, activityActorEmailFilter);
      setActivityRows(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        handleUnauthorized();
        return;
      }

      setActivityRows([]);
    }
  }, [accessToken, activityActorEmailFilter, handleUnauthorized]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    void refreshSponsors();
  }, [refreshSponsors]);

  useEffect(() => {
    void refreshActivity();
  }, [refreshActivity]);

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

  // Programmes reellement presents en donnees (sponsors.program) ; aucune
  // valeur codee en dur pour absorber les programmes futurs.
  const sponsorProgramOptions = useMemo(() => {
    const values = new Set<string>();
    for (const item of sponsorRows) {
      if (item.program) {
        values.add(item.program);
      }
    }
    return Array.from(values)
      .map((value) => ({
        value,
        label: sponsorProgramLabel(value as AdminSponsorRecord["program"]),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [sponsorRows]);

  // Options formation DEPENDANTES du programme selectionne : couples
  // slug (cle stable) / libelle canonique presents dans les donnees du
  // programme. Fallback sur le nom pour les lignes legacy sans slug.
  const sponsorFormationOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const item of sponsorRows) {
      if (
        sponsorProgramFilter !== "all" &&
        item.program !== sponsorProgramFilter
      ) {
        continue;
      }
      for (const formation of item.formations) {
        options.set(formation.slug ?? formation.name, formation.name);
      }
    }
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [sponsorRows, sponsorProgramFilter]);

  const filteredSponsors = useMemo(() => {
    const now = Date.now();
    const needle = sponsorSearch.trim().toLowerCase();
    const fromTime = sponsorDateFrom
      ? new Date(`${sponsorDateFrom}T00:00:00`).getTime()
      : null;
    const toTime = sponsorDateTo
      ? new Date(`${sponsorDateTo}T23:59:59.999`).getTime()
      : null;

    return sponsorRows.filter((item) => {
      if (
        sponsorProgramFilter !== "all" &&
        item.program !== sponsorProgramFilter
      ) {
        return false;
      }

      if (
        sponsorFormationFilter !== "all" &&
        !item.formations.some(
          (formation) =>
            (formation.slug ?? formation.name) === sponsorFormationFilter,
        )
      ) {
        return false;
      }

      const createdAt = new Date(item.createdAt).getTime();

      if (fromTime !== null && createdAt < fromTime) {
        return false;
      }

      if (toTime !== null && createdAt > toTime) {
        return false;
      }

      // Meme fenetre que le compteur "Dernieres 24h" de la sidebar.
      if (sponsorLast24h && now - createdAt > 24 * 60 * 60 * 1000) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        `${item.prenom} ${item.nom}`.toLowerCase().includes(needle) ||
        item.entreprise.toLowerCase().includes(needle) ||
        item.email.toLowerCase().includes(needle) ||
        (item.role ?? "").toLowerCase().includes(needle) ||
        item.formations.some((formation) =>
          formation.name.toLowerCase().includes(needle),
        )
      );
    });
  }, [
    sponsorRows,
    sponsorSearch,
    sponsorProgramFilter,
    sponsorFormationFilter,
    sponsorDateFrom,
    sponsorDateTo,
    sponsorLast24h,
  ]);

  // Totaux non filtres, affiches en regard des stats filtrees ("sur N").
  const sponsorTotals = useMemo(
    () => ({
      sponsors: sponsorRows.length,
      formations: sponsorRows.reduce(
        (sum, item) => sum + item.formations.length,
        0,
      ),
      entreprises: new Set(
        sponsorRows.map((item) => item.entreprise.trim().toLowerCase()),
      ).size,
    }),
    [sponsorRows],
  );

  const activeRows: Array<{ createdAt: string }> =
    view === "sponsors"
      ? filteredSponsors
      : view === "activite"
        ? activityRows
        : filteredRows;
  const totalRows = activeRows.length;
  const last24h = activeRows.filter(
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

  const resetSponsorFilters = () => {
    setSponsorSearch("");
    setSponsorProgramFilter("all");
    setSponsorFormationFilter("all");
    setSponsorDateFrom("");
    setSponsorDateTo("");
    setSponsorLast24h(false);
  };

  // Changer de programme reinitialise la formation : ses options dependent
  // du programme et la valeur courante peut ne plus exister.
  const handleSponsorProgramFilter = (value: string) => {
    setSponsorProgramFilter(value);
    setSponsorFormationFilter("all");
  };

  const handleViewChange = (nextView: AdminView) => {
    setView(nextView);
    setSearch("");
    setDateFilter("30d");
    setFormationFilter("all");
    setSelectedFormationTitle(null);
    setSelectedRequest(null);
    setRegistrationStatus("new");
    setInscriptionsDisplayMode("students");
    resetSponsorFilters();
    setSelectedSponsor(null);
    setSponsorStatus("new");
    setActivityActorEmailFilter("");
  };

  const handleViewRequest = (record: AdminRegistrationRecord) => {
    setSelectedFormationTitle(null);
    setSelectedRequest(record);
  };

  const handleSelectFormation = (formationTitle: string) => {
    setSelectedFormationTitle(formationTitle);
  };

  const setRegistrationTreated = async (id: string, treated: boolean) => {
    const previousRows = rows;
    setRows((current) => current.filter((item) => item.id !== id));

    try {
      await updateRegistrationTreated(accessToken, id, treated);
    } catch (error) {
      setRows(previousRows);
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        handleUnauthorized();
        return;
      }

      setNotice(message || "Impossible de mettre a jour le statut.");
    }
  };

  const handleMarkTreated = (id: string) => setRegistrationTreated(id, true);
  const handleUnmarkTreated = (id: string) => setRegistrationTreated(id, false);

  const setSponsorTreated = async (id: string, treated: boolean) => {
    const previousRows = sponsorRows;
    setSponsorRows((current) => current.filter((item) => item.id !== id));

    try {
      await updateSponsorTreated(accessToken, id, treated);
    } catch (error) {
      setSponsorRows(previousRows);
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        handleUnauthorized();
        return;
      }
    }
  };

  const handleMarkSponsorTreated = (id: string) => setSponsorTreated(id, true);
  const handleUnmarkSponsorTreated = (id: string) =>
    setSponsorTreated(id, false);

  return {
    view,
    search,
    dateFilter,
    formationFilter,
    loading,
    notice,
    registrationStatus,
    setRegistrationStatus,
    inscriptionsDisplayMode,
    setInscriptionsDisplayMode,
    formationOptions,
    filteredRows,
    filteredSponsors,
    sponsorStatus,
    setSponsorStatus,
    sponsorSearch,
    setSponsorSearch,
    sponsorProgramFilter,
    setSponsorProgramFilter: handleSponsorProgramFilter,
    sponsorProgramOptions,
    sponsorFormationFilter,
    setSponsorFormationFilter,
    sponsorFormationOptions,
    sponsorDateFrom,
    setSponsorDateFrom,
    sponsorDateTo,
    setSponsorDateTo,
    sponsorLast24h,
    setSponsorLast24h,
    resetSponsorFilters,
    sponsorTotals,
    activityRows,
    activityActorEmailFilter,
    setActivityActorEmailFilter,
    refreshActivity,
    selectedSponsor,
    setSelectedSponsor,
    refreshSponsors,
    groupedByFormation,
    selectedFormationTitle,
    selectedFormationRows,
    totalRows,
    last24h,
    selectedRequest,
    setSearch,
    setDateFilter,
    setFormationFilter,
    setSelectedRequest,
    refreshData,
    handleLogout,
    handleContact,
    handleViewChange,
    handleViewRequest,
    handleSelectFormation,
    handleMarkTreated,
    handleUnmarkTreated,
    handleMarkSponsorTreated,
    handleUnmarkSponsorTreated,
    closeFormationModal: () => setSelectedFormationTitle(null),
  };
}
