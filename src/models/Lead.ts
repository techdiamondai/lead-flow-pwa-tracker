
export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string | null;
  address?: string | null;
  current_stage: LeadStage;
  assigned_to?: string | null;
  created_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadHistory {
  id: string;
  lead_id: string;
  stage: LeadStage;
  updated_by?: string | null;
  notes?: string | null;
  timestamp: string;
}

export type NewLead = Omit<Lead, "id" | "created_at" | "updated_at">;
