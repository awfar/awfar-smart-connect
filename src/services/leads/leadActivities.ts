
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "../types/leadTypes";

export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(activity => {
      // Safely transform the profiles data
      let createdByInfo = null;
      if (activity.profiles) {
        const firstName = activity.profiles.first_name || '';
        const lastName = activity.profiles.last_name || '';
        createdByInfo = {
          id: activity.created_by,
          first_name: firstName,
          last_name: lastName
        };
      }

      return {
        ...activity,
        created_by: createdByInfo
      };
    }) || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

export const addLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    // Make sure we have a user before proceeding
    if (!userData.user) {
      console.error("No authenticated user found when creating activity");
      throw new Error("User authentication required");
    }
    
    // Validate required fields
    if (!activity.lead_id) {
      throw new Error("Lead ID is required");
    }
    
    if (!activity.type) {
      throw new Error("Activity type is required");
    }
    
    if (!activity.description) {
      throw new Error("Activity description is required");
    }
    
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: userData.user.id,
        completed_at: activity.completed_at || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Only show success toast for user-facing activities (not system activities)
    if (activity.type !== "create" && activity.type !== "update" && activity.type !== "delete") {
      toast.success("تم إضافة النشاط بنجاح");
    }
    
    return data;
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
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إكمال النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};

// Add a new note to a lead
export const addLeadNote = async (
  leadId: string, 
  noteText: string
): Promise<LeadActivity | null> => {
  return addLeadActivity({
    lead_id: leadId,
    type: "note",
    description: noteText,
    completed_at: new Date().toISOString() // Notes are completed when created
  });
};

// Schedule a call with a lead
export const scheduleLeadCall = async (
  leadId: string, 
  description: string,
  scheduledAt: string
): Promise<LeadActivity | null> => {
  return addLeadActivity({
    lead_id: leadId,
    type: "call",
    description: description,
    scheduled_at: scheduledAt
  });
};

// Schedule a meeting with a lead
export const scheduleLeadMeeting = async (
  leadId: string, 
  description: string,
  scheduledAt: string
): Promise<LeadActivity | null> => {
  return addLeadActivity({
    lead_id: leadId,
    type: "meeting",
    description: description,
    scheduled_at: scheduledAt
  });
};

// Add a task related to a lead
export const addLeadTask = async (
  leadId: string, 
  taskDescription: string,
  dueDate: string
): Promise<LeadActivity | null> => {
  return addLeadActivity({
    lead_id: leadId,
    type: "task",
    description: taskDescription,
    scheduled_at: dueDate
  });
};

// Add an email activity to a lead
export const logLeadEmail = async (
  leadId: string, 
  emailSubject: string
): Promise<LeadActivity | null> => {
  return addLeadActivity({
    lead_id: leadId,
    type: "email",
    description: emailSubject,
    completed_at: new Date().toISOString() // Emails are completed when logged
  });
};
