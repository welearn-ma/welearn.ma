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
