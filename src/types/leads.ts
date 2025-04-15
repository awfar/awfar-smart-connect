
// تعريف الأنواع للعميل المحتمل والأنشطة المرتبطة به

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
  avatar_url?: string | null; // إضافة حقل avatar_url
  owner?: {
    name: string;
    avatar: string;
    initials: string;
  };
}

export interface LeadActivity {
  id: string;
  leadId?: string;
  lead_id?: string;
  type: string;
  description: string;
  createdBy?: string;
  created_by?: string;
  createdAt?: string;
  created_at?: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
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
