
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department_id: string | null;
  team_id: string | null;
  is_active: boolean;
  created_at: string;
  department_name?: string;
  team_name?: string;
}

// Interface for the raw data returned from Supabase
export interface SupabaseUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department_id: string | null;
  team_id: string | null;
  is_active: boolean;
  created_at: string;
  company?: string;
  position?: string;
  email?: string; // Make sure email is included in the SupabaseUserData interface
  departments?: { name: string } | null;
  teams?: { name: string } | null;
}

// Interface for the auth user data structure
export interface AuthUser {
  id: string;
  email?: string;
}
