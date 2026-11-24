import { getPaymentsApiBaseUrl } from "./payments";

/**
 * POST /api/students/proofs (multipart) — backend/src/commerce/studentProofs.ts.
 * Renvoie le message d'erreur du backend (déjà en français) si l'envoi est refusé.
 */
export async function submitStudentProof(
  form: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const baseUrl = getPaymentsApiBaseUrl();
  const fallback = "Une erreur est survenue. Merci de réessayer dans quelques minutes.";
  if (!baseUrl) {
    return { ok: false, message: fallback };
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/students/proofs`, { method: "POST", body: form });
  } catch {
    return { ok: false, message: fallback };
  }

  let body: { ok?: unknown; message?: unknown } | null = null;
  try {
    body = (await response.json()) as { ok?: unknown; message?: unknown };
  } catch {
    body = null;
  }
  if (response.ok && body?.ok === true) {
    return { ok: true };
  }
  return { ok: false, message: typeof body?.message === "string" ? body.message : fallback };
}
