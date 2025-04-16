
// Type definitions for leads-related functionality
import { Owner } from "../types/commonTypes";

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
  stage?: string;
  status?: string;
  source?: string | null;
  notes?: string | null;
  created_at?: string;
  createdAt?: string;
  lastActivity?: string;
  updated_at?: string;
  assignedTo?: string;
  assigned_to?: string;
  avatar_url?: string | null;
  owner?: Owner;
}

export interface LeadActivity {
  id: string;
  leadId?: string;
  lead_id: string; // Making this required to match the other definition
  type: string;
  description: string;
  createdBy?: string;
  created_by?: string; // String only to match the other definition
  createdAt?: string;
  created_at?: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
}
