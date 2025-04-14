
import { supabase } from "@/integrations/supabase/client";
import { LeadActivity } from "../types/leadTypes";
import { mockActivities } from "./mockData";
import { toast } from "sonner";

// Get activities for a specific lead
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
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
    
    // Return data if found
    if (data && data.length > 0) {
      return data.map(activity => ({
        ...activity,
        id: activity.id,
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        created_at: activity.created_at,
        created_by: activity.created_by,
        scheduled_at: activity.scheduled_at,
        completed_at: activity.completed_at
      }));
    }
    
    // Use mock data if no activities found in database
    return mockActivities[leadId] || [];
  } catch (error) {
    console.error("Error in getLeadActivities:", error);
    // Return mock data in case of error
    return mockActivities[leadId] || [];
  }
};

// Add a new activity for a lead
export const addLeadActivity = async (activity: Omit<LeadActivity, "id" | "created_at">): Promise<LeadActivity> => {
  try {
    console.log("Adding new lead activity:", activity);
    
    // Make sure we're using lead_id (not leadId)
    const normalizedActivity = {
      lead_id: activity.lead_id,
      type: activity.type,
      description: activity.description,
      created_by: activity.created_by || (await supabase.auth.getUser()).data.user?.id,
      scheduled_at: activity.scheduled_at,
      completed_at: activity.completed_at
    };
    
    // Try adding the activity to Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .insert(normalizedActivity)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding lead activity to Supabase:", error);
      throw error;
    }
    
    // Return the new activity from the database
    if (data) {
      toast.success("تم إضافة النشاط بنجاح");
      return data as LeadActivity;
    }
    
    // Fallback to mock data
    const newActivity: LeadActivity = {
      id: `activity-${Date.now()}`,
      ...activity,
      created_at: new Date().toISOString()
    } as LeadActivity;
    
    // Initialize the array if it doesn't exist
    if (!mockActivities[activity.lead_id]) {
      mockActivities[activity.lead_id] = [];
    }
    
    // Add the new activity to the mock data
    mockActivities[activity.lead_id].unshift(newActivity);
    
    toast.success("تم إضافة النشاط بنجاح");
    return newActivity;
  } catch (error) {
    console.error("Error in addLeadActivity:", error);
    toast.error("فشل في إضافة النشاط");
    
    // Create a mock activity in case of error
    const newActivity: LeadActivity = {
      id: `activity-${Date.now()}`,
      ...activity,
      created_at: new Date().toISOString()
    } as LeadActivity;
    
    // Initialize the array if it doesn't exist
    if (!mockActivities[activity.lead_id]) {
      mockActivities[activity.lead_id] = [];
    }
    
    // Add the new activity to the mock data
    mockActivities[activity.lead_id].unshift(newActivity);
    
    return newActivity;
  }
};

// Mark an activity as completed
export const completeLeadActivity = async (id: string): Promise<LeadActivity | null> => {
  try {
    console.log("Marking activity as completed:", id);
    
    // Try updating the activity in Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error completing lead activity in Supabase:", error);
      throw error;
    }
    
    // Return the updated activity
    if (data) {
      toast.success("تم إكمال النشاط بنجاح");
      return data as LeadActivity;
    }
    
    // Fallback to mock data
    // Find the activity in mock data
    for (const leadId in mockActivities) {
      const activityIndex = mockActivities[leadId].findIndex(a => a.id === id);
      if (activityIndex >= 0) {
        // Update the activity
        mockActivities[leadId][activityIndex].completed_at = new Date().toISOString();
        toast.success("تم إكمال النشاط بنجاح");
        return mockActivities[leadId][activityIndex];
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in completeLeadActivity:", error);
    toast.error("فشل في إكمال النشاط");
    
    // Fallback to mock data in case of error
    for (const leadId in mockActivities) {
      const activityIndex = mockActivities[leadId].findIndex(a => a.id === id);
      if (activityIndex >= 0) {
        // Update the activity
        mockActivities[leadId][activityIndex].completed_at = new Date().toISOString();
        return mockActivities[leadId][activityIndex];
      }
    }
    
    return null;
  }
};
