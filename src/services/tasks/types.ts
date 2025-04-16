
// Type definitions for task-related entities

export type RelatedEntityType = 'lead' | 'deal' | 'customer';

export interface RelatedEntity {
  type: RelatedEntityType;
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: RelatedEntity;
  lead_id?: string;
}

// Separate interface for task creation to avoid circular references
export interface TaskCreateInput {
  id?: string;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string;
  // Make related_to a simple object for task creation
  related_to?: {
    type: RelatedEntityType;
    id: string;
    name: string;
  };
}

// Define a separate type for raw task records from the database
export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: unknown;
  lead_id?: string;
}
