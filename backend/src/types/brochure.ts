export type BrochureRequestPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  message?: string;
  formationSlug: string;
  /**
   * Piege temporel anti-bot : ms entre le montage du formulaire et l'envoi.
   * Optionnel : absent chez les anciens frontends en cache.
   */
  elapsedMs?: number;
};

export type BrochureRequestResponse =
  | { ok: true; url?: string }
  | { ok: false; message: string };
