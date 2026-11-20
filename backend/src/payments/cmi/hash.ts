import { createHash, timingSafeEqual } from "crypto";

/**
 * CMI "ver3" hash (kit d'integration CMI V2.0, sections 4.1.4 et 4.2.4).
 *
 * plaintext = valeurs de TOUS les parametres (sauf "hash" / "encoding"),
 *             triees par nom de parametre, echappees, jointes par "|",
 *             suivies de "|" + storeKey echappee.
 * hash      = base64( sha512(plaintext) en octets bruts ).
 *
 * Module pur : aucun log, aucune I/O. Ne JAMAIS journaliser le plaintext
 * (il contient la storeKey).
 */

export type ParamEntries = ReadonlyArray<readonly [string, string]>;
export type HashInput = Readonly<Record<string, string>> | ParamEntries;

/** Parametres jamais inclus dans le hash (nom compare sans casse). */
const EXCLUDED_KEYS: ReadonlySet<string> = new Set(["hash", "encoding"]);

export function isExcludedFromHash(key: string): boolean {
  return EXCLUDED_KEYS.has(key.toLowerCase());
}

/** Echappement ver3 : "\" -> "\\" d'abord, puis "|" -> "\|". */
export function escapeHashValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

/**
 * Tri des noms de parametres : comparaison caractere par caractere apres
 * passage en MAJUSCULES (comme le sample JSP du kit :
 * str.toUpperCase(Locale.US).compareTo(...)). Consequences voulues :
 * DIMCRITERIA1 < DIMCRITERIA10 < DIMCRITERIA2, et "_" se classe APRES les
 * lettres. Les egalites (memes noms a la casse pres) conservent l'ordre de
 * reception (Array.prototype.sort est stable).
 */
export function compareParamKeys(a: string, b: string): number {
  const upperA = a.toUpperCase();
  const upperB = b.toUpperCase();
  if (upperA < upperB) {
    return -1;
  }
  if (upperA > upperB) {
    return 1;
  }
  return 0;
}

function toEntries(input: HashInput): Array<[string, string]> {
  const entries: ReadonlyArray<readonly [string, unknown]> = Array.isArray(
    input,
  )
    ? (input as ParamEntries)
    : Object.entries(input);

  return entries.map(([key, value]) => {
    if (typeof value !== "string") {
      throw new TypeError(`CMI hash: parameter "${key}" is not a string`);
    }
    return [key, value];
  });
}

/**
 * Coeur ver3 : utilise les valeurs TELLES QUELLES (aucun trim, aucune
 * normalisation). Les variantes "envoi" et "reception" preparent les
 * valeurs avant d'appeler cette fonction.
 */
export function plaintextFromValues(input: HashInput, storeKey: string): string {
  const segments = toEntries(input)
    .filter(([key]) => !isExcludedFromHash(key))
    .sort(([keyA], [keyB]) => compareParamKeys(keyA, keyB))
    .map(([, value]) => escapeHashValue(value));

  segments.push(escapeHashValue(storeKey));
  return segments.join("|");
}

export function sha512Base64(plaintext: string): string {
  return createHash("sha512").update(plaintext, "utf8").digest("base64");
}

// ---------------------------------------------------------------------------
// Envoi (payment request)
// ---------------------------------------------------------------------------

/**
 * Regle "document" (kit V2.0, notice 4.1.4) : dans le calcul du hash d'une
 * requete sortante, tout caractere qui suit la chaine "document" est
 * remplace par "." (le pare-feu anti-script du CMI modifie la valeur de son
 * cote avant de verifier le hash). Minuscules uniquement.
 *   "document abc" -> "document.abc" ; "documentabc" -> "document.bc"
 * La valeur POSTEE reste inchangee : seul le plaintext est concerne.
 */
export function applyDocumentRule(value: string): string {
  return value.replace(/document[\s\S]/g, "document.");
}

