
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
    // Create the base query builder but don't chain the query yet
    const queryBuilder = supabase.from('tickets');
    
    // Build the select statement as a string to avoid deep type inference
    const selectString = `
      *,
      profiles:assigned_to (
        first_name,
        last_name
      )
    `;
    
    // Start building the query
    let query = queryBuilder.select(selectString);
    
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
    
    // Execute the query as a separate step
    const { data: rawData, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    console.log("Fetched tickets data:", rawData);
    
    // Use explicit type assertions and manual transformation
    const ticketsArray: Ticket[] = [];
    
    // Safely process the data with type assertions
    if (rawData) {
      for (let i = 0; i < rawData.length; i++) {
        const transformedTicket = safeTransformTicket(rawData[i]);
        ticketsArray.push(mapDBTicketToTicket(transformedTicket));
      }
    }
    
    return ticketsArray;
  } catch (error) {
    console.error("Error in fetchTickets:", error);
    return [];
  }
};

export const fetchTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    // Build the query with separate steps to avoid deep type inference
    const queryBuilder = supabase.from('tickets');
    
    // Use string for select to avoid type inference issues
    const selectString = `
      *,
      profiles:assigned_to (
        first_name,
        last_name
      )
    `;
    
    // Execute the query as a separate step with destructuring assignment
    const { data: rawData, error } = await queryBuilder
      .select(selectString)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching ticket by id:", error);
      throw error;
    }
    
    if (!rawData) return null;
    
    console.log("Fetched ticket data:", rawData);
    
    // Use our safe transformer to control the typing
    const transformedTicket = safeTransformTicket(rawData);
    return mapDBTicketToTicket(transformedTicket);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
