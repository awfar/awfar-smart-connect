
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  industry?: string;
  country?: string;
  status: string;
  source?: string;
  notes?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  owner?: {
    id: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    avatar?: string;
    initials?: string;
  };
}

export type LeadActivityType = "note" | "call" | "meeting" | "email" | "task" | "whatsapp" | "update" | "create" | "delete";

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  description: string;
  created_at?: string;
  scheduled_at?: string;
  completed_at?: string;
  created_by?: string | {
    first_name: string;
    last_name: string;
  };
}
