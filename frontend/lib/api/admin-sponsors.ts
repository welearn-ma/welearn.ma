import type {
  AdminSponsorListResponse,
  AdminSponsorRecord,
  UpdateSponsorTreatedResponse,
} from "@/types/sponsor";
import type { RequestStatus } from "@/components/admin/dashboard/dashboard-types";

export async function getAdminSponsors(
  accessToken: string,
  status: RequestStatus = "new",
): Promise<AdminSponsorRecord[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  if (!accessToken.trim()) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  let response: Response;

  try {
    response = await fetch(
      `${baseUrl}/api/admin/sponsors?limit=500&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new Error("Impossible de joindre l'API admin (reseau/CORS).");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Impossible de charger les sponsors.");
  }

  const payload = (await response.json()) as AdminSponsorListResponse;

  if (!payload.success) {
    throw new Error(payload.message || "Erreur de chargement des sponsors.");
  }

  return payload.data;
}

export async function updateSponsorTreated(
  accessToken: string,
  id: string,
  treated: boolean,
  note?: string,
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  if (!accessToken.trim()) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/admin/sponsors/${id}/treated`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(treated ? { treated, note } : { treated }),
    });
  } catch {
    throw new Error("Impossible de joindre l'API admin (reseau/CORS).");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  const payload = (await response.json()) as UpdateSponsorTreatedResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Impossible de mettre a jour le statut.");
  }
}
