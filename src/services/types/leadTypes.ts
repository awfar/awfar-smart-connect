
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
  avatar_url?: string | null;
  owner?: Owner;
}

// Activity related to a lead
export interface LeadActivity {
  id: string;
  lead_id: string; // Making this required for consistency
  type: string;
  description: string;
  created_at?: string;
  created_by?: string; // String only for consistency
  scheduled_at?: string | null;
  completed_at?: string | null;
  profiles?: any; // For join with profiles table
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
  status?: string; // This is used as 'stage' in the UI
  stage?: string;  // Add this for compatibility with the transformer
  source?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  avatar_url?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}
