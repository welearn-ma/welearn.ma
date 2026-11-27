/** « 10,00 MAD », « 8 500,00 MAD » (format français, 2 décimales). */
export function formatAmountMad(amount: number): string {
  const value = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${value} MAD`;
}

/** « 8 500 MAD » (montant entier, sans décimales). */
export function formatWholeAmountMad(amount: number): string {
  const value = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount);
  return `${value} MAD`;
}

/** « 25 », « 12,5 » (format français, 2 décimales au plus). */
function formatPercent(percent: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(percent);
}

/**
 * Badge d'une promotion : « Black Friday −25 % » (signe moins U+2212, espace
 * insécable U+00A0 avant « % »).
 */
export function formatPromotionBadge(promotion: { label: string; percent_off: number }): string {
  return `${promotion.label} \u2212${formatPercent(promotion.percent_off)}\u00a0%`;
}

/**
 * Fin d'une offre, à l'heure de Casablanca : « lundi 30 novembre 2026 à
 * 23h59 ». `endsAt` est EXCLU (01/12/2026 00:00) : on affiche la dernière
 * minute incluse. null si la date est illisible ou si le navigateur n'a pas
 * les fuseaux horaires (mieux vaut ne rien afficher qu'une heure fausse).
 */
export function formatOfferEnd(endsAt: string): string | null {
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) return null;
  const lastIncluded = new Date(end - 1);
  try {
    const p = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Africa/Casablanca",
    })
      .formatToParts(lastIncluded)
      .reduce<Record<string, string>>((parts, part) => ({ ...parts, [part.type]: part.value }), {});
    // « 1er décembre », « 30 novembre ».
    const day = p.day === "1" ? "1er" : p.day;
    return `${p.weekday} ${day} ${p.month} ${p.year} à ${p.hour}h${p.minute}`;
  } catch {
    return null;
  }
}

/**
 * Date du paiement JJ/MM/AAAA, à l'heure de Casablanca (le décalage, y
 * compris pendant le Ramadan, est géré par Intl). null si la date est
 * illisible.
 */
export function formatPaidDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      ...options,
      timeZone: "Africa/Casablanca",
    }).format(date);
  } catch {
    // Navigateur sans données de fuseaux horaires.
    return new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" }).format(date);
  }
}
