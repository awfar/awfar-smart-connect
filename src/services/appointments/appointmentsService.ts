
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentCreateInput } from "./types";

// Get a list of appointments with optional filters
export const getAppointments = async (filters?: Record<string, any>): Promise<Appointment[]> => {
  try {
    console.log("Fetching appointments with filters:", filters);
    let query = supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: true });
    
    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
    
    console.log("Retrieved appointments:", data?.length);
    return data as Appointment[] || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("فشل في جلب المواعيد");
    return [];
  }
};

// Get a single appointment by ID
export const getAppointment = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching appointment:", error);
      throw error;
    }
    
    return data as Appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    toast.error("فشل في جلب الموعد");
    return null;
  }
};

// Create a new appointment
export const createAppointment = async (appointment: AppointmentCreateInput): Promise<Appointment | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const newAppointment = {
      ...appointment,
      created_by: userData.user?.id || null
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([newAppointment])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
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

// Update an existing appointment
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
    
    toast.success("تم تحديث الموعد بنجاح");
    return data as Appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("فشل في تحديث الموعد");
    return null;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
    
    toast.success("تم حذف الموعد بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    toast.error("فشل في حذف الموعد");
    return false;
  }
};
