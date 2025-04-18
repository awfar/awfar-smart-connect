
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentCreateInput } from "./types";
import { toast } from "sonner";

export const fetchAppointments = async (filters?: { lead_id?: string; status?: string }): Promise<Appointment[]> => {
  try {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: true });

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }

    return (data || []) as Appointment[];
  } catch (error) {
    console.error("Error in fetchAppointments:", error);
    toast.error("فشل في تحميل المواعيد");
    return [];
  }
};

export const fetchAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  return fetchAppointments({ lead_id: leadId });
};

export const getAppointment = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
};

export const createAppointment = async (appointment: AppointmentCreateInput): Promise<Appointment | null> => {
  try {
    // Validate required fields
    if (!appointment.title) {
      throw new Error("Title is required");
    }
    if (!appointment.start_time) {
      throw new Error("Start time is required");
    }
    if (!appointment.end_time) {
      throw new Error("End time is required");
    }

    // Ensure we're inserting a single object with required fields
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("تم إنشاء الموعد بنجاح");
    return data as Appointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("فشل في إنشاء الموعد");
    return null;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم تحديث الموعد بنجاح");
    return data as Appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("فشل في تحديث الموعد");
    return null;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success("تم حذف الموعد بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    toast.error("فشل في حذف الموعد");
    return false;
  }
};
