
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DealActivity } from "../types/dealTypes";

// Get activities for a deal
export const getDealActivities = async (dealId: string): Promise<DealActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles:user_id (first_name, last_name)
      `)
      .eq('entity_id', dealId)
      .eq('entity_type', 'deal')
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
        deal_id: activity.entity_id,
        type: activity.action.startsWith('add_') ? activity.action.substring(4) : activity.action,
        description: activity.details || '',
        created_at: activity.created_at,
        created_by: activity.user_id,
        creator: {
          name: creatorName
        },
        scheduled_at: null,
        completed_at: null
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
    
    // Log in activity_logs table instead of a missing deal_activities table
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        entity_type: 'deal',
        entity_id: activity.deal_id,
        action: `add_${activity.type}`,
        details: activity.description?.substring(0, 500),
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding deal activity:", error);
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        deal_id: data.entity_id,
        type: data.action.startsWith('add_') ? data.action.substring(4) : data.action,
        description: data.details || '',
        created_at: data.created_at,
        created_by: data.user_id,
        scheduled_at: null,
        completed_at: null,
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
    // Update the activity_logs table instead
    const { error } = await supabase
      .from('activity_logs')
      .update({
        details: `[COMPLETED] ${new Date().toISOString()}`
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
