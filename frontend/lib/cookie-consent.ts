/**
 * Consentement cookies : source unique, 100 % côté client (export statique).
 *
 * - Choix stocké en localStorage sous `cookieConsent` (forme historique conservée :
 *   { necessary, analytics, timestamp }). Le champ `marketing` des anciennes
 *   versions est ignoré.
 * - Un choix expire 13 mois après `timestamp` : il est alors considéré comme
 *   absent, le bandeau réapparaît et rien n'est chargé.
 * - Par défaut (aucun choix, choix expiré ou illisible) : aucune mesure d'audience.
 */

export const CONSENT_STORAGE_KEY = "cookieConsent";
export const CONSENT_MAX_AGE_MONTHS = 13;

/** Identifiant de mesure Google Analytics 4. */
export const GA_MEASUREMENT_ID = "G-FB1HB2JTZ2";

/** Émis à chaque enregistrement ou retrait du choix (detail: ConsentState | null). */
export const CONSENT_CHANGE_EVENT = "welearn:cookie-consent-change";
/** Demande de réouverture du bandeau (lien « Gérer les cookies »). */
export const CONSENT_OPEN_EVENT = "welearn:cookie-consent-open";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  timestamp: string;
};

function isExpired(timestamp: string, now = new Date()): boolean {
  const savedAt = new Date(timestamp);
  if (Number.isNaN(savedAt.getTime())) return true;
  const expiresAt = new Date(savedAt);
  expiresAt.setMonth(expiresAt.getMonth() + CONSENT_MAX_AGE_MONTHS);
  return now >= expiresAt;
}

/** Choix valide et non expiré, sinon null. Ne lève jamais d'exception. */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState> | null;
    if (!parsed || typeof parsed.timestamp !== "string") return null;
    if (isExpired(parsed.timestamp)) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

/** Enregistre le choix et notifie les composants abonnés. */
export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le choix vaut pour la page.
  }
  if (!analytics) removeAnalyticsCookies();
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }),
  );
  return state;
}

export function requestConsentBannerOpen(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/** Noms des cookies déposés par gtag.js (GA4). */
function isAnalyticsCookie(name: string): boolean {
  return (
    name === "_ga" ||
    name.startsWith("_ga_") ||
    name === "_gid" ||
    name.startsWith("_gat")
  );
}

/**
 * Supprime les cookies GA. gtag.js les dépose sur le domaine de plus haut niveau
 * possible (ex. `.welearn.ma`) : on tente donc l'hôte et chacun de ses parents.
 */
export function removeAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => !!name && isAnalyticsCookie(name));
  if (names.length === 0) return;

  const labels = window.location.hostname.split(".");
  const domains: (string | null)[] = [null];
  for (let i = 0; i < labels.length - 1; i++) {
    const domain = labels.slice(i).join(".");
    domains.push(domain, `.${domain}`);
  }

  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/";
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = domain
        ? `${name}=; ${expired}; domain=${domain}`
        : `${name}=; ${expired}`;
    }
  }
}
