/** Origine d'une demande (colonne registration_requests.source). */
export type RegistrationSource = "inscription" | "brochure";

export type AdminRegistrationRecord = {
  id: string;
  /** Absent si le backend n'expose pas encore la colonne : traiter comme "inscription". */
  source?: RegistrationSource;
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  position?: string | null;
  message?: string | null;
  formationSlug: string;
  formationTitle: string;
  treated: boolean;
  treatedAt: string | null;
  treatedBy: string | null;
  treatedNote: string | null;
  createdAt: string;
};

export type AdminRegistrationListResponse = {
  success: boolean;
  data: AdminRegistrationRecord[];
  message?: string;
};

export type UpdateTreatedResponse = {
  success: boolean;
  message: string;
};
