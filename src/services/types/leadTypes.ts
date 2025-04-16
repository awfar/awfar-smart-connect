
import { Lead, LeadActivity, Owner } from "@/types/leads";

// Core lead type definition used across the application
export type { Lead, LeadActivity, Owner };

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
