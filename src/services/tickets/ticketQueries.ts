
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
    
    // Using a separate variable instead of chaining to avoid type depth issues
    const result = await query.order('created_at', { ascending: false });
    const { data, error } = result;
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", data);
    
    // Initialize an empty array for our tickets
    const tickets: Ticket[] = [];
    
    // Handle the null case
    if (!data) return [];
    
    // Force type assertion to break TypeScript inference chain
    const dataArray = data as any[];
    
    // Explicitly map each item to our known type structure
    for (const item of dataArray) {
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
