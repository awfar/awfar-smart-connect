
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB } from "./types";
import { mapDBTicketToTicket } from "./ticketMappers";

export const fetchTickets = async (statusFilter?: string, priorityFilter?: string, categoryFilter?: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching tickets with filters:", { statusFilter, priorityFilter, categoryFilter });
    
    // بناء استعلام قاعدة البيانات الأساسي
    let query = supabase
      .from('tickets')
      .select('*, profiles!assigned_to(first_name, last_name)');
      
    // تطبيق الفلاتر
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
    
    // تنفيذ الاستعلام وترتيب النتائج
    const { data, error } = await query
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", data);
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // تحويل البيانات الخام إلى كائنات من نوع Ticket
    const tickets = data.map(rawTicket => {
      const typedTicket = rawTicket as Record<string, any>;
      
      const ticket: TicketFromDB = {
        id: String(typedTicket.id || ''),
        subject: String(typedTicket.subject || ''),
        description: String(typedTicket.description || ''),
        status: String(typedTicket.status || 'open'),
        priority: String(typedTicket.priority || 'متوسط'),
        category: typedTicket.category ? String(typedTicket.category) : undefined,
        assigned_to: typedTicket.assigned_to ? String(typedTicket.assigned_to) : undefined,
        client_id: typedTicket.client_id ? String(typedTicket.client_id) : undefined,
        created_by: typedTicket.created_by ? String(typedTicket.created_by) : undefined,
        created_at: typedTicket.created_at ? String(typedTicket.created_at) : undefined,
        updated_at: typedTicket.updated_at ? String(typedTicket.updated_at) : undefined,
        resolved_at: typedTicket.resolved_at ? String(typedTicket.resolved_at) : null,
        profiles: typedTicket.profiles ? {
          first_name: String(typedTicket.profiles.first_name || ''),
          last_name: String(typedTicket.profiles.last_name || '')
        } : null
      };
      
      return mapDBTicketToTicket(ticket);
    });
    
    return tickets;
  } catch (error) {
    console.error("خطأ في جلب التذاكر:", error);
    toast.error("فشل في جلب قائمة التذاكر");
    return [];
  }
};
