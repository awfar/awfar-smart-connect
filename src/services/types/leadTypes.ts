
// Common types used across lead-related services

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string;
  industry: string;
  stage: string;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  position?: string | null;
  owner?: {
    name: string;
    avatar: string;
    initials: string;
  };
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: string;
  description: string;
  created_at: string;
  created_by?: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
}

export interface LeadFilters {
  stage?: string;
  source?: string;
  country?: string;
  industry?: string;
  assigned_to?: string;
  date_range?: string;
}

// Database row type definitions
export interface LeadRow {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country?: string | null;
  industry?: string | null;
  status: string; // This is mapped to 'stage' in our interface
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  position?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}
