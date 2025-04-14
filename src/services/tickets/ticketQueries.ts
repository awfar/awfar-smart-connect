
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    let query = supabase
      .from('tickets')
      .select('*, profiles!assigned_to(first_name, last_name)');
      
    // Apply filters with explicit type handling
    if (statusFilter && statusFilter !== 'all') {
      const status = statusFilter === 'open' ? 'open' : 'closed';
      query = query.eq('status', status);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    // Execute query with explicit type handling
    const { data, error } = await query
      .order('created_at', { ascending: false })
      // Cut the type inference chain with explicit any
      .then(result => result as any);
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", data);
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Map the raw data to typed Ticket objects with explicit casting
    const tickets: Ticket[] = [];
    
    for (const rawItem of data) {
      // Treat as plain object to avoid type inference issues
      const rawTicket = rawItem as any;
      
      // Create a well-defined TicketFromDB object with explicit types
      const ticketFromDB: TicketFromDB = {
        id: String(rawTicket.id || ''),
        subject: String(rawTicket.subject || ''),
        description: String(rawTicket.description || ''),
        status: String(rawTicket.status || 'open'),
        priority: String(rawTicket.priority || 'متوسط'),
        category: rawTicket.category ? String(rawTicket.category) : undefined,
        assigned_to: rawTicket.assigned_to ? String(rawTicket.assigned_to) : undefined,
        client_id: rawTicket.client_id ? String(rawTicket.client_id) : undefined,
        created_by: rawTicket.created_by ? String(rawTicket.created_by) : undefined,
        created_at: rawTicket.created_at ? String(rawTicket.created_at) : undefined,
        updated_at: rawTicket.updated_at ? String(rawTicket.updated_at) : undefined,
        resolved_at: rawTicket.resolved_at ? String(rawTicket.resolved_at) : null,
        profiles: rawTicket.profiles ? {
          first_name: String(rawTicket.profiles.first_name || ''),
          last_name: String(rawTicket.profiles.last_name || '')
        } : null
      };
      
      // Use the mapper to convert TicketFromDB to Ticket
      tickets.push(mapDBTicketToTicket(ticketFromDB));
    }
    
    return tickets;
  } catch (error) {
    console.error("خطأ في جلب التذاكر:", error);
    toast.error("فشل في جلب قائمة التذاكر");
    return [];
  }
};
