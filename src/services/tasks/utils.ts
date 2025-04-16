
import { Task, RelatedEntityType } from './types';

// Completely detached from imported types - using raw data input
export const castToTask = (raw: any): Task => {
  // Validate and normalize status
  const status: Task['status'] = ['pending', 'in-progress', 'completed', 'cancelled'].includes(raw.status)
    ? raw.status as Task['status']
    : 'pending';
  
  // Validate and normalize priority
  const priority: Task['priority'] = ['high', 'medium', 'low'].includes(raw.priority)
    ? raw.priority as Task['priority']
    : 'medium';
  
  // Safely handle related_to as a completely isolated operation
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
  
  // Return a manually constructed task object with clear, explicit field assignments
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
    lead_id: raw.lead_id
  };
};
