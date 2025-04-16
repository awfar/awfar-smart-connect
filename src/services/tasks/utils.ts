
import { Task, TaskRecord, RelatedEntityReference } from './types';

// Explicitly convert the TaskRecord to Task with proper type checking and no recursive types
export const castToTask = (data: TaskRecord): Task => {
  // Validate and convert status to prevent type issues
  let status: Task['status'] = 'pending';
  if (data.status === 'pending' || 
      data.status === 'in-progress' || 
      data.status === 'completed' || 
      data.status === 'cancelled') {
    status = data.status;
  }
  
  // Validate and convert priority
  let priority: Task['priority'] = 'medium';
  if (data.priority === 'high' || 
      data.priority === 'medium' || 
      data.priority === 'low') {
    priority = data.priority;
  }
  
  // Parse related_to safely from string to object with explicit typing
  let relatedTo: RelatedEntityReference | undefined = undefined;
  
  if (data.related_to) {
    try {
      // Handle the case where related_to is a string (JSON)
      if (typeof data.related_to === 'string') {
        const parsed = JSON.parse(data.related_to);
        if (parsed && typeof parsed === 'object') {
          // Extract and validate fields individually to avoid deep type issues
          const type = parsed.type as unknown;
          if (type === 'lead' || type === 'deal' || type === 'customer') {
            relatedTo = {
              type: type as RelatedEntityType,
              id: String(parsed.id || ''),
              name: String(parsed.name || '')
            };
          }
        }
      } 
    } catch (e) {
      console.error('Failed to parse related_to:', e);
    }
  }
  
  // Create a flat Task object with no recursive types
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status,
    priority,
    due_date: data.due_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    assigned_to: data.assigned_to,
    assigned_to_name: data.assigned_to_name,
    related_to: relatedTo,
    lead_id: data.lead_id
  };
};
