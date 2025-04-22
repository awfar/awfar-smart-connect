
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DealActivity } from "../types/dealTypes";

// Get activities for a deal
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
    
    if (error) {
      console.error("Error fetching deal activities:", error);
      throw error;
    }
    
    if (!data) return [];
    
    // Transform data to match DealActivity type
    return data.map((activity: any) => {
      const creatorName = activity.profiles 
        ? `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}`.trim()
        : 'مستخدم النظام';
      
      return {
        id: activity.id,
        deal_id: activity.deal_id,
        type: activity.type,
        description: activity.description,
        created_at: activity.created_at,
        created_by: activity.created_by,
        creator: {
          name: creatorName
        },
        scheduled_at: activity.scheduled_at,
        completed_at: activity.completed_at
      };
    });
  } catch (error) {
    console.error("Error in getDealActivities:", error);
    return [];
  }
};

// Add activity to a deal
export const addDealActivity = async (activity: Partial<DealActivity>): Promise<DealActivity | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("يجب تسجيل الدخول لإضافة نشاط");
      return null;
    }
    
    const { data, error } = await supabase
      .from('deal_activities')
      .insert({
        deal_id: activity.deal_id,
        type: activity.type,
        description: activity.description,
        created_by: userData.user.id,
        scheduled_at: activity.scheduled_at,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding deal activity:", error);
      throw error;
    }
    
    // Also log in activity_logs table for global timeline
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        entity_type: 'deal',
        entity_id: activity.deal_id,
        action: `add_${activity.type}`,
        details: activity.description?.substring(0, 100),
        user_id: userData.user.id
      });
      
    if (logError) {
      console.error("Error logging activity:", logError);
    }
    
    if (data) {
      return {
        id: data.id,
        deal_id: data.deal_id,
        type: data.type,
        description: data.description,
        created_at: data.created_at,
        created_by: data.created_by,
        scheduled_at: data.scheduled_at,
        completed_at: data.completed_at,
        creator: {
          name: "أنت"
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in addDealActivity:", error);
    throw error;
  }
};

// Mark activity as completed
export const completeDealActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deal_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', activityId);
    
    if (error) {
      console.error("Error completing deal activity:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in completeDealActivity:", error);
    return false;
  }
};
