
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
  status: string; // Changed from optional to required to match services/leads/types.ts
  stage?: string; // Added to match references in code
  source?: string;
  notes?: string;
  created_at: string; // Changed from required to required
  updated_at: string; // Changed from required to required
  assigned_to?: string;
  owner?: Owner;
  avatar_url?: string; // Added to match references in code
}

export interface Owner {
  id?: string;
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
