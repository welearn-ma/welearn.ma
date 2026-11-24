import type {
  AdminCode,
  AdminStudentProof,
  ApproveProofResult,
  CodeKind,
  CreatedCode,
  ProofStatus,
} from "@/types/admin-commerce";

/**
 * API admin des justificatifs étudiants et des codes (/api/admin/...).
 * Meme conventions que les autres clients admin : "ADMIN_UNAUTHORIZED" sur
 * 401 / 403, sinon le message du backend.
 */

type Envelope<T> = { success: boolean; data?: T; message?: string };

async function adminRequest<T>(
  accessToken: string,
  path: string,
  fallbackMessage: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  if (!accessToken.trim()) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/admin${path}`, {
      method: init.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    throw new Error("Impossible de joindre l'API admin (reseau/CORS).");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }

  let payload: Envelope<T> | null = null;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || fallbackMessage);
  }
  return payload.data as T;
}

// --- Justificatifs étudiants -------------------------------------------------

export function listStudentProofs(
  accessToken: string,
  status: ProofStatus | "ALL",
): Promise<AdminStudentProof[]> {
  return adminRequest(
    accessToken,
    `/student-proofs?status=${status}`,
    "Impossible de charger les justificatifs.",
  );
}

export async function getStudentProofFileUrl(accessToken: string, id: string): Promise<string> {
  const data = await adminRequest<{ url: string }>(
    accessToken,
    `/student-proofs/${id}/file`,
    "Le document n'a pas pu être ouvert.",
  );
  return data.url;
}

export function approveStudentProof(accessToken: string, id: string): Promise<ApproveProofResult> {
  return adminRequest(accessToken, `/student-proofs/${id}/approve`, "La validation a échoué.", {
    method: "POST",
  });
}

export function rejectStudentProof(
  accessToken: string,
  id: string,
  reason: string,
): Promise<{ emailSent: boolean }> {
  return adminRequest(accessToken, `/student-proofs/${id}/reject`, "Le refus a échoué.", {
    method: "POST",
    body: { reason },
  });
}

export function resendStudentProofCode(accessToken: string, id: string): Promise<{ emailSent: boolean }> {
  return adminRequest(accessToken, `/student-proofs/${id}/resend`, "L'e-mail n'a pas pu être envoyé.", {
    method: "POST",
  });
}

// --- Codes -------------------------------------------------------------------

export function listCodes(accessToken: string, kind: CodeKind | "all"): Promise<AdminCode[]> {
  const query = kind === "all" ? "" : `?kind=${kind}`;
  return adminRequest(accessToken, `/codes${query}`, "Impossible de charger les codes.");
}

export function createDiscountCode(
  accessToken: string,
  input: { email: string; expiresAt: string; sendEmail: boolean },
): Promise<CreatedCode> {
  return adminRequest(accessToken, "/codes", "La création du code a échoué.", {
    method: "POST",
    body: input,
  });
}

export function revokeCode(accessToken: string, id: string): Promise<AdminCode> {
  return adminRequest(accessToken, `/codes/${id}/revoke`, "La révocation a échoué.", {
    method: "POST",
  });
}

export function resendCode(accessToken: string, id: string): Promise<{ emailSent: boolean }> {
  return adminRequest(accessToken, `/codes/${id}/resend`, "L'e-mail n'a pas pu être envoyé.", {
    method: "POST",
  });
}
