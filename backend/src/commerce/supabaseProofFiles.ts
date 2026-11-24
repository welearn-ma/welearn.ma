import { STUDENT_PROOFS_BUCKET } from "../config/commerce";
import { supabase } from "../lib/supabaseClient";
import type { ProofFiles } from "./proofFiles";

/**
 * Justificatifs dans le bucket Supabase Storage PRIVE `student-proofs`
 * (service role ; aucune policy publique). Lecture uniquement par URL
 * signee de courte duree.
 */
export function createSupabaseProofFiles(): ProofFiles {
  const bucket = () => supabase.storage.from(STUDENT_PROOFS_BUCKET);

  return {
    async upload(path, bytes, mime) {
      const { error } = await bucket().upload(path, bytes, { contentType: mime, upsert: false });
      if (error) {
        throw new Error(`storage upload failed: ${error.message}`);
      }
    },

    async remove(path) {
      const { error } = await bucket().remove([path]);
      if (error) {
        throw new Error(`storage remove failed: ${error.message}`);
      }
    },

    async signedUrl(path, ttlSeconds) {
      const { data, error } = await bucket().createSignedUrl(path, ttlSeconds);
      if (error || !data?.signedUrl) {
        throw new Error(`storage signed URL failed: ${error?.message ?? "no url"}`);
      }
      return data.signedUrl;
    },
  };
}
