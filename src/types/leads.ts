
// تعريف الأنواع للعميل المحتمل والأنشطة المرتبطة به

export interface Owner {
  name: string;
  avatar: string; // Made required to match usage
  initials: string;
  first_name?: string;
  last_name?: string;
}

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
  lead_id: string; // Making this required for consistency
  type: string;
  description: string;
  createdBy?: string;
  created_by?: string; // String only for consistency
  createdAt?: string;
  created_at?: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
  profiles?: any; // For join with profiles table
}

export interface TestResult {
  id?: string;
  name: string;
  success: boolean;
  details?: string;
  component: string;
  responseTimeMs: number;
  error?: any;
}
