
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
    // Create the base query with explicit typing to avoid deep inference
    let query = supabase
      .from('tickets')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `);
    
    // Apply filters if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    // Execute the query and extract data with explicit typing
    const result = await query.order('created_at', { ascending: false });
    const data = result.data as any[];
    const error = result.error;
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    console.log("Fetched tickets data:", data);
    
    const ticketsArray: Ticket[] = [];
    
    if (data && Array.isArray(data)) {
      for (const rawTicket of data) {
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

// Implement the fetchTicketById function with explicit typing
export const fetchTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    // Use explicit typing to avoid deep inference
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
      .single();
    
    const data = result.data as any;
    const error = result.error;
    
    if (error) {
      console.error("Error fetching ticket by id:", error);
      throw error;
    }
    
    console.log("Fetched ticket data:", data);
    
    if (!data) return null;
    
    const transformedTicket = safeTransformTicket(data);
    return mapDBTicketToTicket(transformedTicket);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
