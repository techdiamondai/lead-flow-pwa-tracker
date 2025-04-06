
export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface LeadHistory {
  id: string;
  timestamp: string;
  stage: LeadStage;
  notes?: string;
  updatedBy: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  address?: string;
  created: string;
  updated: string;
  currentStage: LeadStage;
  assignedTo: string;
  history: LeadHistory[];
  notes?: string;
}

export type NewLead = Omit<Lead, "id" | "created" | "updated" | "history"> & {
  history?: LeadHistory[];
};

export type LeadUpdate = Partial<Omit<Lead, "id" | "created" | "history">>;
