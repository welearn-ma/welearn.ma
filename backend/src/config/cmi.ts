/**
 * Configuration du paiement CMI, lue UNE fois au demarrage.
 *
 * Si une variable manque ou est invalide, le paiement est DESACTIVE (les
 * routes /api/payments repondent "indisponible") mais le processus ne
 * s'arrete pas : inscriptions, contact, sponsors et brochures continuent
 * de fonctionner.
 *
 * Ne JAMAIS journaliser les valeurs : seuls les NOMS des variables en
 * defaut sont exposes (CmiConfigResult.problems).
 */

export const CMI_ENV_VARS = [
  "CMI_CLIENT_ID",
  "CMI_STORE_KEY",
  "CMI_GATEWAY_URL",
  "API_PUBLIC_URL",
  "SITE_URL",
] as const;

/** Site public utilise pour les redirections si SITE_URL est inutilisable. */
const DEFAULT_SITE_URL = "https://welearn.ma";

export interface CmiConfig {
  clientId: string;
  storeKey: string;
  /** URL de la passerelle 3D Pay Hosting (formulaire POST). */
  gatewayUrl: string;
  /** Base publique du backend, sans "/" final (ex. https://api.welearn.ma). */
  apiPublicUrl: string;
  /** Base publique du site, sans "/" final (ex. https://welearn.ma). */
  siteUrl: string;
}

export type CmiConfigResult =
  | { enabled: true; config: CmiConfig }
  | { enabled: false; problems: string[]; fallbackSiteUrl: string };

function normalizeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return raw.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function readCmiConfig(
  env: Readonly<Record<string, string | undefined>>,
): CmiConfigResult {
  const problems: string[] = [];

  const required = (name: (typeof CMI_ENV_VARS)[number]): string => {
    const value = env[name]?.trim() ?? "";
    if (!value) {
      problems.push(`${name} (missing)`);
    }
    return value;
  };

  const requiredUrl = (name: (typeof CMI_ENV_VARS)[number]): string => {
    const value = required(name);
    if (!value) {
      return "";
    }
    const url = normalizeHttpUrl(value);
    if (!url) {
      problems.push(`${name} (invalid URL)`);
      return "";
    }
    return url;
  };

  const clientId = required("CMI_CLIENT_ID");
  const storeKey = required("CMI_STORE_KEY");
  const gatewayUrl = requiredUrl("CMI_GATEWAY_URL");
  const apiPublicUrl = requiredUrl("API_PUBLIC_URL");
  const siteUrl = requiredUrl("SITE_URL");

  if (problems.length > 0) {
    return {
      enabled: false,
      problems,
      fallbackSiteUrl: siteUrl || DEFAULT_SITE_URL,
    };
  }

  return {
    enabled: true,
    config: { clientId, storeKey, gatewayUrl, apiPublicUrl, siteUrl },
  };
}

/** Origines autorisees pour GET /order-status : SITE_URL + variante www. */
export function siteOrigins(siteUrl: string): string[] {
  const url = new URL(siteUrl);
  const variant = new URL(url.origin);
  variant.hostname = url.hostname.startsWith("www.")
    ? url.hostname.slice("www.".length)
    : `www.${url.hostname}`;
  return [url.origin, variant.origin];
}
