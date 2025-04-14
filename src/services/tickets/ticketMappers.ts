
// إضافة مُرتِّبات التذاكر
import { Ticket } from "./types";

export interface TicketFromDB {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  client_id?: string;
  assigned_to?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

export const mapTicketFromDB = (data: any): Ticket => {
  return {
    id: data.id,
    subject: data.subject,
    description: data.description,
    status: data.status,
    priority: data.priority,
    category: data.category,
    client_id: data.client_id,
    assigned_to: data.assigned_to,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const mapDBTicketToTicket = (data: TicketFromDB): Ticket => {
  return {
    id: data.id,
    subject: data.subject,
    description: data.description,
    status: data.status as 'open' | 'closed',
    priority: data.priority as 'منخفض' | 'متوسط' | 'عالي' | 'عاجل',
    category: data.category,
    client_id: data.client_id,
    assigned_to: data.assigned_to,
    created_at: data.created_at,
    updated_at: data.updated_at,
    // Add additional properties like assigned staff name if profiles is available
    assignedStaffName: data.profiles ? `${data.profiles.first_name} ${data.profiles.last_name}`.trim() : undefined
  };
};

export const prepareTicketForDB = (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
  return {
    ...ticket,
    updated_at: new Date().toISOString()
  };
};

// Helper function to safely convert data types
export function safeDataConversion<T>(data: any): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
