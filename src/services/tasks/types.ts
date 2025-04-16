
// Type definitions for task-related entities

// Define entity types as a string literal union
export type RelatedEntityType = 'lead' | 'deal' | 'customer';

// Simple reference interface with no recursive types
export interface RelatedEntityReference {
  type: RelatedEntityType;
  id: string;
  name: string;
}

// Define task status and priority as standalone types
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'high' | 'medium' | 'low';

// Base properties for a task with only primitives
export interface TaskBase {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string;
}

// Full Task type extending base with optional related entity
export interface Task extends TaskBase {
  related_to?: RelatedEntityReference; 
}

// Completely flat task input for creation
export interface TaskCreateInput {
  id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string;
  related_to_type?: RelatedEntityType;
  related_to_id?: string;
  related_to_name?: string;
}

// Raw database record type with no complex nested objects
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
  related_to?: string | null; // Always stored as JSON string
  lead_id?: string;
}
