
import { Task, RelatedEntityType } from './types';

/**
 * Safely converts raw data to a Task object
 * IMPORTANT: Uses explicit type handling to avoid deep type inference
 * @param raw Any raw data from database or API
 * @returns A properly formatted Task object
 */
export const castToTask = (raw: any): Task => {
  // Validate and normalize status with explicit string assignment
  const status = ['pending', 'in_progress', 'completed', 'cancelled'].includes(raw.status)
    ? raw.status 
    : 'pending';
  
  // Validate and normalize priority with explicit string assignment
  const priority = ['high', 'medium', 'low'].includes(raw.priority)
    ? raw.priority
    : 'medium';
  
  // Isolated handling for related_to to prevent recursive type issues
  let relatedTo: { type: RelatedEntityType; id: string; name: string } | undefined = undefined;
  
  if (raw.related_to) {
    try {
      // Handle string JSON format from database
      if (typeof raw.related_to === 'string') {
        const parsed = JSON.parse(raw.related_to);
        // Validate fields directly without type inference
        if (parsed && typeof parsed === 'object') {
          const type = parsed.type;
          if (type === 'lead' || type === 'deal' || type === 'customer') {
            relatedTo = {
              type,
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
  
  // Return a manually constructed task object with explicit field assignments
  return {
    id: String(raw.id),
    title: String(raw.title),
    description: raw.description ? String(raw.description) : undefined,
    status,
    priority,
    due_date: raw.due_date,
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    assigned_to: raw.assigned_to,
    assigned_to_name: raw.assigned_to_name,
    related_to: relatedTo,
    lead_id: raw.lead_id,
    related_to_type: raw.related_to_type,
    related_to_id: raw.related_to_id,
    related_to_name: raw.related_to_name
  };
};
