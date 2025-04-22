
import { Lead } from "./leadTypes";

export interface Deal {
  id: string;
  name: string;
  description?: string;
  value?: number;
  stage: string;
  status: string;
  expected_close_date?: string;
  owner_id?: string;
  owner?: {
    id: string;
    name: string;
    initials: string;
    avatar?: string;
  };
  company_id?: string;
  company_name?: string;
  lead_id?: string;
  lead?: Lead;
  contact_id?: string;
  contact_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DealDBRow {
  id: string;
  name: string;
  description?: string;
  value?: number;
  stage: string;
  status: string;
  expected_close_date?: string;
  owner_id?: string | null;
  company_id?: string | null;
  lead_id?: string | null;
  contact_id?: string | null;
  created_at?: string;
  updated_at?: string;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
  } | null | Record<string, any>;  // Update to handle potential Supabase query error types
  companies?: {
    name?: string | null;
  } | null;
  company_contacts?: {
    name?: string | null;
  } | null;
  leads?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  } | null;
}

export interface DealActivity {
  id: string;
  deal_id: string;
  type: string;
  description: string;
  created_at?: string;
  created_by?: string;
  scheduled_at?: string;
  completed_at?: string;
  creator?: {
    name: string;
    avatar?: string;
  };
}
