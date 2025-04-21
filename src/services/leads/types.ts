
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  country?: string;
  industry?: string;
  source?: string;
  status: string; // Changed from optional to required to match types/leads.ts
  stage?: string;
  notes?: string;
  created_at: string; // Changed to required to match types/leads.ts
  updated_at: string; // Changed to required to match types/leads.ts
  assigned_to?: string;
  owner?: {
    id?: string;
    name?: string;
    avatar?: string;
    initials?: string;
    first_name?: string;
    last_name?: string;
  };
  avatar_url?: string;
}

export interface LeadActivityInput {
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'whatsapp';
  description: string;
  scheduled_at?: string;
  created_by?: string;
}

// Modified to not extend LeadActivityInput to avoid type incompatibility
export interface LeadActivity {
  id: string;
  lead_id: string;
  type: 'note' | 'call' | 'meeting' | 'email' | 'task' | 'whatsapp' | 'update' | 'create' | 'delete';
  description: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  created_by: string | {
    first_name: string;
    last_name: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}