/**
 * Plaintext d'une requete SORTANTE : trim de chaque valeur, regle
 * "document", puis ver3. Les valeurs postees doivent etre les memes valeurs
 * trimees (voir buildSignedFields).
 */
export function buildHashPlaintext(input: HashInput, storeKey: string): string {
  const prepared = toEntries(input).map(
    ([key, value]): [string, string] => [key, applyDocumentRule(value.trim())],
  );
  return plaintextFromValues(prepared, storeKey);
}

/** Hash d'une requete SORTANTE (voir buildHashPlaintext). */
export function computeHash(input: HashInput, storeKey: string): string {
  return sha512Base64(buildHashPlaintext(input, storeKey));
}

// ---------------------------------------------------------------------------
// Reception (callback serveur-a-serveur + retour navigateur okUrl/failUrl)
// ---------------------------------------------------------------------------

const NAMED_ENTITIES: ReadonlyMap<string, string> = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
]);

/**
 * Decodage d'entites HTML volontairement LIMITE (pas de dependance) :
 * entites numeriques (&#39; &#x27;) + &amp; &lt; &gt; &quot; &apos;.
 * Un seul passage (comme html_entity_decode) : "&amp;lt;" -> "&lt;".
 * Toute autre entite, ou un code point invalide, est laissee telle quelle.
 */
export function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(?:#([0-9]+)|#[xX]([0-9a-fA-F]+)|([A-Za-z]+));/g,
    (match, dec?: string, hex?: string, name?: string) => {
      if (dec !== undefined || hex !== undefined) {
        const codePoint =
          dec !== undefined ? Number.parseInt(dec, 10) : Number.parseInt(hex!, 16);
        const isValid =
          Number.isSafeInteger(codePoint) &&
          codePoint > 0 &&
          codePoint <= 0x10ffff &&
          (codePoint < 0xd800 || codePoint > 0xdfff);
        return isValid ? String.fromCodePoint(codePoint) : match;
      }
      return NAMED_ENTITIES.get(name!) ?? match;
    },
  );
}

/**
 * Normalisation d'une valeur RECUE, comme le sample callback.php du kit :
 * suppression d'UN "\n" final, puis decodage des entites HTML. Pas de trim.
 */
export function normalizeReceivedValue(value: string): string {
  const withoutNewline = value.endsWith("\n") ? value.slice(0, -1) : value;
  return decodeHtmlEntities(withoutNewline);
}

/**
 * Hash attendu pour un corps RECU (callback ou retour navigateur) : toutes
 * les valeurs recues, normalisees (normalizeReceivedValue), hors
 * hash/encoding. Exporte aussi pour signer des payloads de test.
 */
export function computeReceivedHash(input: HashInput, storeKey: string): string {
  const prepared = toEntries(input).map(
    ([key, value]): [string, string] => [key, normalizeReceivedValue(value)],
  );
  return sha512Base64(plaintextFromValues(prepared, storeKey));
}

/**
 * Verifie le HASH d'un corps recu du CMI. Retourne false (jamais d'exception)
 * si : storeKey vide, corps non objet, valeur non-chaine (cle dupliquee ->
 * tableau), HASH absent ou present plusieurs fois, ou hash different.
 * Comparaison en temps constant (crypto.timingSafeEqual).
 */
export function verifyCallbackHash(body: unknown, storeKey: string): boolean {
  if (!storeKey || typeof body !== "object" || body === null || Array.isArray(body)) {
    return false;
  }

  const receivedHashes: string[] = [];
  const values: Array<[string, string]> = [];

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") {
      return false;
    }
    if (key.toLowerCase() === "hash") {
      receivedHashes.push(value);
      continue;
    }
    values.push([key, value]);
  }

  if (receivedHashes.length !== 1) {
    return false;
  }

  const expected = Buffer.from(computeReceivedHash(values, storeKey), "utf8");
  const actual = Buffer.from(receivedHashes[0], "utf8");

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
