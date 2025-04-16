
// Type definitions for task-related entities

export type RelatedEntityType = 'lead' | 'deal' | 'customer';

// Simple interface for related entity references
export interface RelatedEntityReference {
  type: RelatedEntityType;
  id: string;
  name: string;
}

// Base properties for a task
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
  related_to?: RelatedEntityReference;
}

// Task input for creation - completely flat structure to avoid circular references
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
  // Flat properties for related entity - completely separate from RelatedEntityReference
  related_to_type?: RelatedEntityType;
  related_to_id?: string;
  related_to_name?: string;
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
  related_to?: unknown; // This could be a JSON string or an object
  lead_id?: string;
}
