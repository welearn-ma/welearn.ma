export type BrochureRequestPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  message?: string;
  formationSlug: string;
  /** Honeypot anti-bot : doit rester vide. */
  website?: string;
};

/** Succes : `url` absente si le honeypot a ete rempli. */
export type BrochureRequestResponse = {
  ok: true;
  url?: string;
};
