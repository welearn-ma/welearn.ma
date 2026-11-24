/**
 * Acces base de donnees des justificatifs etudiants et des codes
 * (student_proofs, codes, admin_activity_log). Interfaces separees de leur
 * implementation Supabase (supabaseStore.ts) pour les tests.
 */

import type {
  CodeKind,
  CodeRecord,
  NewActivityEntry,
  NewCode,
  NewStudentProof,
  ProductRecord,
  ProofStatus,
  StudentProofRecord,
} from "./types";

/** Formulaire public de depot de justificatif. */
export interface StudentProofStore {
  /** Produit "etudiant" (requires_student_code) lie a cette page, actif ou non. */
  findStudentProductByPageSlug(pageSlug: string): Promise<ProductRecord | null>;
  insertStudentProof(proof: NewStudentProof): Promise<void>;
}

export interface ProofReview {
  status: "APPROVED" | "REJECTED";
  reviewed_by: string;
  reviewed_at: string;
  rejection_reason: string | null;
}

/** Ecrans admin « Justificatifs etudiants » et « Codes de reduction ». */
export interface AdminCommerceStore {
  findStudentProductByPageSlug(pageSlug: string): Promise<ProductRecord | null>;
  listProducts(): Promise<ProductRecord[]>;

  /** Plus recents d'abord ; `status` null = tous. */
  listStudentProofs(status: ProofStatus | null): Promise<StudentProofRecord[]>;
  findStudentProof(id: string): Promise<StudentProofRecord | null>;
  /** PENDING -> APPROVED / REJECTED (conditionnel). false si deja traite. */
  reviewStudentProof(id: string, review: ProofReview): Promise<boolean>;
  /** Annule une validation restee sans code (APPROVED, code_id null) -> PENDING. */
  reopenStudentProof(id: string): Promise<void>;
  linkStudentProofCode(id: string, codeId: string): Promise<void>;

  /** "duplicate_code" si la valeur du code existe deja (contrainte UNIQUE). */
  insertCode(code: NewCode): Promise<CodeRecord | "duplicate_code">;
  /** Plus recents d'abord ; `kind` null = tous. */
  listCodes(kind: CodeKind | null): Promise<CodeRecord[]>;
  findCodesByIds(ids: string[]): Promise<CodeRecord[]>;
  findCodeById(id: string): Promise<CodeRecord | null>;
  /** Code de reduction actif (non revoque, non expire, jamais utilise) pour cet e-mail. */
  findActiveDiscountCode(email: string, now: string): Promise<CodeRecord | null>;
  /** revoked_at = `revokedAt` si encore NULL. false si deja revoque. */
  revokeCode(id: string, revokedAt: string): Promise<boolean>;

  expirePendingOrders(cutoff: string, now: string): Promise<number>;
  /** Flux d'activite admin. Ne leve jamais. */
  logActivity(entry: NewActivityEntry): Promise<void>;
}
