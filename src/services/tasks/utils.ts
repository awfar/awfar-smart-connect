
import { Task } from './types';

/**
 * Safety function to ensure task data conforms to our expected structure
 */
export const castToTask = (data: any): Task => {
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    due_date: data.due_date || null,
    lead_id: data.lead_id || null,
    assigned_to: data.assigned_to || null,
    created_by: data.created_by || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
