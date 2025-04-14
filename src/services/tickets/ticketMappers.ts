
// إضافة مُرتِّبات التذاكر
import { Ticket } from "./types";

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

export const prepareTicketForDB = (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
  return {
    ...ticket,
    updated_at: new Date().toISOString()
  };
};
