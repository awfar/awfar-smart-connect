
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket, safeDataConversion } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    let query = supabase
      .from('tickets')
      .select('*, profiles!assigned_to(first_name, last_name)');
      
    // Apply filters
    if (statusFilter && statusFilter !== 'all') {
      const status = statusFilter === 'open' ? 'open' : 'closed';
      query = query.eq('status', status);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    // Completely break the type chain by executing the query and storing the raw result
    const rawResponse = await query.order('created_at', { ascending: false });
    
    // Extract data and error as plain objects
    const error = rawResponse.error;
    // Use any to break the type inference chain completely
    const rawData: any = rawResponse.data;
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", rawData);
    
    // Initialize an empty array for our tickets
    const tickets: Ticket[] = [];
    
    // Handle the null case
    if (!rawData) return [];
    
    // Explicitly map each item to our known type structure
    for (const item of rawData) {
      const ticketData: TicketFromDB = {
        id: item.id,
        subject: item.subject,
        description: item.description,
        status: item.status,
        priority: item.priority,
        category: item.category,
        assigned_to: item.assigned_to,
        client_id: item.client_id,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        resolved_at: item.resolved_at,
        profiles: item.profiles
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
