
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DealActivity } from "../types/dealTypes";

export const getDealActivities = async (dealId: string): Promise<DealActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `)
      .eq('entity_type', 'deal')
      .eq('entity_id', dealId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(activity => ({
      id: activity.id,
      deal_id: activity.entity_id,
      type: activity.action,
      description: activity.details || '',
      created_at: activity.created_at,
      created_by: activity.user_id,
      creator: activity.profiles ? {
        name: `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}`.trim(),
      } : undefined,
      scheduled_at: null,
      completed_at: null
    })) || [];
  } catch (error) {
    console.error("Error fetching deal activities:", error);
    toast.error("فشل في جلب أنشطة الصفقة");
    return [];
  }
};

export const addDealActivity = async (activity: Partial<DealActivity>): Promise<DealActivity | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        entity_type: 'deal',
        entity_id: activity.deal_id,
        action: activity.type,
        details: activity.description,
        user_id: userData.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة النشاط بنجاح");
    return {
      id: data.id,
      deal_id: data.entity_id,
      type: data.action,
      description: data.details || '',
      created_at: data.created_at,
      created_by: data.user_id,
      scheduled_at: null,
      completed_at: null
    };
  } catch (error) {
    console.error("Error creating deal activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

export const completeDealActivity = async (activityId: string): Promise<DealActivity | null> => {
  try {
    // Since we're using activity_logs, we'll update the details to indicate completion
    const { data, error } = await supabase
      .from('activity_logs')
      .update({
        details: `Completed at ${new Date().toISOString()}`
      })
      .eq('id', activityId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إكمال النشاط بنجاح");
    return {
      id: data.id,
      deal_id: data.entity_id,
      type: data.action,
      description: data.details || '',
      created_at: data.created_at,
      created_by: data.user_id,
      scheduled_at: null,
      completed_at: new Date().toISOString() // Set for the front-end
    };
  } catch (error) {
    console.error("Error completing deal activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
