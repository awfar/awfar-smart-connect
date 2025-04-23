
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  start_time?: string | null;
  type?: string;
  lead_id?: string | null;
  contact_id?: string | null;
  company_id?: string | null;
  deal_id?: string | null;
  appointment_id?: string | null;
  assigned_to?: string | null;
  assigned_to_name?: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  related_to?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string | null;
  start_time?: string | null;
  type?: string;
  lead_id?: string | null;
  contact_id?: string | null;
  company_id?: string | null;
  deal_id?: string | null;
  appointment_id?: string | null;
  assigned_to?: string | null;
  assigned_to_name?: string;
  created_by?: string | null;
  related_to?: {
    type: string;
    id: string;
    name: string;
  };
}

// Type guard for related_to
export function isValidRelatedTo(value: unknown): value is Task['related_to'] {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string'
  );
}

// Safely cast database response to Task type
export function castToTask(data: Record<string, any>): Task {
  let relatedTo = undefined;
  if (data.related_to) {
    try {
      const parsed = typeof data.related_to === 'string' 
        ? JSON.parse(data.related_to) 
        : data.related_to;
      if (isValidRelatedTo(parsed)) {
        relatedTo = parsed;
      }
    } catch (e) {
      console.error('Failed to parse related_to:', e);
    }
  }

  // Ensure status is one of the allowed values
  let status = data.status;
  if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    status = 'pending';
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: status as Task['status'],
    priority: data.priority as Task['priority'],
    due_date: data.due_date,
    start_time: data.start_time,
    type: data.type,
    lead_id: data.lead_id,
    contact_id: data.contact_id,
    company_id: data.company_id,
    deal_id: data.deal_id,
    appointment_id: data.appointment_id,
    assigned_to: data.assigned_to,
    assigned_to_name: data.assigned_to_name,
    created_by: data.created_by,
    created_at: data.created_at,
    updated_at: data.updated_at,
    related_to: relatedTo
  };
}
