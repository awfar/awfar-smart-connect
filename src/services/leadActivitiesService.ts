
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity, LeadActivityType } from "@/services/leads/types"; // Corrected import
import { LeadActivityInput } from "@/services/leads/types";
import { Task } from "@/services/tasks/types";

export const fetchLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log("Fetching activities for lead:", leadId);
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match the required format with created_at as required
    const transformedData = (data || []).map(activity => ({
      ...activity,
      created_at: activity.created_at || new Date().toISOString(),
      type: activity.type as LeadActivityType // Ensure type is properly cast to LeadActivityType
    }));
    
    return transformedData as LeadActivity[];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

export const createLeadActivity = async (activity: LeadActivityInput): Promise<LeadActivity | null> => {
  try {
    if (!activity.lead_id) {
      console.error("Cannot add activity without lead_id");
      toast.error("بيانات النشاط غير مكتملة");
      return null;
    }

    console.log("Creating lead activity:", activity);
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: activity.lead_id,
        type: activity.type || 'note',
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: (await supabase.auth.getUser()).data.user?.id || null,
        created_at: new Date().toISOString() // Explicitly set created_at
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the created_at field to satisfy the type requirement
    const result = {
      ...data,
      created_at: data.created_at || new Date().toISOString()
    } as LeadActivity;
    
    toast.success("تم إضافة النشاط بنجاح");
    return result;
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
    
    // Add the created_at field to satisfy the type requirement
    const result = {
      ...data,
      created_at: data.created_at || new Date().toISOString()
    } as LeadActivity;
    
    toast.success("تم إكمال النشاط بنجاح");
    return result;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
