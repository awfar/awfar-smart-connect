
import { supabase } from '@/integrations/supabase/client';

// Appointment entity type definition
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'in_progress';
  created_at: string;
  updated_at: string;
  created_by?: string;
  lead_id?: string | null;
  client_id?: string | null;
  participants?: string[];
}

// Get appointments by lead ID
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
    console.error(`Error fetching appointments for lead ${leadId}:`, error);
    return [];
  }
};

// Create a new appointment
export const createAppointment = async (appointment: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
};

// Update an existing appointment
export const updateAppointment = async (appointment: Partial<Appointment> & { id: string }): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', appointment.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating appointment ${appointment.id}:`, error);
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
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    return false;
  }
};

// Get all appointments with optional filtering
export const getAppointments = async (options?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  userId?: string;
}): Promise<Appointment[]> => {
  try {
    let query = supabase.from('appointments').select('*');
    
    // Apply filters if provided
    if (options) {
      if (options.startDate) {
        query = query.gte('start_time', options.startDate);
      }
      
      if (options.endDate) {
        query = query.lte('start_time', options.endDate);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      if (options.userId) {
        query = query.contains('participants', [options.userId]);
      }
    }
    
    // Order by start time
    query = query.order('start_time', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Get appointment counts for different statuses
export const getAppointmentCounts = async (): Promise<{
  upcoming: number;
  completed: number;
  canceled: number;
  total: number;
}> => {
  try {
    const now = new Date().toISOString();
    
    // Get upcoming appointments
    const { data: upcomingData, error: upcomingError } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .gte('start_time', now)
      .eq('status', 'scheduled');
    
    // Get completed appointments
    const { data: completedData, error: completedError } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('status', 'completed');
    
    // Get canceled appointments
    const { data: canceledData, error: canceledError } = await supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('status', 'canceled');
    
    // Get total appointments
    const { data: totalData, error: totalError } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true });
    
    if (upcomingError || completedError || canceledError || totalError) {
      throw new Error('Error fetching appointment counts');
    }
    
    return {
      upcoming: upcomingData?.length || 0,
      completed: completedData?.length || 0,
      canceled: canceledData?.length || 0,
      total: totalData?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching appointment counts:', error);
    return { upcoming: 0, completed: 0, canceled: 0, total: 0 };
  }
};
