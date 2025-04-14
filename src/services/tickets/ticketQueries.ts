
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "./types";
import { mapDBTicketToTicket, TicketFromDB } from "./ticketMappers";

// Helper function to safely transform database data to our expected format
function safeTransformTicket(ticket: any): TicketFromDB {
  return {
    id: ticket.id,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category || undefined,
    client_id: ticket.client_id || undefined,
    assigned_to: ticket.assigned_to || undefined,
    created_by: ticket.created_by || undefined,
    created_at: ticket.created_at || undefined,
    updated_at: ticket.updated_at || undefined,
    resolved_at: ticket.resolved_at || null,
    profiles: ticket.profiles
  };
}

export const fetchTickets = async (
  statusFilter?: string,
  priorityFilter?: string,
  categoryFilter?: string
): Promise<Ticket[]> => {
  try {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `);
    
    // تطبيق الفلاتر إذا تم توفيرها
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    // Directly get the data and error using type assertion to avoid deep inference
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    console.log("Fetched tickets data:", data);
    
    // Break the type instantiation chain by converting raw data to a known structure
    const ticketsArray: Ticket[] = [];
    
    if (data && Array.isArray(data)) {
      // Use a simple for loop and avoid type inference issues
      for (let i = 0; i < data.length; i++) {
        const ticket = data[i];
        // Using our helper function with type assertion to break complex type chain
        const transformedTicket = safeTransformTicket(ticket as Record<string, any>);
        ticketsArray.push(mapDBTicketToTicket(transformedTicket));
      }
    }
    
    return ticketsArray;
  } catch (error) {
    console.error("Error in fetchTickets:", error);
    return [];
  }
};

// Implement the missing fetchTicketById function
export const fetchTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching ticket by id:", error);
      throw error;
    }
    
    console.log("Fetched ticket data:", data);
    
    // Safe conversion to avoid type errors
    if (!data) return null;
    
    // Using our helper function with type assertion to break complex type chain
    const transformedTicket = safeTransformTicket(data as Record<string, any>);
    return mapDBTicketToTicket(transformedTicket);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
