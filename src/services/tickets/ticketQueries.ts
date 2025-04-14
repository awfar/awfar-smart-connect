
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
    // Prepare query parameters
    const filters: Record<string, string> = {};
    if (statusFilter && statusFilter !== 'all') {
      filters['status'] = statusFilter;
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      filters['priority'] = priorityFilter;
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      filters['category'] = categoryFilter;
    }
    
    // Execute the query without chaining to avoid deep type inference
    // Use type assertion to any to bypass TypeScript's type checking for the query
    const result = await (supabase as any)
      .from('tickets')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });
      
    // Apply filters after query execution if needed
    let rawData = result.data || [];
    const error = result.error;
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    // Apply manual filtering instead of in the query if filters exist
    if (Object.keys(filters).length > 0) {
      rawData = rawData.filter((ticket: any) => {
        return Object.entries(filters).every(([key, value]) => ticket[key] === value);
      });
    }
    
    console.log("Fetched tickets data:", rawData);
    
    // Manually transform data to avoid deep type inference
    const ticketsArray: Ticket[] = [];
    
    // Safely process the data with manual transformation
    for (let i = 0; i < rawData.length; i++) {
      const transformedTicket = safeTransformTicket(rawData[i]);
      ticketsArray.push(mapDBTicketToTicket(transformedTicket));
    }
    
    return ticketsArray;
  } catch (error) {
    console.error("Error in fetchTickets:", error);
    return [];
  }
};

export const fetchTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    // Execute query with explicit type casting to avoid deep inference
    const result = await (supabase as any)
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
    
    const rawData = result.data;
    const error = result.error;
    
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
