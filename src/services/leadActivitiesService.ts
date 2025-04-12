
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "./types/leadTypes";

export const fetchLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

export const createLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة النشاط بنجاح");
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
