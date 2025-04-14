
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
    
    // Completely avoid type inference by using vanilla JS approach
    const result = await query.order('created_at', { ascending: false }) as any;
    
    if (result.error) {
      console.error("Error fetching tickets:", result.error);
      throw result.error;
    }
    
    console.log("Fetched tickets data:", result.data);
    
    // Create a simple array without complex typing
    const ticketsArray: Ticket[] = [];
    
    if (result.data && Array.isArray(result.data)) {
      // Use a simple for loop to avoid complex type inference
      for (let i = 0; i < result.data.length; i++) {
        const rawTicket = result.data[i];
        // Explicitly map to our known structure
        const transformedTicket = safeTransformTicket(rawTicket);
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
    // Completely avoid type inference by using vanilla JS approach
    const result = await supabase
      .from('tickets')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single() as any;
    
    if (result.error) {
      console.error("Error fetching ticket by id:", result.error);
      throw result.error;
    }
    
    console.log("Fetched ticket data:", result.data);
    
    // Safe conversion to avoid type errors
    if (!result.data) return null;
    
    // Explicitly map to our known structure
    const transformedTicket = safeTransformTicket(result.data);
    return mapDBTicketToTicket(transformedTicket);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
