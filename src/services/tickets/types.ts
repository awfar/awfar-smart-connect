
// Define all ticket-related types
export interface Ticket {
  id?: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'عاجل';
  category?: string;
  assigned_to?: string;
  client_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

// Define a separate interface for data coming from the database
export interface TicketFromDB {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  assigned_to?: string;
  client_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}
