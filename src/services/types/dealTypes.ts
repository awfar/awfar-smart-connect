
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
  lead?: {
    id: string;
    name: string;
    email?: string;
  };
  contact_id?: string;
  contact_name?: string;
  created_at?: string;
  updated_at?: string;
  activities?: DealActivity[];
}

export interface DealDBRow {
  id: string;
  name: string;
  description?: string;
  value?: number;
  stage: string;
  status: string;
  expected_close_date?: string;
  owner_id?: string;
  company_id?: string;
  lead_id?: string;
  contact_id?: string;
  created_at?: string;
  updated_at?: string;
  // Updated to handle SelectQueryError
  profiles?: {
    first_name: string;
    last_name: string;
  } | null | { error: boolean; [key: string]: any };
  companies?: {
    name: string;
  } | null | { error: boolean; [key: string]: any };
  company_contacts?: {
    name: string;
  } | null | { error: boolean; [key: string]: any };
  leads?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null | { error: boolean; [key: string]: any };
}

export interface DealActivity {
  id: string;
  deal_id: string;
  type: string;
  description: string;
  created_at?: string;
  created_by?: string;
  creator?: {
    name: string;
    avatar?: string;
  };
  scheduled_at?: string | null;
  completed_at?: string | null;
}
