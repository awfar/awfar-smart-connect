
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "./types";
import { mapDBTicketToTicket, TicketFromDB } from "./ticketMappers";

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
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
    
    console.log("Fetched tickets data:", data);
    
    // Convert the data to plain objects to avoid any circular references
    // Using a simple approach to break the type instantiation chain
    const plainTickets = JSON.parse(JSON.stringify(data || []));
    
    // Map the tickets to the expected format
    return plainTickets.map((ticket: any) => {
      return mapDBTicketToTicket({
        id: ticket.id,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        client_id: ticket.client_id,
        assigned_to: ticket.assigned_to,
        created_by: ticket.created_by,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        resolved_at: ticket.resolved_at,
        profiles: ticket.profiles
      });
    });
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
    
    // Break type references to prevent deep instantiation issues
    const plainData = JSON.parse(JSON.stringify(data));
    
    // Map directly to Ticket type to avoid excessive type recursion
    return mapDBTicketToTicket({
      id: plainData.id,
      subject: plainData.subject,
      description: plainData.description,
      status: plainData.status,
      priority: plainData.priority,
      category: plainData.category,
      client_id: plainData.client_id,
      assigned_to: plainData.assigned_to,
      created_by: plainData.created_by,
      created_at: plainData.created_at,
      updated_at: plainData.updated_at,
      resolved_at: plainData.resolved_at,
      profiles: plainData.profiles
    });
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
