
// Core types for leads section of the application
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
  status: string;
  stage?: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  owner?: Owner;
  avatar_url?: string;
}

export interface Owner {
  id: string; // Make id required to match with services/leads/types.ts
  name?: string;
  avatar?: string;
  initials?: string;
  first_name?: string;
  last_name?: string;
}

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

export interface TestResult {
  id: string;
  name: string;
  success: boolean;
  details?: string;
  component: string;
  responseTimeMs: number;
}
