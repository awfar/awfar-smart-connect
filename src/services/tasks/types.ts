
// Type definitions for task-related entities

export type RelatedEntityType = 'lead' | 'deal' | 'customer';

// Explicitly non-recursive reference
export interface RelatedEntityReference {
  type: RelatedEntityType;
  id: string;
  name: string;
}

// Base properties for a task with all primitives or non-recursive types
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

// Full Task type extending the base - NO circular references allowed
export interface Task extends TaskBase {
  related_to?: RelatedEntityReference; 
}

// Explicitly flat task input for creation with no nested structures
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
  // Flat fields for related entity to completely avoid recursive types
  related_to_type?: RelatedEntityType;
  related_to_id?: string;
  related_to_name?: string;
}

// Raw task data from database - always treated as a plain object
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
  related_to?: string | null; // Always stored as JSON string in DB
  lead_id?: string;
}
