
// Basic task type
export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  lead_id?: string; // Add this property to support tasks related to leads
  related_to_type?: string;
  related_to_id?: string;
  related_to_name?: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assigned_to?: string;
  lead_id?: string; // Add this property to TaskCreateInput as well
  related_to_type?: string;
  related_to_id?: string;
  related_to_name?: string;
}
