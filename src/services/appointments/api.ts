
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "./types";
import { toast } from "sonner";

// Get appointments for a specific lead
export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('lead_id', leadId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("حدث خطأ أثناء تحميل المواعيد");
    return [];
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        title: appointmentData.title,
        description: appointmentData.description,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        location: appointmentData.location,
        status: appointmentData.status || 'scheduled',
        lead_id: appointmentData.lead_id,
        client_id: appointmentData.client_id,
        participants: appointmentData.participants,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم إنشاء الموعد بنجاح");
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("حدث خطأ أثناء إنشاء الموعد");
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        title: appointmentData.title,
        description: appointmentData.description,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        location: appointmentData.location,
        status: appointmentData.status,
        participants: appointmentData.participants,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم تحديث الموعد بنجاح");
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("حدث خطأ أثناء تحديث الموعد");
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
      
    if (error) throw error;
    
    toast.success("تم حذف الموعد بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    toast.error("حدث خطأ أثناء حذف الموعد");
    return false;
  }
};
