import type {
  AdminRegistrationListResponse,
  AdminRegistrationRecord,
} from "@/types/admin-registration";

export async function getAdminRegistrations(): Promise<
  AdminRegistrationRecord[]
> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${baseUrl}/api/registrations?limit=500`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les demandes d'inscription.");
  }

  const payload = (await response.json()) as AdminRegistrationListResponse;

  if (!payload.success) {
    throw new Error(payload.message || "Erreur de chargement des demandes.");
  }

  return payload.data;
}
