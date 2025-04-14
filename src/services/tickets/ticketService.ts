
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, TicketFromDB, mapDBTicketToTicket } from "./types";

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
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في جلب قائمة التذاكر");
      return [];
    }
    
    console.log("Tickets fetched:", data);
    
    // Use a simpler approach - convert to any[] first
    const ticketsData: any[] = data || [];
    // Then explicitly map each record to our TicketFromDB type
    return ticketsData.map(item => mapDBTicketToTicket(item));
  } catch (error) {
    console.error("خطأ في جلب التذاكر:", error);
    toast.error("فشل في جلب قائمة التذاكر");
    return [];
  }
};

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket | null> => {
  try {
    console.log("Creating ticket:", ticketData);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول لإنشاء تذكرة");
      return null;
    }
    
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ...ticketData,
        created_by: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating ticket:", error);
      toast.error("فشل في إنشاء التذكرة");
      return null;
    }
    
    console.log("Ticket created:", data);
    toast.success("تم إنشاء التذكرة بنجاح");
    return mapDBTicketToTicket(data as TicketFromDB);
  } catch (error) {
    console.error("خطأ في إنشاء التذكرة:", error);
    toast.error("فشل في إنشاء التذكرة");
    return null;
  }
};

export const updateTicket = async (id: string, ticketData: Partial<Ticket>): Promise<Ticket | null> => {
  try {
    console.log("Updating ticket:", id, ticketData);
    
    const { data, error } = await supabase
      .from('tickets')
      .update({
        ...ticketData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating ticket:", error);
      toast.error("فشل في تحديث التذكرة");
      return null;
    }
    
    console.log("Ticket updated:", data);
    toast.success("تم تحديث التذكرة بنجاح");
    return mapDBTicketToTicket(data as TicketFromDB);
  } catch (error) {
    console.error("خطأ في تحديث التذكرة:", error);
    toast.error("فشل في تحديث التذكرة");
    return null;
  }
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting ticket:", id);
    
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting ticket:", error);
      toast.error("فشل في حذف التذكرة");
      return false;
    }
    
    console.log("Ticket deleted successfully");
    toast.success("تم حذف التذكرة بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف التذكرة:", error);
    toast.error("فشل في حذف التذكرة");
    return false;
  }
};
