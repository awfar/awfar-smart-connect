
import { Owner } from "./commonTypes";

// Core lead type definition used across the application
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  country?: string;
  industry?: string;
  stage?: string; // Used in UI (maps to status in DB)
  status?: string; // Used in DB
  source?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  owner?: Owner;
}

// Activity related to a lead
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

// Database representation of a lead
export interface LeadDBRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  country?: string | null;
  industry?: string | null;
  status?: string;
  source?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}
