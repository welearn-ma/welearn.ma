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
