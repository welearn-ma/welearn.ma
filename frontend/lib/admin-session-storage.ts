export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "wl_admin_access_token";

export function persistAdminSessionStorage(accessToken: string) {
  const normalizedToken = accessToken.trim();

  window.sessionStorage.setItem(
    ADMIN_ACCESS_TOKEN_STORAGE_KEY,
    normalizedToken,
  );
}

export function getStoredAdminAccessToken() {
  return (
    window.sessionStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? ""
  );
}

export function clearAdminSessionStorage() {
  window.sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * Decodes the email claim from a JWT access token without verifying the signature.
 * Returns null if the token is missing, malformed, or has no email claim.
 */
export function decodeEmailFromAccessToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
