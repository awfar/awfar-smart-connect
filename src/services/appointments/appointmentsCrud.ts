import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentCreateInput, AppointmentStatus, AppointmentDB } from "./types";
import { toast } from "sonner";

// Helper to map DB record to model
const mapDbToAppointment = (dbRecord: AppointmentDB): Appointment => ({
  id: dbRecord.id,
  title: dbRecord.title,
  description: dbRecord.description,
  start_time: dbRecord.start_time,
  end_time: dbRecord.end_time,
  location: dbRecord.location as any,
  location_details: dbRecord.location_details,
  status: dbRecord.status as AppointmentStatus,
  lead_id: dbRecord.lead_id || null,
  company_id: dbRecord.company_id || null,
  client_id: dbRecord.client_id,
  owner_id: dbRecord.owner_id,
  participants: dbRecord.participants,
  created_by: dbRecord.created_by,
  created_at: dbRecord.created_at,
  updated_at: dbRecord.updated_at,
  type: dbRecord.type as any,
  related_deal_id: dbRecord.related_deal_id,
  related_ticket_id: dbRecord.related_ticket_id,
  notes: dbRecord.notes,
  is_all_day: dbRecord.is_all_day,
  color: dbRecord.color,
  reminder_time: dbRecord.reminder_time,
  notification_sent: dbRecord.notification_sent
});

export const fetchAppointments = async (filters?: { 
  lead_id?: string; 
  status?: AppointmentStatus; 
  user_id?: string; 
  team_id?: string; 
  upcoming?: boolean 
}): Promise<Appointment[]> => {
  try {
    let query = supabase.from('appointments').select('*');
    if (filters) {
      if (filters.lead_id) {
        query = query.eq('lead_id', filters.lead_id);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.user_id) {
        query = query.eq('owner_id', filters.user_id);
      }
      
      if (filters.team_id) {
        query = query.eq('team_id', filters.team_id);
      }
      
      if (filters.upcoming) {
        const now = new Date().toISOString();
        query = query.gte('start_time', now);
      }
    }
    query = query.order('start_time', { ascending: true });
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
    return (data || []).map(item => mapDbToAppointment(item as AppointmentDB));
  } catch (error) {
    console.error("Error in fetchAppointments:", error);
    toast.error("فشل في تحميل المواعيد");
    return [];
  }
};

export const fetchAppointmentsByLeadId = async (leadId: string) => fetchAppointments({ lead_id: leadId });
export const fetchAppointmentsByUserId = async (userId: string) => fetchAppointments({ user_id: userId });
export const fetchAppointmentsByTeam = async (teamId: string) => fetchAppointments({ team_id: teamId });
export const fetchUpcomingAppointments = async (userId?: string) => {
  const filters: { upcoming: boolean; user_id?: string } = { upcoming: true };
  if (userId) filters.user_id = userId;
  return fetchAppointments(filters);
};

export const getAppointment = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? mapDbToAppointment(data as AppointmentDB) : null;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
};

export const createAppointment = async (appointment: AppointmentCreateInput): Promise<Appointment> => {
  try {
    if (!appointment.title) throw new Error("Title is required");
    if (!appointment.start_time) throw new Error("Start time is required");
    if (!appointment.end_time) throw new Error("End time is required");
    let created_by = appointment.created_by;
    if (!created_by) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) created_by = user.id;
    }
    const appointmentData = {
      title: appointment.title,
      description: appointment.description,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      location: appointment.location,
      location_details: appointment.location_details,
      status: appointment.status || 'scheduled',
      client_id: appointment.client_id,
      lead_id: appointment.lead_id,
      company_id: appointment.company_id,
      owner_id: appointment.owner_id || created_by,
      participants: appointment.participants,
      created_by,
      type: appointment.type,
      related_deal_id: appointment.related_deal_id,
      related_ticket_id: appointment.related_ticket_id,
      notes: appointment.notes,
      is_all_day: appointment.is_all_day,
      color: appointment.color,
      reminder_time: appointment.reminder_time
    };

    const { data, error } = await supabase.from('appointments').insert(appointmentData).select().single();
    if (error) throw error;

    try {
      await supabase.rpc('log_activity', {
        p_entity_type: 'appointment',
        p_entity_id: data.id,
        p_action: 'create',
        p_user_id: created_by,
        p_details: `Created appointment: ${appointment.title}`
      });
    } catch (logError) {
      console.error("Error logging activity:", logError);
    }

    toast.success("تم إنشاء الموعد بنجاح");
    return mapDbToAppointment(data as AppointmentDB);
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("فشل في إنشاء الموعد");
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  try {
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.start_time !== undefined) updateData.start_time = updates.start_time;
    if (updates.end_time !== undefined) updateData.end_time = updates.end_time;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.location_details !== undefined) updateData.location_details = updates.location_details;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.client_id !== undefined) updateData.client_id = updates.client_id;
    if (updates.lead_id !== undefined) updateData.lead_id = updates.lead_id;
    if (updates.company_id !== undefined) updateData.company_id = updates.company_id;
    if (updates.owner_id !== undefined) updateData.owner_id = updates.owner_id;
    if (updates.participants !== undefined) updateData.participants = updates.participants;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.related_deal_id !== undefined) updateData.related_deal_id = updates.related_deal_id;
    if (updates.related_ticket_id !== undefined) updateData.related_ticket_id = updates.related_ticket_id;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.is_all_day !== undefined) updateData.is_all_day = updates.is_all_day;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.reminder_time !== undefined) updateData.reminder_time = updates.reminder_time;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_activity', {
          p_entity_type: 'appointment',
          p_entity_id: id,
          p_action: 'update',
          p_user_id: user.id,
          p_details: `Updated appointment: ${data.title}`
        });
      }
    } catch (logError) {
      console.error("Error logging activity:", logError);
    }

    toast.success("تم تحديث الموعد بنجاح");
    return mapDbToAppointment(data);
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("فشل في تحديث الموعد");
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: appointment } = await supabase
        .from('appointments')
        .select('title')
        .eq('id', id)
        .single();
      
      if (user && appointment) {
        await supabase.rpc('log_activity', {
          p_entity_type: 'appointment',
          p_entity_id: id,
          p_action: 'delete',
          p_user_id: user.id,
          p_details: `Deleted appointment: ${appointment.title}`
        });
      }
    } catch (logError) {
      console.error("Error logging deletion activity:", logError);
    }

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

export const markAppointmentAsCompleted = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_activity', {
          p_entity_type: 'appointment',
          p_entity_id: id,
          p_action: 'complete',
          p_user_id: user.id,
          p_details: `Marked appointment as completed: ${data.title}`
        });
      }
    } catch (logError) {
      console.error("Error logging activity:", logError);
    }

    toast.success("تم تحديث حالة الموعد إلى مكتمل");
    return data ? mapDbToAppointment(data) : null;
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    toast.error("فشل في تحديث حالة الموعد");
    return null;
  }
};
