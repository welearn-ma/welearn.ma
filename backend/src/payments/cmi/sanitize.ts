/**
 * Nettoyage des champs BillTo* (kit V2.0, sample 2.SendData.php :
 * str_without_accents + [^a-zA-Z0-9_ -]). Applique a la valeur ENVOYEE,
 * pour que la valeur postee et la valeur hachee soient identiques.
 */

/** Lettres sans decomposition Unicode utile -> equivalent latin. */
const SPECIAL_LETTERS: ReadonlyMap<string, string> = new Map([
  ["ß", "ss"],
  ["æ", "ae"],
  ["Æ", "AE"],
  ["œ", "oe"],
  ["Œ", "OE"],
  ["ø", "o"],
  ["Ø", "O"],
  ["đ", "d"],
  ["Đ", "D"],
  ["ð", "d"],
  ["Ð", "D"],
  ["ł", "l"],
  ["Ł", "L"],
  ["ı", "i"],
  ["þ", "th"],
  ["Þ", "Th"],
]);

/**
 * Supprime les accents (é -> e, ç -> c, ...), ne garde que
 * [A-Za-z0-9 _-], puis trim. Un nom en ecriture non latine (ex. arabe)
 * devient une chaine vide : c'est a l'appelant de le refuser.
 */
export function sanitizeBillTo(value: string): string {
  const mapped = Array.from(value, (char) => SPECIAL_LETTERS.get(char) ?? char).join(
    "",
  );

  return mapped
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .trim();
}

/** "BillToName", "BillToCompany", "billtocity"... (prefixe sans casse). */
export function isBillToKey(key: string): boolean {
  return /^billto/i.test(key);
}

/**
 * Vrai si la valeur contient "document" (toute casse). Utilise par /init
 * pour refuser les textes libres (email, nom) qui declencheraient la regle
 * "document" du CMI.
 */
export function containsDocumentWord(value: string): boolean {
  return /document/i.test(value);
}
