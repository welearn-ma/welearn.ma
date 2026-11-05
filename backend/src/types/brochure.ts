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

export type BrochureRequestResponse =
  | { ok: true; url?: string }
  | { ok: false; message: string };
