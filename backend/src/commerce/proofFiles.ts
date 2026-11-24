import type { ProofMime } from "./types";

/**
 * Fichiers des justificatifs : bucket Storage PRIVE. Jamais d'URL publique,
 * jamais de journalisation du contenu ni du nom d'origine du fichier.
 */
export interface ProofFiles {
  upload(path: string, bytes: Buffer, mime: ProofMime): Promise<void>;
  remove(path: string): Promise<void>;
  /** URL signee de courte duree (consultation admin). */
  signedUrl(path: string, ttlSeconds: number): Promise<string>;
}

export interface DetectedProofType {
  mime: ProofMime;
  ext: "pdf" | "jpg" | "png";
}

const PDF_MAGIC = Buffer.from("%PDF-", "ascii");
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Type reel d'apres les premiers octets (signature), ou null. */
export function detectProofType(bytes: Buffer): DetectedProofType | null {
  const startsWith = (magic: Buffer) =>
    bytes.length >= magic.length && bytes.subarray(0, magic.length).equals(magic);
  if (startsWith(PDF_MAGIC)) {
    return { mime: "application/pdf", ext: "pdf" };
  }
  if (startsWith(PNG_MAGIC)) {
    return { mime: "image/png", ext: "png" };
  }
  if (startsWith(JPEG_MAGIC)) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  return null;
}

/** Type MIME annonce par le navigateur -> type canonique accepte, ou null. */
export function normalizeDeclaredMime(value: string): ProofMime | null {
  const mime = value.trim().toLowerCase();
  if (mime === "application/pdf") return "application/pdf";
  if (mime === "image/png") return "image/png";
  if (mime === "image/jpeg" || mime === "image/jpg" || mime === "image/pjpeg") {
    return "image/jpeg";
  }
  return null;
}

