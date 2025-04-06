
export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface LeadHistory {
  id: string;
  lead_id: string;
  timestamp: string;
  stage: LeadStage;
  notes?: string;
  updated_by: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  current_stage: LeadStage;
  assigned_to: string;
  created_by: string;
  notes?: string;
  history?: LeadHistory[];
}

export type NewLead = Omit<Lead, "id" | "created_at" | "updated_at" | "history">;

export type LeadUpdate = Partial<Omit<Lead, "id" | "created_at" | "history" | "created_by">>;
