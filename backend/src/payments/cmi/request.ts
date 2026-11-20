import { computeHash, type HashInput } from "./hash";
import { isBillToKey, sanitizeBillTo } from "./sanitize";

/**
 * Construit les champs a poster vers la passerelle CMI, HASH compris.
 *
 * - BillTo* : sanitizeBillTo (sans accents, [A-Za-z0-9 _-], trim).
 * - autres  : trim.
 * Les valeurs RETOURNEES sont exactement celles qui ont ete hachees (avant
 * la regle "document", qui ne concerne que le plaintext).
 *
 * Retourne des paires [nom, valeur] dans l'ordre d'entree, "HASH" en dernier.
 */
export function buildSignedFields(
  params: HashInput,
  storeKey: string,
): Array<[string, string]> {
  if (!storeKey) {
    throw new Error("CMI: store key is empty");
  }

  const source: ReadonlyArray<readonly [string, string]> = Array.isArray(params)
    ? (params as ReadonlyArray<readonly [string, string]>)
    : Object.entries(params);

  const fields: Array<[string, string]> = source.map(([key, value]) => {
    if (key.toLowerCase() === "hash") {
      throw new Error("CMI: params must not contain a hash field");
    }
    return [key, isBillToKey(key) ? sanitizeBillTo(value) : value.trim()];
  });

  fields.push(["HASH", computeHash(fields, storeKey)]);
  return fields;
}
