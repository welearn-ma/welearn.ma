import type { MailMessage, Mailer } from "../../lib/mailer";
import type { ProofFiles } from "../proofFiles";
import type { ProofMime } from "../types";

/** Mailer de test : garde les messages, peut simuler une panne SMTP. */
export class FakeMailer implements Mailer {
  readonly sent: MailMessage[] = [];
  failing = false;

  async send(message: MailMessage): Promise<void> {
    if (this.failing) {
      throw Object.assign(new Error("SMTP down for user@example.test"), {
        code: "ECONNECTION",
      });
    }
    this.sent.push(message);
  }
}

/** Stockage de fichiers en memoire (bucket prive simule). */
export class MemoryProofFiles implements ProofFiles {
  readonly objects = new Map<string, { bytes: Buffer; mime: ProofMime }>();
  readonly signed: Array<{ path: string; ttlSeconds: number }> = [];
  failUpload = false;

  async upload(path: string, bytes: Buffer, mime: ProofMime): Promise<void> {
    if (this.failUpload) {
      throw new Error("storage upload failed: simulated");
    }
    if (this.objects.has(path)) {
      throw new Error("storage upload failed: already exists");
    }
    this.objects.set(path, { bytes: Buffer.from(bytes), mime });
  }

  async remove(path: string): Promise<void> {
    this.objects.delete(path);
  }

  async signedUrl(path: string, ttlSeconds: number): Promise<string> {
    if (!this.objects.has(path)) {
      throw new Error("storage signed URL failed: not found");
    }
    this.signed.push({ path, ttlSeconds });
    return `https://storage.example.test/signed/${path}?token=t&expires=${ttlSeconds}`;
  }
}

export const PDF_BYTES = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(200, 0x20)]);
export const PNG_BYTES = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(200, 0),
]);
export const JPEG_BYTES = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 0)]);
