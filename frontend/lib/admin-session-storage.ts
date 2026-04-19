export const ADMIN_EMAIL_STORAGE_KEY = "wl_admin_email";
export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "wl_admin_access_token";

export function clearAdminSessionStorage() {
  window.localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
}
