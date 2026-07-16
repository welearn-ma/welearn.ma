import type { AdminRegistrationRecord } from "@/types/admin-registration";
import type { AdminSponsorRecord } from "@/types/sponsor";

export const neutralActionButtonClass =
  "border-wl-border text-wl-text-secondary transition-colors hover:border-wl-blue/30 hover:bg-wl-blue-tint hover:text-wl-blue";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Casablanca",
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

export function exportCsv(rows: AdminRegistrationRecord[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function toSponsorsCsv(rows: AdminSponsorRecord[]) {
  const header = [
    "id",
    "nom",
    "prenom",
    "entreprise",
    "role",
    "email",
    "telephone",
    "formationSlugs",
    "formationNames",
    "createdAt",
  ];

  const lines = rows.map((item) =>
    [
      item.id,
      item.nom,
      item.prenom,
      item.entreprise,
      item.role || "",
      item.email,
      item.telephone,
      item.formations.map((formation) => formation.slug ?? "").join(" | "),
      item.formations.map((formation) => formation.name).join(" | "),
      item.createdAt,
    ]
      .map((field) => `"${String(field).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export function exportSponsorsCsv(rows: AdminSponsorRecord[]) {
  const blob = new Blob([toSponsorsCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sponsors-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
