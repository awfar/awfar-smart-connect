
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  lead_id?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string; // Added for mock data
  related_to?: string; // Added for mock data
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string | null;
  lead_id?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
  related_to_type?: string; // Added for useLeadTasks
  related_to_id?: string; // Added for useLeadTasks
  related_to_name?: string; // Added for useLeadTasks
}
