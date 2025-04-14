
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DealActivity } from "../types/dealTypes";

export const getDealActivities = async (dealId: string): Promise<DealActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('deal_activities')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(activity => ({
      ...activity,
      creator: activity.profiles ? {
        name: `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}`.trim(),
      } : undefined
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
      .from('deal_activities')
      .insert([{
        deal_id: activity.deal_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: userData.user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error creating deal activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

export const completeDealActivity = async (activityId: string): Promise<DealActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('deal_activities')
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
    console.error("Error completing deal activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
