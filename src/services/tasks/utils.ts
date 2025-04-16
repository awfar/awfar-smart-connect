
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
  
  try {
    if (data.related_to) {
      // Handle the case where related_to is a string (JSON)
      if (typeof data.related_to === 'string') {
        const parsed = JSON.parse(data.related_to);
        if (parsed && typeof parsed === 'object') {
          const type = parsed.type;
          if (type === 'lead' || type === 'deal' || type === 'customer') {
            relatedTo = {
              type,
              id: String(parsed.id),
              name: String(parsed.name)
            };
          }
        }
      }
      // Handle the case where related_to is already an object
      else if (data.related_to && typeof data.related_to === 'object') {
        const relatedToObj = data.related_to as Record<string, unknown>;
        const type = relatedToObj.type as string;
        
        if (type === 'lead' || type === 'deal' || type === 'customer') {
          relatedTo = {
            type: type as RelatedEntityReference['type'],
            id: String(relatedToObj.id || ''),
            name: String(relatedToObj.name || '')
          };
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse related_to:', e);
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
