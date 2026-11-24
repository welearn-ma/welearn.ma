import { createSupabaseProofFiles } from "../commerce/supabaseProofFiles";
import { supabaseCommerceStore } from "../commerce/supabaseStore";
import { readCmiConfig } from "../config/cmi";
import { createSmtpMailer } from "../lib/mailer";

/**
 * Dependances de production partagees par /api/students et les routes admin
 * des justificatifs / codes (lues une fois au demarrage).
 */

const cmi = readCmiConfig(process.env);

/** Site public (liens des e-mails) : SITE_URL, ou https://welearn.ma. */
export const siteUrl = cmi.enabled ? cmi.config.siteUrl : cmi.fallbackSiteUrl;

/** Destinataire interne des notifications et adresse de reponse des e-mails. */
export const contactRecipient = process.env.CONTACT_RECIPIENT?.trim() || "contact@welearn.ma";

export const mailer = createSmtpMailer(process.env);
export const proofFiles = createSupabaseProofFiles();
export const commerceStore = supabaseCommerceStore;
