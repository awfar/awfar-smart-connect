
/**
 * Tasks Module Type Definitions
 * 
 * IMPORTANT: To avoid TypeScript's "excessively deep and possibly infinite" type instantiation errors:
 * 1. Keep all types flat and non-recursive
 * 2. Avoid complex mapped/conditional types
 * 3. Use primitive types and simple interfaces
 * 4. Keep database types separate from UI types
 * 5. Use explicit string literals rather than nested type references
 */

// Simple string literal types
export type RelatedEntityType = 'lead' | 'deal' | 'customer';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'high' | 'medium' | 'low';

// Flat interface for related entity - completely separate from task structure
export interface RelatedEntityReference {
  type: RelatedEntityType;
  id: string;
  name: string;
}

// Core Task properties using only primitive types
export interface TaskBase {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  lead_id?: string | null;
}

// Task including related entity - used only in UI, not for database operations
export interface Task extends TaskBase {
  related_to?: RelatedEntityReference | null;
}

// Input for task creation - totally flat with no nesting
export interface TaskCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  lead_id?: string | null;
  // Flat fields for related entity data
  related_to_type?: RelatedEntityType;
  related_to_id?: string;
  related_to_name?: string;
}

// Database record type - completely flat with no complex types
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
  related_to?: string | null; // Always JSON string in DB
  lead_id?: string | null;
}
