
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
    return data.map((activity) => {
      // Safely extract creator name from profiles, providing a default if not available
      let creatorName = "مستخدم النظام";
      
      if (activity.profiles && 
          typeof activity.profiles === 'object') {
        // Use optional chaining to safely access properties that might be null/undefined
        const firstName = activity.profiles?.first_name || '';
        const lastName = activity.profiles?.last_name || '';
        if (firstName || lastName) {
          creatorName = `${firstName} ${lastName}`.trim();
        }
      }
      
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
        scheduled_at: activity.action === 'meeting' || activity.action === 'call' ? 
          (activity.details?.includes('scheduled:') ? activity.details.split('scheduled:')[1]?.split('|')[0]?.trim() : undefined) : undefined,
        completed_at: activity.details?.includes('[COMPLETED]') ? activity.details.split('[COMPLETED]')[1]?.trim() : undefined
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
    
    let details = activity.description || '';
    
    // If it's a scheduled activity like meeting or call, add the scheduled time to details
    if (activity.scheduled_at && (activity.type === 'meeting' || activity.type === 'call')) {
      details = `${details} | scheduled: ${activity.scheduled_at}`;
    }
    
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        entity_type: 'deal',
        entity_id: activity.deal_id,
        action: activity.type,
        details: details,
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding deal activity:", error);
      throw error;
    }
    
    return {
      id: data.id,
      deal_id: data.entity_id,
      type: data.action,
      description: data.details || '',
      created_at: data.created_at,
      created_by: data.user_id,
      scheduled_at: activity.scheduled_at,
      completed_at: undefined,
      creator: {
        name: "أنت"
      }
    };
  } catch (error) {
    console.error("Error in addDealActivity:", error);
    throw error;
  }
};

// Update activity status
export const completeDealActivity = async (activityId: string): Promise<boolean> => {
  try {
    // Get the current details
    const { data: currentActivity } = await supabase
      .from('activity_logs')
      .select('details')
      .eq('id', activityId)
      .single();
    
    const currentDetails = currentActivity?.details || '';
    const completedTimestamp = new Date().toISOString();
    const updatedDetails = `${currentDetails} | [COMPLETED] ${completedTimestamp}`;
    
    const { error } = await supabase
      .from('activity_logs')
      .update({
        details: updatedDetails
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
