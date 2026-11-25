/**
 * Codes personnels WL-XXXX-XXXX (étudiant ou réduction).
 * Même forme que normalizeCode — backend/src/commerce/codes.ts.
 */

const CODE_PATTERN = /^WL-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

/** Forme canonique « WL-XXXX-XXXX », ou null si le format est impossible. */
export function normalizeCode(input: string): string | null {
  const compact = input.toUpperCase().replace(/[\s-]/g, "");
  const match = /^WL([A-Z0-9]{4})([A-Z0-9]{4})$/.exec(compact);
  if (!match) return null;
  const code = `WL-${match[1]}-${match[2]}`;
  return CODE_PATTERN.test(code) ? code : null;
}
