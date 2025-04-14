
import { Ticket, TicketFromDB } from "./types";

// Helper function to map database tickets to our Ticket interface
export function mapDBTicketToTicket(ticket: TicketFromDB): Ticket {
  return {
    ...ticket,
    status: ticket.status === 'open' ? 'open' : 'closed',
    priority: (ticket.priority || 'متوسط') as Ticket['priority']
  };
}

// Helper to safely convert Supabase data to plain objects (breaks type inference chain)
export function safeDataConversion<T>(data: any): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
