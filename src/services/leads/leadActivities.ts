
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "@/types/leads"; // Using the central type definition

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
    
    if (error) throw error;
    
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
    
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: userData.user?.id || null
      }])
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
    
    if (error) throw error;
    
    toast.success("تم إكمال النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
