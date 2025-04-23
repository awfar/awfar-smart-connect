
export interface RelatedEntity {
  type: 'lead' | 'deal' | 'company' | 'contact' | 'appointment';
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  start_time?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string;
  deal_id?: string;
  company_id?: string;
  contact_id?: string;
  appointment_id?: string;
  related_to?: RelatedEntity[];
  type?: string;
  // Added to allow for database fields joined from other tables
  profiles?: any;
  leads?: any;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  start_time?: string;
  created_by?: string;
  assigned_to?: string;
  lead_id?: string;
  deal_id?: string;
  company_id?: string;
  contact_id?: string;
  appointment_id?: string;
  related_to?: RelatedEntity[];
  type?: string;
}
