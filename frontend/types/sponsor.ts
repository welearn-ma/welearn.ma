export type SponsorPayload = {
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string;
  telephone: string;
  email: string;
  moocs: string[];
};

export type SponsorResponse = {
  success: boolean;
  message: string;
};

export type AdminSponsorRecord = {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string | null;
  telephone: string;
  email: string;
  moocs: string[];
  createdAt: string;
};

export type AdminSponsorListResponse = {
  success: boolean;
  data: AdminSponsorRecord[];
  message?: string;
};
