export type BrochureRequestPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  message?: string;
  formationSlug: string;
  /** Piege temporel anti-bot : ms entre le montage du formulaire et l'envoi. */
  elapsedMs?: number;
};

/** Succes : `url` absente si le piege temporel s'est declenche. */
export type BrochureRequestResponse = {
  ok: true;
  url?: string;
};
