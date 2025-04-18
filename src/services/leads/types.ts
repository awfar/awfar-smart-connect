
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
  stage?: string; // Add stage property to match other references
  source?: string;
  notes?: string;
  assigned_to?: string;
  created_at: string; // Make created_at required to match types/leads.ts
  updated_at: string; // Make updated_at required to match types/leads.ts
  avatar_url?: string; // Add avatar_url property to match references
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

// Define LeadActivityInput interface to avoid type errors when creating activities
export interface LeadActivityInput {
  lead_id: string;
  type: LeadActivityType;
  description: string;
  scheduled_at?: string;
  completed_at?: string;
  created_by?: string;
}
