/**
 * Heure de Casablanca pour les dates affichées (page de paiement réussi,
 * promotions, espace admin).
 *
 * Heure légale du Maroc : UTC+0 depuis le 20/09/2026 à 01:00 UTC (fin de
 * l'heure UTC+1 permanente). Beaucoup d'appareils n'ont pas encore cette
 * mise à jour des fuseaux horaires et afficheraient une heure de trop : à
 * partir de cet instant, l'heure est donc calculée en UTC explicite. Avant,
 * "Africa/Casablanca" (historique identique dans toutes les versions,
 * Ramadan compris).
 *
 * SYNCHRO : même instant que MOROCCO_UTC0_SINCE dans
 * backend/src/commerce/emails.ts (vérifié par un test du backend).
 * À revoir si l'heure légale du Maroc change de nouveau.
 */
export const MOROCCO_UTC0_SINCE = Date.parse("2026-09-20T01:00:00.000Z");

function formatterFor(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
): Intl.DateTimeFormat {
  const timeZone = date.getTime() >= MOROCCO_UTC0_SINCE ? "UTC" : "Africa/Casablanca";
  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone });
  } catch {
    // Navigateur sans données de fuseaux horaires.
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });
  }
}

/** `date` formatée à l'heure de Casablanca. */
export function formatCasablanca(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale = "fr-FR",
): string {
  return formatterFor(date, options, locale).format(date);
}

/** Parties de `date` à l'heure de Casablanca (day, month, hour…). */
export function casablancaParts(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale = "fr-FR",
): Record<string, string> {
  return Object.fromEntries(
    formatterFor(date, options, locale)
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
}
