import type {
  AdminRegistrationListResponse,
  AdminRegistrationRecord,
} from "@/types/admin-registration";

export async function getAdminRegistrations(): Promise<
  AdminRegistrationRecord[]
> {
  accessToken: string,
): Promise<AdminRegistrationRecord[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  if (!accessToken.trim()) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/registrations?limit=500`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Impossible de joindre l'API admin (reseau/CORS).");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Impossible de charger les demandes d'inscription.");
  }

  const payload = (await response.json()) as AdminRegistrationListResponse;

  if (!payload.success) {
    throw new Error(payload.message || "Erreur de chargement des demandes.");
  }

  return payload.data;
}
