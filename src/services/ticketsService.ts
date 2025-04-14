
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Ticket {
  id?: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'عاجل';
  category?: string;
  assigned_to?: string;
  client_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

// Define a separate interface for data coming from the database
interface TicketFromDB {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  assigned_to?: string;
  client_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

// Helper function to map database tickets to our Ticket interface
function mapDBTicketToTicket(ticket: TicketFromDB): Ticket {
  return {
    ...ticket,
    status: ticket.status === 'open' ? 'open' : 'closed',
    priority: (ticket.priority || 'متوسط') as Ticket['priority']
  };
}

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
    
    // Fix: First cast to any[] to break the deep type chain
    const ticketsData = (data || []) as any[];
    // Then explicitly map to our desired type
    return ticketsData.map(item => mapDBTicketToTicket(item as TicketFromDB));
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

export const fetchClients = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id, first_name, last_name')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    
    return data?.map(client => ({
      id: client.id,
      name: `${client.first_name} ${client.last_name}`
    })) || [];
  } catch (error) {
    console.error("خطأ في جلب العملاء:", error);
    return [];
  }
};

export const fetchStaff = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .order('first_name');
    
    if (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
    
    return data?.map(staff => ({
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`
    })) || [];
  } catch (error) {
    console.error("خطأ في جلب الموظفين:", error);
    return [];
  }
};
