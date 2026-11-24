/**
 * Ecrans admin « Justificatifs étudiants » et « Codes de réduction ».
 * Miroir des reponses de backend/src/commerce/adminRouter.ts.
 */

export type ProofStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminStudentProof = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  pageSlug: string;
  fileMime: "application/pdf" | "image/jpeg" | "image/png";
  fileSize: number;
  status: ProofStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  code: {
    code: string;
    expiresAt: string;
    usedCount: number;
    revokedAt: string | null;
  } | null;
};

export type CodeKind = "student" | "discount";
export type CodeStatus = "active" | "used" | "expired" | "revoked";

export type AdminCode = {
  id: string;
  code: string;
  kind: CodeKind;
  percentOff: number | null;
  productSlug: string | null;
  productLabel: string | null;
  customerEmail: string;
  usedCount: number;
  maxUses: number;
  expiresAt: string;
  revokedAt: string | null;
  createdBy: string;
  createdAt: string;
  status: CodeStatus;
};

export type ApproveProofResult = { code: string; expiresAt: string; emailSent: boolean };
export type CreatedCode = AdminCode & { emailSent: boolean };
