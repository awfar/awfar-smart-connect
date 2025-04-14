
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "./types";
import { mapDBTicketToTicket, TicketFromDB, safeDataConversion } from "./ticketMappers";

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
    
    // Break the circular reference by converting to plain objects first
    const plainData = JSON.parse(JSON.stringify(data || []));
    
    // Return mapped tickets
    return plainData.map((ticket: any) => mapDBTicketToTicket(ticket as TicketFromDB));
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
    
    // Break the circular reference by converting to plain object
    const plainData = JSON.parse(JSON.stringify(data));
    
    return mapDBTicketToTicket(plainData as TicketFromDB);
  } catch (error) {
    console.error("Error in fetchTicketById:", error);
    return null;
  }
};
