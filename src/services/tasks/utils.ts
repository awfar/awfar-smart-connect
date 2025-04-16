
import { Task, TaskRecord, RelatedEntityReference } from './types';

// Explicitly convert the TaskRecord to Task with proper type checking
export const castToTask = (data: TaskRecord): Task => {
  // Validate and convert status
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
  
  // Parse related_to safely
  let relatedTo: RelatedEntityReference | undefined = undefined;
  if (data.related_to) {
    // Handle the case where related_to is a string (JSON)
    if (typeof data.related_to === 'string') {
      try {
        const parsed = JSON.parse(data.related_to);
        if (typeof parsed === 'object' && parsed !== null) {
          const type = parsed.type;
          if (type === 'lead' || type === 'deal' || type === 'customer') {
            relatedTo = {
              type,
              id: parsed.id,
              name: parsed.name
            };
          }
        }
      } catch (e) {
        console.error('Failed to parse related_to JSON:', e);
      }
    }
    // Handle the case where related_to is already an object
    else if (typeof data.related_to === 'object' && data.related_to !== null) {
      const relatedToObj = data.related_to as Record<string, unknown>;
      if (
        typeof relatedToObj.type === 'string' && 
        typeof relatedToObj.id === 'string' && 
        typeof relatedToObj.name === 'string'
      ) {
        // Only set if the type is one of the allowed values
        const type = relatedToObj.type;
        if (type === 'lead' || type === 'deal' || type === 'customer') {
          relatedTo = {
            type,
            id: relatedToObj.id,
            name: relatedToObj.name
          };
        }
      }
    }
  }
  
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
