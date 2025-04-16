
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "@/types/leads"; // Using the central type definition
import { Task } from "@/services/tasks/types"; // Import the Task type to match what's expected

export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log("Fetching activities for lead:", leadId);
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        profiles:created_by (
          first_name,
          last_name
        )
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead activities:", error);
      throw error;
    }
    
    console.log("Retrieved lead activities:", data);
    return data as LeadActivity[] || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

export const addLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    if (!activity.lead_id) {
      console.error("Cannot add activity without lead_id");
      toast.error("بيانات النشاط غير مكتملة");
      return null;
    }

    console.log("Creating lead activity:", activity);
    const { data: userData } = await supabase.auth.getUser();
    
    // Ensure we have all required fields
    const newActivity = {
      lead_id: activity.lead_id,
      type: activity.type || 'note',
      description: activity.description || '',
      scheduled_at: activity.scheduled_at || null,
      created_by: userData.user?.id || null
    };
    
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([newActivity])
      .select(`
        *,
        profiles:created_by (
          first_name,
          last_name
        )
      `)
      .single();
    
    if (error) {
      console.error("Error creating lead activity:", error);
      throw error;
    }
    
    console.log("Activity created successfully:", data);
    toast.success("تم إضافة النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error creating lead activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select(`
        *,
        profiles:created_by (
          first_name,
          last_name
        )
      `)
      .single();
    
    if (error) {
      console.error("Error completing lead activity:", error);
      throw error;
    }
    
    toast.success("تم إكمال النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};

export const deleteLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .delete()
      .eq('id', activityId);
    
    if (error) {
      console.error("Error deleting lead activity:", error);
      throw error;
    }
    
    toast.success("تم حذف النشاط بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead activity:", error);
    toast.error("فشل في حذف النشاط");
    return false;
  }
};

// Function to create a lead task connection
export const addLeadTask = async (leadId: string, taskId: string): Promise<boolean> => {
  try {
    // First retrieve the current task to ensure we have the correct types
    const { data: taskData, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching task:", fetchError);
      return false;
    }

    // Then update with the lead_id - using a Record to ensure type compatibility
    const updateData: Record<string, any> = { 
      lead_id: leadId,
      // Include any required fields for the update
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);
    
    if (error) {
      console.error("Error associating task with lead:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addLeadTask:", error);
    return false;
  }
};

// Function to create a lead appointment connection
export const addLeadAppointment = async (leadId: string, appointmentId: string): Promise<boolean> => {
  try {
    // Update the appointment with the lead_id reference
    const { error } = await supabase
      .from('appointments')
      .update({ client_id: leadId })
      .eq('id', appointmentId);
    
    if (error) {
      console.error("Error associating appointment with lead:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addLeadAppointment:", error);
    return false;
  }
};
