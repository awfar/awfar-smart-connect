
// Type definitions for task-related entities

export type RelatedEntityType = 'lead' | 'deal' | 'customer';

export interface RelatedEntity {
  type: RelatedEntityType;
  id: string;
  name: string;
}

// Define the base properties for a task without circular references
export interface TaskBase {
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
  lead_id?: string;
}

// Full Task type extending the base with related entity
export interface Task extends TaskBase {
  related_to?: RelatedEntity;
}

// Task input with simplified related_to structure
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
  related_to?: {
    type: RelatedEntityType;
    id: string;
    name: string;
  };
}

// Raw task data from database
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
