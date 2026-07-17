"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminRegistrations } from "@/lib/api/admin-registrations";
import { getAdminSponsors } from "@/lib/api/admin-sponsors";
import { clearAdminSessionStorage } from "@/lib/admin-session-storage";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import type { AdminSponsorRecord } from "@/types/sponsor";
import type {
  ActivityItem,
  AdminView,
  DateFilter,
  FormationSummary,
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
  const [rows, setRows] = useState<AdminRegistrationRecord[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminRegistrationRecord | null>(null);
  const [sponsorRows, setSponsorRows] = useState<AdminSponsorRecord[]>([]);
  const [sponsorSearch, setSponsorSearch] = useState("");
  const [sponsorProgramFilter, setSponsorProgramFilter] = useState("all");
  const [sponsorFormationFilter, setSponsorFormationFilter] = useState("all");
  const [sponsorDateFrom, setSponsorDateFrom] = useState("");
  const [sponsorDateTo, setSponsorDateTo] = useState("");
  const [sponsorLast24h, setSponsorLast24h] = useState(false);
  const [selectedSponsor, setSelectedSponsor] =
    useState<AdminSponsorRecord | null>(null);

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

  const refreshSponsors = useCallback(async () => {
    try {
      const data = await getAdminSponsors(accessToken);
      setSponsorRows(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "ADMIN_UNAUTHORIZED") {
        clearAdminSessionStorage();
        router.replace("/admin/login");
        return;
      }

      setSponsorRows([]);
    }
  }, [accessToken, router]);

  useEffect(() => {
    void refreshData();
    void refreshSponsors();
  }, [refreshData, refreshSponsors]);

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

  // Flux d'activite : agregation des tables sources (registration_requests
  // + sponsors) — il n'existe pas de table d'evenements dediee. Les
  // evenements sponsor respectent les memes filtres date/recherche/formation
  // que les inscriptions.
  const activityItems = useMemo<ActivityItem[]>(() => {
    const now = Date.now();
    const needle = search.trim().toLowerCase();
    const maxAgeMs =
      dateFilter === "all"
        ? null
        : dateFilter === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : dateFilter === "30d"
            ? 30 * 24 * 60 * 60 * 1000
            : 90 * 24 * 60 * 60 * 1000;

    const sponsorEvents: ActivityItem[] = sponsorRows
      .filter((item) => {
        if (
          formationFilter !== "all" &&
          !item.formations.some(
            (formation) => formation.name === formationFilter,
          )
        ) {
          return false;
        }

        if (
          maxAgeMs !== null &&
          now - new Date(item.createdAt).getTime() > maxAgeMs
        ) {
          return false;
        }

        if (!needle) {
          return true;
        }

        return (
          `${item.prenom} ${item.nom}`.toLowerCase().includes(needle) ||
          item.entreprise.toLowerCase().includes(needle) ||
          item.email.toLowerCase().includes(needle) ||
          item.formations.some((formation) =>
            formation.name.toLowerCase().includes(needle),
          )
        );
      })
      .map((record) => ({
        kind: "sponsor" as const,
        createdAt: record.createdAt,
        record,
      }));

    const registrationEvents: ActivityItem[] = filteredRows.map((record) => ({
      kind: "inscription" as const,
      createdAt: record.createdAt,
      record,
    }));

    return [...registrationEvents, ...sponsorEvents].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filteredRows, sponsorRows, search, dateFilter, formationFilter]);

  const activeRows: Array<{ createdAt: string }> =
    view === "sponsors"
      ? filteredSponsors
      : view === "activite"
        ? activityItems
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
    resetSponsorFilters();
    setSelectedSponsor(null);
  };

  const handleViewRequest = (record: AdminRegistrationRecord) => {
    setSelectedFormationTitle(null);
    setSelectedRequest(record);
  };

  const handleSelectFormation = (formationTitle: string) => {
    setSelectedFormationTitle(formationTitle);
  };

  return {
    view,
    search,
    dateFilter,
    formationFilter,
    loading,
    notice,
    formationOptions,
    filteredRows,
    filteredSponsors,
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
    activityItems,
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
    closeFormationModal: () => setSelectedFormationTitle(null),
  };
}
