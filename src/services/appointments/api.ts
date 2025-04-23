import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus, AppointmentCreateInput } from './types';

export const createAppointment = async (appointmentData: AppointmentCreateInput): Promise<Appointment | null> => {
  try {
    if (!appointmentData.title) {
      throw new Error('Appointment title is required');
    }
    
    if (!appointmentData.start_time || !appointmentData.end_time) {
      throw new Error('Start time and end time are required');
    }
    
    console.log("Creating appointment with data:", appointmentData);
    
    // Get current user for created_by field if not provided
    if (!appointmentData.created_by) {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        appointmentData.created_by = authData.session.user.id;
      }
    }
    
    // Ensure the status is of the correct type
    const status: AppointmentStatus = appointmentData.status || 'scheduled';
    
    // Prepare data for insertion with proper types
    const dataToInsert = {
      title: appointmentData.title,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      created_by: appointmentData.created_by,
      status: status,
      description: appointmentData.description || null,
      location: appointmentData.location || null,
      location_details: appointmentData.location_details || null,
      is_all_day: appointmentData.is_all_day || false,
      lead_id: appointmentData.lead_id || null,
      company_id: appointmentData.company_id || null,
      client_id: appointmentData.client_id || null,
      owner_id: appointmentData.owner_id || null
    };
    
    console.log("Inserting appointment with processed data:", dataToInsert);
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      toast.error("فشل في إنشاء الموعد");
      throw error;
    }
    
    console.log("Appointment created successfully:", data);
    
    // Log activity if lead_id is provided
    if (appointmentData.lead_id) {
      try {
        await supabase.from('lead_activities').insert({
          lead_id: appointmentData.lead_id,
          type: 'meeting',
          description: `موعد جديد: ${appointmentData.title}`,
          created_by: appointmentData.created_by,
          scheduled_at: appointmentData.start_time
        });
      } catch (logError) {
        console.error('Error logging appointment activity:', logError);
      }
    }
    
    toast.success("تم إنشاء الموعد بنجاح");
    return data as Appointment;
  } catch (error: any) {
    console.error('Error in createAppointment:', error);
    toast.error(`فشل في حفظ الموعد: ${error.message || 'خطأ غير معروف'}`);
    return null;
  }
};

export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    if (!id) {
      throw new Error('Appointment ID is required');
    }
    
    console.log("Updating appointment with ID:", id, "Data:", appointmentData);
    
    // Convert status to AppointmentStatus if provided
    let dataToUpdate: Record<string, any> = {};
    
    if (appointmentData.title !== undefined) dataToUpdate.title = appointmentData.title;
    if (appointmentData.description !== undefined) dataToUpdate.description = appointmentData.description;
    if (appointmentData.start_time !== undefined) dataToUpdate.start_time = appointmentData.start_time;
    if (appointmentData.end_time !== undefined) dataToUpdate.end_time = appointmentData.end_time;
    if (appointmentData.location !== undefined) dataToUpdate.location = appointmentData.location;
    if (appointmentData.status !== undefined) dataToUpdate.status = appointmentData.status as AppointmentStatus;
    if (appointmentData.is_all_day !== undefined) dataToUpdate.is_all_day = appointmentData.is_all_day;
    if (appointmentData.lead_id !== undefined) dataToUpdate.lead_id = appointmentData.lead_id;
    if (appointmentData.company_id !== undefined) dataToUpdate.company_id = appointmentData.company_id;
    if (appointmentData.client_id !== undefined) dataToUpdate.client_id = appointmentData.client_id;
    if (appointmentData.owner_id !== undefined) dataToUpdate.owner_id = appointmentData.owner_id;
    
    // Automatically update the updated_at timestamp
    dataToUpdate.updated_at = new Date().toISOString();
    
    console.log("Updating appointment with processed data:", dataToUpdate);
    
    const { data, error } = await supabase
      .from('appointments')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      toast.error("فشل في تحديث الموعد");
      throw error;
    }
    
    console.log("Appointment updated successfully:", data);
    toast.success("تم تحديث الموعد بنجاح");
    return data as Appointment;
  } catch (error: any) {
    console.error('Error in updateAppointment:', error);
    toast.error(`فشل في تحديث الموعد: ${error.message || 'خطأ غير معروف'}`);
    return null;
  }
};

export const getAppointments = async (filters?: Record<string, any>): Promise<Appointment[]> => {
  try {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `);
    
    if (filters) {
      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.lead_id) query = query.eq('lead_id', filters.lead_id);
      if (filters.company_id) query = query.eq('company_id', filters.company_id);
      if (filters.client_id) query = query.eq('client_id', filters.client_id);
      if (filters.owner_id) query = query.eq('owner_id', filters.owner_id);
      
      // Date range filter
      if (filters.start_date && filters.end_date) {
        query = query.gte('start_time', filters.start_date).lte('start_time', filters.end_date);
      }
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
    
    return data as Appointment[];
  } catch (error) {
    console.error('Error in getAppointments:', error);
    return [];
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
    
    return data as Appointment;
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return null;
  }
};

export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('lead_id', leadId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments for lead:', error);
      throw error;
    }
    
    return data as Appointment[];
  } catch (error) {
    console.error('Error in getAppointmentsByLeadId:', error);
    return [];
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
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      toast.error("فشل في حذف الموعد");
      throw error;
    }
    
    // Log activity if lead_id was available
    if (appointmentData?.lead_id) {
      try {
        await supabase.from('lead_activities').insert({
          lead_id: appointmentData.lead_id,
          type: 'meeting',
          description: `تم حذف الموعد: ${appointmentData.title}`,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          created_at: new Date().toISOString()
        });
      } catch (logError) {
        console.error('Error logging appointment deletion activity:', logError);
      }
    }
    
    toast.success("تم حذف الموعد بنجاح");
    return true;
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    return false;
  }
};
