
// Type definitions for task-related entities

export type RelatedEntityType = 'lead' | 'deal' | 'customer';

// Simple interface for related entity references - explicitly non-recursive
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
  related_to?: RelatedEntityReference; // Non-recursive reference
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
  // Explicitly flatten related entity fields to avoid recursive types
  related_to_type?: RelatedEntityType;
  related_to_id?: string;
  related_to_name?: string;
}

// Raw task data from database - explicitly separate from Task
export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  status: string; // Raw string format in DB
  priority: string; // Raw string format in DB
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: string | null; // Always stored as JSON string in DB
  lead_id?: string;
}
