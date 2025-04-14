
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
    
    // Execute the query without type inference
    // First, get the SQL query as a string to completely break the type chain
    const orderBy = { ascending: false };
    const { data: rawData, error } = await (queryBuilder as any)
      .order('created_at', orderBy)
      .then((response: any) => response);
    
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
    
    // Map the raw data to our known type structure using explicit casting
    for (const item of rawData) {
      // Cast to a simple record type to avoid deep type inference
      const rawItem: Record<string, any> = item;
      
      // Create ticket data with explicit type casting for each property
      const ticketData: TicketFromDB = {
        id: String(rawItem.id || ''),
        subject: String(rawItem.subject || ''),
        description: String(rawItem.description || ''),
        status: String(rawItem.status || 'open'),
        priority: String(rawItem.priority || 'متوسط'),
        category: rawItem.category ? String(rawItem.category) : undefined,
        assigned_to: rawItem.assigned_to ? String(rawItem.assigned_to) : undefined,
        client_id: rawItem.client_id ? String(rawItem.client_id) : undefined,
        created_by: rawItem.created_by ? String(rawItem.created_by) : undefined,
        created_at: rawItem.created_at ? String(rawItem.created_at) : undefined,
        updated_at: rawItem.updated_at ? String(rawItem.updated_at) : undefined,
        resolved_at: rawItem.resolved_at ? String(rawItem.resolved_at) : null,
        profiles: rawItem.profiles ? {
          first_name: String((rawItem.profiles as Record<string, any>).first_name || ''),
          last_name: String((rawItem.profiles as Record<string, any>).last_name || '')
        } : null
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
