
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export interface Appointment {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  client_id?: string | null;  // Can be a lead ID
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  participants?: string[] | null;
}

// Get all appointments
export const getAppointments = async (filters: Record<string, any> = {}): Promise<Appointment[]> => {
  try {
    let query = supabase.from('appointments').select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    if (filters.date_from && filters.date_to) {
      query = query
        .gte('start_time', filters.date_from)
        .lte('start_time', filters.date_to);
    }
    
    // Get data
    const { data, error } = await query.order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching appointments:", error);
      toast.error("فشل في تحميل المواعيد");
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("فشل في تحميل المواعيد");
    return [];
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
};

// Create a new appointment
export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
): Promise<Appointment | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    const newAppointment = {
      ...appointment,
      created_by: userId || appointment.created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([newAppointment])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      toast.error("فشل في إنشاء الموعد");
      throw error;
    }
    
    toast.success("تم إنشاء الموعد بنجاح");
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("فشل في إنشاء الموعد");
    return null;
  }
};

// Update an existing appointment
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    const appointmentUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      toast.error("فشل في تحديث الموعد");
      throw error;
    }
    
    toast.success("تم تحديث الموعد بنجاح");
    return data;
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
      toast.error("فشل في حذف الموعد");
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
