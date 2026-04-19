type AdminSessionResponse =
  | {
      success: true;
      email: string;
    }
  | {
      success: false;
      message: string;
    };

type VerifyAdminSessionResult =
  | {
      ok: true;
      email: string;
    }
  | {
      ok: false;
      reason: "session" | "not_admin" | "network";
    };

export async function verifyAdminSession(
  accessToken: string,
): Promise<VerifyAdminSessionResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl || !accessToken.trim()) {
    return { ok: false, reason: "session" };
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/admin/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "network" };
  }

  if (response.status === 403) {
    return { ok: false, reason: "not_admin" };
  }

  if (response.status === 401) {
    return { ok: false, reason: "session" };
  }

  if (!response.ok) {
    return { ok: false, reason: "network" };
  }

  const payload = (await response.json()) as AdminSessionResponse;

  if (!payload.success) {
    return { ok: false, reason: "session" };
  }

  return {
    ok: true,
    email: payload.email,
  };
}
