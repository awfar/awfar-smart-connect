
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    // Build the query
    let queryBuilder = supabase
      .from('tickets')
      .select('*, profiles!assigned_to(first_name, last_name)');
      
    // Apply filters
    if (statusFilter && statusFilter !== 'all') {
      const status = statusFilter === 'open' ? 'open' : 'closed';
      queryBuilder = queryBuilder.eq('status', status);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      queryBuilder = queryBuilder.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      queryBuilder = queryBuilder.eq('category', categoryFilter);
    }
    
    // Convert to plain query with explicit typing to break type inference chain
    const query = queryBuilder.order('created_at', { ascending: false });
    
    // Execute the query as a plain fetch operation
    const { data, error } = await query;
    
    // Explicitly type the result as unknown to break the chain
    const rawTickets = data as unknown[];
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", rawTickets);
    
    // Handle the null case
    if (!rawTickets) return [];
    
    // Initialize an empty array for our tickets
    const tickets: Ticket[] = [];
    
    // Map the raw data to our known type structure
    for (const item of rawTickets) {
      // Safely convert to a simple object type
      const rawItem = item as Record<string, unknown>;
      
      const ticketData: TicketFromDB = {
        id: String(rawItem.id),
        subject: String(rawItem.subject),
        description: String(rawItem.description),
        status: String(rawItem.status),
        priority: String(rawItem.priority || 'متوسط'),
        category: rawItem.category ? String(rawItem.category) : undefined,
        assigned_to: rawItem.assigned_to ? String(rawItem.assigned_to) : undefined,
        client_id: rawItem.client_id ? String(rawItem.client_id) : undefined,
        created_by: rawItem.created_by ? String(rawItem.created_by) : undefined,
        created_at: rawItem.created_at ? String(rawItem.created_at) : undefined,
        updated_at: rawItem.updated_at ? String(rawItem.updated_at) : undefined,
        resolved_at: rawItem.resolved_at ? String(rawItem.resolved_at) : null,
        profiles: rawItem.profiles ? {
          first_name: String((rawItem.profiles as Record<string, unknown>).first_name || ''),
          last_name: String((rawItem.profiles as Record<string, unknown>).last_name || '')
        } : null
      };
      
      const ticket = mapDBTicketToTicket(ticketData);
      tickets.push(ticket);
    }
    
    return tickets;
  } catch (error) {
    console.error("خطأ في جلب التذاكر:", error);
    toast.error("فشل في جلب قائمة التذاكر");
    return [];
  }
};
