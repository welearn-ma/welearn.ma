export type SponsorProgram = "sponsoring" | "mooc" | "fnpi";

export type SponsorPayload = {
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string;
  telephone: string;
  email: string;
  moocs: string[];
  program?: SponsorProgram;
};

export type SponsorResponse = {
  success: boolean;
  message: string;
};

export type SponsorRecord = {
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

export type SponsorListResponse = {
  success: boolean;
  data: SponsorRecord[];
  message?: string;
};
