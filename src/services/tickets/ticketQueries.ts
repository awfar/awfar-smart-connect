
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    // Construct the base query
    let queryStr = '*, profiles!assigned_to(first_name, last_name)';
    
    // Execute the query - we'll filter the results in JavaScript after fetching
    const { data, error } = await supabase
      .from('tickets')
      .select(queryStr)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    // Make sure data is an array before proceeding
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Apply filters manually to break the chain of type inference
    // Cast data to any[] first to avoid type errors
    let filteredData = [...data] as any[];
    
    if (statusFilter && statusFilter !== 'all') {
      const status = statusFilter === 'open' ? 'open' : 'closed';
      filteredData = filteredData.filter(item => 
        item && typeof item === 'object' && 'status' in item && item.status === status
      );
    }
    
    if (priorityFilter && priorityFilter !== 'all') {
      filteredData = filteredData.filter(item => 
        item && typeof item === 'object' && 'priority' in item && item.priority === priorityFilter
      );
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      filteredData = filteredData.filter(item => 
        item && typeof item === 'object' && 'category' in item && item.category === categoryFilter
      );
    }
    
    console.log("Tickets fetched:", filteredData);
    
    // Map the raw data to typed Ticket objects with explicit casting
    const tickets: Ticket[] = [];
    
    for (const rawItem of filteredData) {
      // Treat as plain object to avoid type inference issues
      const rawTicket = rawItem as any;
      
      // Create a well-defined TicketFromDB object with explicit types
      const ticketFromDB: TicketFromDB = {
        id: String(rawTicket.id || ''),
        subject: String(rawTicket.subject || ''),
        description: String(rawTicket.description || ''),
        status: String(rawTicket.status || 'open'),
        priority: String(rawTicket.priority || 'متوسط'),
        category: rawTicket.category ? String(rawTicket.category) : undefined,
        assigned_to: rawTicket.assigned_to ? String(rawTicket.assigned_to) : undefined,
        client_id: rawTicket.client_id ? String(rawTicket.client_id) : undefined,
        created_by: rawTicket.created_by ? String(rawTicket.created_by) : undefined,
        created_at: rawTicket.created_at ? String(rawTicket.created_at) : undefined,
        updated_at: rawTicket.updated_at ? String(rawTicket.updated_at) : undefined,
        resolved_at: rawTicket.resolved_at ? String(rawTicket.resolved_at) : null,
        profiles: rawTicket.profiles ? {
          first_name: String(rawTicket.profiles.first_name || ''),
          last_name: String(rawTicket.profiles.last_name || '')
        } : null
      };
      
      // Use the mapper to convert TicketFromDB to Ticket
      tickets.push(mapDBTicketToTicket(ticketFromDB));
    }
    
    return tickets;
  } catch (error) {
    console.error("خطأ في جلب التذاكر:", error);
    toast.error("فشل في جلب قائمة التذاكر");
    return [];
  }
};
