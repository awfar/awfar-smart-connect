
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
    
    // Use Promise constructor and basic JS object to fully break type inference
    const response: any = await new Promise((resolve) => {
      query.order('created_at', { ascending: false })
        .then(res => resolve(res))
        .catch(err => {
          console.error("Error in query:", err);
          resolve({ data: [], error: err });
        });
    });
    
    if (response.error) {
      console.error("Error fetching tickets:", response.error);
      throw response.error;
    }
    
    console.log("Fetched tickets data:", response.data);
    
    const ticketsArray: Ticket[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      // Use traditional loop to avoid TypeScript inference issues
      for (let i = 0; i < response.data.length; i++) {
        // Cast to any to break the type chain completely
        const rawTicket = response.data[i] as any;
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
    // Use Promise constructor to completely bypass TypeScript's type inference
    const response: any = await new Promise((resolve) => {
      supabase
        .from('tickets')
        .select(`
          *,
          profiles:assigned_to (
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single()
        .then(res => resolve(res))
        .catch(err => {
          console.error("Error in query:", err);
          resolve({ data: null, error: err });
        });
    });
    
    if (response.error) {
      console.error("Error fetching ticket by id:", response.error);
      throw response.error;
    }
    
    console.log("Fetched ticket data:", response.data);
    
    if (!response.data) return null;
    
    // Use safeTransformTicket to ensure consistent typing
    const transformedTicket = safeTransformTicket(response.data as any);
    return mapDBTicketToTicket(transformedTicket);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
