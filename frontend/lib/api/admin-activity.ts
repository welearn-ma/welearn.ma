import type {
  AdminActivityListResponse,
  AdminActivityRecord,
} from "@/types/admin-activity";

export async function getAdminActivity(
  accessToken: string,
  actorEmail?: string,
): Promise<AdminActivityRecord[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  if (!accessToken.trim()) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  const params = new URLSearchParams({ limit: "500" });
  if (actorEmail?.trim()) {
    params.set("actor_email", actorEmail.trim());
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/admin/activity?${params}`, {
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
    throw new Error("Impossible de charger le flux d'activite.");
  }

  const payload = (await response.json()) as AdminActivityListResponse;

  if (!payload.success) {
    throw new Error(payload.message || "Erreur de chargement de l'activite.");
  }

  return payload.data;
}
