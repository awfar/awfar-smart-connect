
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
    
    // Break the type instantiation chain by converting raw data to a known structure
    const ticketsArray = [];
    
    if (data && Array.isArray(data)) {
      for (const ticket of data) {
        // Manually extract only the fields we need
        ticketsArray.push(mapDBTicketToTicket({
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
        } as TicketFromDB));
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
    
    // Map directly to Ticket type to avoid excessive type recursion
    return mapDBTicketToTicket({
      id: data.id,
      subject: data.subject,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      client_id: data.client_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
      resolved_at: data.resolved_at,
      profiles: data.profiles
    } as TicketFromDB);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
