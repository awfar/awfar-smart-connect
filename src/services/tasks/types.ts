
// Types for tasks module

// Define the related entity type
export type RelatedEntityType = 'lead' | 'deal' | 'customer';

// Basic task type
export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  lead_id?: string;
  related_to_type?: string;
  related_to_id?: string;
  related_to_name?: string;
  related_to?: {
    type: RelatedEntityType;
    id: string;
    name: string;
  };
}

export interface TaskCreateInput {
  id?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string;
  related_to_type?: string;
  related_to_id?: string;
  related_to_name?: string;
}

// Database record type for internal use
export interface TaskRecord {
  id: string;
  title: string;
  description?: string | null;
  status: string; 
  priority: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  related_to?: string | null;
  lead_id?: string | null;
}
