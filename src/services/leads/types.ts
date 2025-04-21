
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
  status?: string;
  stage?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  owner?: {
    id?: string;
    name?: string;
    avatar?: string;
    initials?: string;
  };
}

export interface LeadActivityInput {
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'whatsapp';
  description: string;
  scheduled_at?: string;
  created_by?: string;
}

export interface LeadActivity extends LeadActivityInput {
  id: string;
  created_at: string;
  completed_at?: string;
  created_by?: string | {
    first_name: string;
    last_name: string;
  };
}
