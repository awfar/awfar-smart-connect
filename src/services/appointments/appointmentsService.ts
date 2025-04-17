
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "./types";
import { toast } from "sonner";

// Define filter type explicitly to avoid infinite type instantiation
interface AppointmentFilter {
  lead_id?: string;
  client_id?: string;
  status?: string;
  created_by?: string;
}

export async function fetchAppointments(filters?: AppointmentFilter): Promise<Appointment[]> {
  try {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      // Use explicit type casting to prevent infinite type instantiation
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          // Cast key to keyof AppointmentFilter to avoid type errors
          query = query.eq(key as keyof AppointmentFilter, value);
        }
      });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Appointment[];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    toast.error('حدث خطأ في جلب المواعيد');
    return [];
  }
}

export async function fetchAppointmentsByLeadId(leadId: string): Promise<Appointment[]> {
  return fetchAppointments({ lead_id: leadId });
}

export async function createAppointment(appointment: Partial<Appointment>): Promise<Appointment | null> {
  try {
    // Fix: Ensure we're passing a single object, not an array
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment]) // Insert expects an array, but with a single object
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم إضافة الموعد بنجاح');
    return data as Appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    toast.error('حدث خطأ في إضافة الموعد');
    return null;
  }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم تحديث الموعد بنجاح');
    return data as Appointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    toast.error('حدث خطأ في تحديث الموعد');
    return null;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('تم حذف الموعد بنجاح');
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    toast.error('حدث خطأ في حذف الموعد');
    return false;
  }
}

// Add these missing functions to match the export in index.ts
export async function getAppointments(filters?: AppointmentFilter): Promise<Appointment[]> {
  return fetchAppointments(filters);
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    toast.error('حدث خطأ في جلب الموعد');
    return null;
  }
}
