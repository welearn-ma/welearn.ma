"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminRegistrations } from "@/lib/api/admin-registrations";
import { getAdminSponsors } from "@/lib/api/admin-sponsors";
import { clearAdminSessionStorage } from "@/lib/admin-session-storage";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import type { AdminSponsorRecord } from "@/types/sponsor";
import type {
  AdminView,
  DateFilter,
  FormationSummary,
} from "../dashboard/dashboard-types";

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

  const sponsorProgramOptions = useMemo(
    () =>
      Array.from(new Set(sponsorRows.flatMap((item) => item.moocs))).sort(),
    [sponsorRows],
  );

  const filteredSponsors = useMemo(() => {
    const needle = sponsorSearch.trim().toLowerCase();

    return sponsorRows.filter((item) => {
      if (
        sponsorProgramFilter !== "all" &&
        !item.moocs.includes(sponsorProgramFilter)
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
        (item.role ?? "").toLowerCase().includes(needle) ||
        item.moocs.some((mooc) => mooc.toLowerCase().includes(needle))
      );
    });
  }, [sponsorRows, sponsorSearch, sponsorProgramFilter]);

  const activeRows: Array<{ createdAt: string }> =
    view === "sponsors" ? filteredSponsors : filteredRows;
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

  const handleViewChange = (nextView: AdminView) => {
    setView(nextView);
    setSearch("");
    setDateFilter("30d");
    setFormationFilter("all");
    setSelectedFormationTitle(null);
    setSelectedRequest(null);
    setSponsorSearch("");
    setSponsorProgramFilter("all");
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
    setSponsorProgramFilter,
    sponsorProgramOptions,
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
