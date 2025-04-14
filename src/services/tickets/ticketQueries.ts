
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    // Build the query
    let queryBuilder = supabase
      .from('tickets')
      .select('*, profiles!assigned_to(first_name, last_name)');
      
    // Apply filters
    if (statusFilter && statusFilter !== 'all') {
      const status = statusFilter === 'open' ? 'open' : 'closed';
      queryBuilder = queryBuilder.eq('status', status);
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      queryBuilder = queryBuilder.eq('priority', priorityFilter);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      queryBuilder = queryBuilder.eq('category', categoryFilter);
    }
    
    // Execute the query as a separate step
    const { data: rawData, error } = await queryBuilder
      .order('created_at', { ascending: false })
      // Use explicit type assertion to break the deep type inference
      .then(result => ({ 
        data: result.data as unknown[], 
        error: result.error 
      }));
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", rawData);
    
    // Handle the null case
    if (!rawData) return [];
    
    // Initialize an empty array for our tickets
    const tickets: Ticket[] = [];
    
    // Map the raw data to our known type structure
    for (const item of rawData) {
      // Use type assertion to ensure TypeScript doesn't try to infer complex types
      const rawItem = item as Record<string, any>;
      
      const ticketData: TicketFromDB = {
        id: rawItem.id,
        subject: rawItem.subject,
        description: rawItem.description,
        status: rawItem.status,
        priority: rawItem.priority,
        category: rawItem.category,
        assigned_to: rawItem.assigned_to,
        client_id: rawItem.client_id,
        created_by: rawItem.created_by,
        created_at: rawItem.created_at,
        updated_at: rawItem.updated_at,
        resolved_at: rawItem.resolved_at,
        profiles: rawItem.profiles
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
