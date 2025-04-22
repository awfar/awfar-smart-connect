
export interface Company {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  city?: string;
  country?: string;
  type: string;
  industry?: string;
  address?: string;
  size?: string;
  logo_url?: string;
  status?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  owner_id?: string;
}

export interface CompanyActivity {
  id: string;
  company_id: string;
  type: string;
  description: string;
  created_by?: string;
  created_at: string;
  scheduled_at?: string;
  completed_at?: string;
}
