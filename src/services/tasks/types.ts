
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  lead_id?: string | null;  // Explicitly added lead_id field
  assigned_to?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string;  // Added assigned_to_name field
  related_to?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string | null;
  lead_id?: string | null;  // Explicitly added lead_id field
  assigned_to?: string | null;
  created_by?: string | null;
  assigned_to_name?: string;  // Added assigned_to_name field
  related_to?: {
    type: string;
    id: string;
    name: string;
  };
}
