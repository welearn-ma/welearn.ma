/**
 * Montants CMI : chaine avec 2 decimales et un point ("10.00").
 * Les comparaisons se font en centimes entiers (jamais en flottants).
 */

/** Montant (MAD) -> centimes entiers, arrondi au centime. */
export function amountToCents(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError("amount must be a finite, non-negative number");
  }
  return Math.round(amount * 100);
}

/** 10 -> "10.00", 95.93 -> "95.93". */
export function formatAmount(amount: number): string {
  const cents = amountToCents(amount);
  return `${Math.trunc(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

/**
 * Montant RECU du CMI -> centimes. Accepte "." ou "," comme separateur
 * (kit V2.0). Les decimales au-dela de 2 ne sont acceptees que si elles
 * valent zero ("10.000"). Retourne null si le format est invalide.
 */
export function parseAmountToCents(value: string): number | null {
  const match = /^(\d{1,12})(?:[.,](\d+))?$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const units = Number(match[1]);
  const decimals = match[2] ?? "";

  if (decimals.length > 2 && /[^0]/.test(decimals.slice(2))) {
    return null;
  }

  const cents = Number(decimals.slice(0, 2).padEnd(2, "0"));
  return units * 100 + cents;
}
