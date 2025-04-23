
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentCreateInput } from "./types";
import { toast } from "sonner";

/**
 * Fetches appointments with optional filtering
 */
export const getAppointments = async (options?: {
  filter?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}): Promise<Appointment[]> => {
  try {
    console.log("Fetching appointments with options:", options);

    let query = supabase.from('appointments').select('*');

    // Apply filters
    if (options) {
      if (options.userId) {
        query = query.eq('owner_id', options.userId);
      }

      if (options.startDate) {
        query = query.gte('start_time', options.startDate.toISOString());
      }

      if (options.endDate) {
        query = query.lte('start_time', options.endDate.toISOString());
      }
    }

    query = query.order('start_time', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
    
    return data as Appointment[] || [];
  } catch (error) {
    console.error("Error in getAppointments:", error);
    toast.error("فشل في تحميل المواعيد");
    return [];
  }
};

/**
 * Alias for getAppointments with no filters (for compatibility)
 */
export const fetchAppointments = async (): Promise<Appointment[]> => {
  return getAppointments();
};

/**
 * Fetches appointments for a specific user
 */
export const fetchAppointmentsByUserId = async (userId: string): Promise<Appointment[]> => {
  if (!userId) {
    console.error("No user ID provided for fetchAppointmentsByUserId");
    return [];
  }
  return getAppointments({ userId });
};

/**
 * Fetches appointments for a specific team
 */
export const fetchAppointmentsByTeam = async (teamId: string): Promise<Appointment[]> => {
  try {
    // In a real implementation, we would filter by team_id
    // For now, we'll just return all appointments since team functionality isn't fully implemented
    console.log("Fetching team appointments for team:", teamId);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('team_id', teamId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching team appointments:", error);
      throw error;
    }
    
    return data as Appointment[] || [];
  } catch (error) {
    console.error("Error in fetchAppointmentsByTeam:", error);
    toast.error("فشل في تحميل مواعيد الفريق");
    return [];
  }
};

/**
 * Fetches upcoming appointments (future dates)
 */
export const fetchUpcomingAppointments = async (): Promise<Appointment[]> => {
  try {
    const now = new Date();
    console.log("Fetching upcoming appointments from:", now.toISOString());
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('start_time', now.toISOString())
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching upcoming appointments:", error);
      throw error;
    }
    
    return data as Appointment[] || [];
  } catch (error) {
    console.error("Error in fetchUpcomingAppointments:", error);
    toast.error("فشل في تحميل المواعيد القادمة");
    return [];
  }
};

/**
 * Creates a new appointment
 */
export const createAppointment = async (appointment: AppointmentCreateInput): Promise<Appointment | null> => {
  try {
    console.log("Creating appointment with data:", appointment);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Clean data - remove 'none' values to prevent foreign key errors
    const cleanedData = Object.fromEntries(
      Object.entries(appointment).filter(([_, value]) => value !== 'none')
    );
    
    // Check for required fields
    if (!cleanedData.title) {
      toast.error("عنوان الموعد مطلوب");
      throw new Error("Appointment title is required");
    }
    
    if (!cleanedData.start_time || !cleanedData.end_time) {
      toast.error("تاريخ البداية والنهاية مطلوبان");
      throw new Error("Start and end times are required");
    }
    
    // Prepare data for insertion
    const appointmentData = {
      ...cleanedData,
      created_by: user?.id || null,
      owner_id: cleanedData.owner_id || user?.id || null
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      toast.error("فشل في حفظ الموعد");
      throw error;
    }
    
    console.log("Appointment created successfully:", data);
    toast.success("تم إنشاء الموعد بنجاح");
    return data as Appointment;
  } catch (error) {
    console.error("Error in createAppointment:", error);
    toast.error("فشل في إنشاء الموعد");
    return null;
  }
};

/**
 * Updates an existing appointment
 */
export const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    console.log("Updating appointment with ID:", id, "Data:", appointment);
    
    // Clean data - remove 'none' values to prevent foreign key errors
    const cleanedData = Object.fromEntries(
      Object.entries(appointment).filter(([_, value]) => value !== 'none')
    );
    
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...cleanedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      toast.error("فشل في تحديث الموعد");
      throw error;
    }
    
    console.log("Appointment updated successfully:", data);
    toast.success("تم تحديث الموعد بنجاح");
    return data as Appointment;
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    toast.error("فشل في تحديث الموعد");
    return null;
  }
};

/**
 * Deletes an appointment
 */
export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting appointment with ID:", id);
    
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
    console.error("Error in deleteAppointment:", error);
    toast.error("فشل في حذف الموعد");
    return false;
  }
};

/**
 * Fetches a specific appointment by ID
 */
export const getAppointment = async (id: string): Promise<Appointment | null> => {
  try {
    console.log("Fetching appointment with ID:", id);
    
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
    console.error("Error in getAppointment:", error);
    return null;
  }
};

/**
 * Mark an appointment as completed
 */
export const markAppointmentAsCompleted = async (id: string): Promise<Appointment | null> => {
  try {
    console.log("Marking appointment as completed, ID:", id);
    
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error marking appointment as completed:", error);
      toast.error("فشل في تحديث حالة الموعد");
      throw error;
    }
    
    console.log("Appointment marked as completed:", data);
    toast.success("تم تعيين الموعد كمكتمل");
    return data as Appointment;
  } catch (error) {
    console.error("Error in markAppointmentAsCompleted:", error);
    toast.error("فشل في تعيين الموعد كمكتمل");
    return null;
  }
};
