import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentCreateInput } from "./types";
import { toast } from "sonner";

export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('lead_id', leadId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    
    return data as Appointment[];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("حدث خطأ أثناء تحميل المواعيد");
    return [];
  }
};

export const createAppointment = async (appointmentData: AppointmentCreateInput): Promise<Appointment> => {
  try {
    if (!appointmentData.title || !appointmentData.start_time || !appointmentData.end_time) {
      throw new Error("Missing required appointment fields");
    }

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
        created_by: appointmentData.created_by
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم إنشاء الموعد بنجاح");
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      location: data.location,
      status: data.status as AppointmentStatus,
      lead_id: data.lead_id || null,
      client_id: data.client_id,
      participants: data.participants,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("حدث خطأ أثناء إنشاء الموعد");
    throw error;
  }
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (appointmentData.title !== undefined) updateData.title = appointmentData.title;
    if (appointmentData.description !== undefined) updateData.description = appointmentData.description;
    if (appointmentData.start_time !== undefined) updateData.start_time = appointmentData.start_time;
    if (appointmentData.end_time !== undefined) updateData.end_time = appointmentData.end_time;
    if (appointmentData.location !== undefined) updateData.location = appointmentData.location;
    if (appointmentData.status !== undefined) updateData.status = appointmentData.status;
    if (appointmentData.participants !== undefined) updateData.participants = appointmentData.participants;
    if (appointmentData.lead_id !== undefined) updateData.lead_id = appointmentData.lead_id;
    if (appointmentData.client_id !== undefined) updateData.client_id = appointmentData.client_id;
    
    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("تم تحديث الموعد بنجاح");
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      location: data.location,
      status: data.status as AppointmentStatus,
      lead_id: data.lead_id || null,
      client_id: data.client_id,
      participants: data.participants,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("حدث خطأ أثناء تحديث الموعد");
    throw error;
  }
};

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
