
import { Appointment } from "./types";
import { fetchAppointmentsByLeadId } from "./appointmentsCrud";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// This file serves as an intermediate layer for appointment-related API calls
// Allows for easier mocking in tests and additional processing if needed

export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  try {
    if (!leadId || leadId === 'none') {
      console.log("No valid lead ID provided for getAppointmentsByLeadId");
      return [];
    }
    
    // Pass through to the implementation in appointmentsCrud
    const appointments = await fetchAppointmentsByLeadId(leadId);
    return Array.isArray(appointments) ? appointments : [];
  } catch (error) {
    console.error("Error in getAppointmentsByLeadId:", error);
    return [];
  }
};

// Add functions to create, update, and delete appointments
export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Ensure required fields are present
    if (!appointmentData.title || !appointmentData.start_time || !appointmentData.end_time) {
      throw new Error("Missing required fields for appointment");
    }

    // Get current user for created_by field if not provided
    if (!appointmentData.created_by) {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        appointmentData.created_by = authData.session.user.id;
      }
    }
    
    // Create appointment in Supabase - ensure end_time is non-optional
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        title: appointmentData.title,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        description: appointmentData.description,
        lead_id: appointmentData.lead_id,
        location: appointmentData.location,
        created_by: appointmentData.created_by,
        status: appointmentData.status || 'scheduled',
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }

    // Log the activity
    await logAppointmentActivity(data.id, 'created', appointmentData.lead_id);
    
    // Cast the data to our Appointment type
    return data as unknown as Appointment;
  } catch (error) {
    console.error("Error in createAppointment:", error);
    throw error;
  }
};

export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Ensure ID is present
    if (!id) {
      throw new Error("No appointment ID provided for update");
    }
    
    // Update appointment in Supabase
    const { data, error } = await supabase
      .from('appointments')
      .update({
        title: appointmentData.title,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        description: appointmentData.description,
        lead_id: appointmentData.lead_id,
        location: appointmentData.location,
        status: appointmentData.status || undefined,
        // Add other fields as needed
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
    
    // Log the activity
    await logAppointmentActivity(id, 'updated', appointmentData.lead_id);
    
    // Cast the data to our Appointment type
    return data as unknown as Appointment;
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    // Get appointment data before deletion to use in activity log
    const { data: appointmentData } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    // Delete appointment from Supabase
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
    
    // Log the activity
    if (appointmentData) {
      await logAppointmentActivity(id, 'deleted', appointmentData.lead_id);
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    throw error;
  }
};

// Helper function to log appointment activities
const logAppointmentActivity = async (appointmentId: string, action: 'created' | 'updated' | 'deleted', leadId?: string) => {
  try {
    // Get current user
    const { data: authData } = await supabase.auth.getSession();
    if (!authData?.session?.user) return;
    
    const userId = authData.session.user.id;
    
    // Create activity record
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      type: 'appointment',
      description: `تم ${action === 'created' ? 'إنشاء' : action === 'updated' ? 'تحديث' : 'حذف'} موعد`,
      created_by: userId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging appointment activity:", error);
  }
};
