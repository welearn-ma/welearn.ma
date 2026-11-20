import { randomInt } from "crypto";

const UPPER_ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ALNUM = `${UPPER_ALNUM}abcdefghijklmnopqrstuvwxyz`;

function randomString(alphabet: string, length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[randomInt(alphabet.length)];
  }
  return out;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Identifiant de commande envoye au CMI (parametre "oid", alphanumerique,
 * 64 max, sans caractere special) :
 *   "WL" + YYYYMMDDHHmmss (UTC) + 8 caracteres [A-Z0-9] aleatoires
 * soit 24 caracteres. L'unicite finale est garantie par la contrainte
 * UNIQUE sur orders.oid (POST /cmi/init reessaie une fois en cas de doublon).
 */
export function generateOid(now: Date = new Date()): string {
  const timestamp =
    String(now.getUTCFullYear()) +
    pad2(now.getUTCMonth() + 1) +
    pad2(now.getUTCDate()) +
    pad2(now.getUTCHours()) +
    pad2(now.getUTCMinutes()) +
    pad2(now.getUTCSeconds());

  return `WL${timestamp}${randomString(UPPER_ALNUM, 8)}`;
}

/** Parametre "rnd" : 20 caracteres [A-Za-z0-9] aleatoires. */
export function generateRnd(): string {
  return randomString(ALNUM, 20);
}
