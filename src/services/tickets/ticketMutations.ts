
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket } from "./types";
import { mapDBTicketToTicket, safeDataConversion } from "./ticketMappers";

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
    
    if (!data) return null;
    
    // Disconnect from TypeScript's type inference by converting to plain object
    const plainData = safeDataConversion<Record<string, any>>(data);
    
    return mapDBTicketToTicket({
      id: plainData.id,
      subject: plainData.subject,
      description: plainData.description,
      status: plainData.status,
      priority: plainData.priority,
      category: plainData.category,
      assigned_to: plainData.assigned_to,
      client_id: plainData.client_id,
      created_by: plainData.created_by,
      created_at: plainData.created_at,
      updated_at: plainData.updated_at,
      resolved_at: plainData.resolved_at,
      profiles: plainData.profiles
    });
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
    
    if (!data) return null;
    
    // Disconnect from TypeScript's type inference by converting to plain object
    const plainData = safeDataConversion<Record<string, any>>(data);
    
    return mapDBTicketToTicket({
      id: plainData.id,
      subject: plainData.subject,
      description: plainData.description,
      status: plainData.status,
      priority: plainData.priority,
      category: plainData.category,
      assigned_to: plainData.assigned_to,
      client_id: plainData.client_id,
      created_by: plainData.created_by,
      created_at: plainData.created_at,
      updated_at: plainData.updated_at,
      resolved_at: plainData.resolved_at,
      profiles: plainData.profiles
    });
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
