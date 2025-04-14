
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "../types/leadTypes";
import { v4 as uuidv4 } from 'uuid';
import { mockLeads } from "./mockData";

// Mock activities for fallback only (should not be primary data source)
const mockActivities: LeadActivity[] = [];

// Get activities for a lead - Always try Supabase first
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log("Fetching activities for lead:", leadId);
    
    // Always try to fetch from Supabase first, regardless of lead ID format
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead activities from Supabase:", error);
      
      // Fall back to mock data only for development or mock leads
      if (leadId.startsWith('lead-') || process.env.NODE_ENV === 'development') {
        console.log("Falling back to mock data for activities");
        return mockActivities.filter(activity => activity.lead_id === leadId);
      }
      
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    
    // Return empty array as fallback
    return [];
  }
};

// Add new activity - Always try to save to Supabase first
export const addLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    console.log("Adding activity:", activity);
    
    if (!activity.lead_id) {
      console.error("Cannot add activity without lead_id");
      toast.error("بيانات النشاط غير مكتملة");
      return null;
    }
    
    // Always try to save to Supabase first, regardless of lead ID format
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        scheduled_at: activity.scheduled_at,
        created_by: userData?.user?.id || 'unknown-user'
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating lead activity in Supabase:", error);
      
      // Fall back to mock data only for development or mock leads
      if (activity.lead_id.startsWith('lead-') || process.env.NODE_ENV === 'development') {
        console.log("Falling back to mock data for adding activity");
        
        // Create a new mock activity
        const newActivity: LeadActivity = {
          id: uuidv4(),
          lead_id: activity.lead_id,
          type: activity.type || 'note',
          description: activity.description || '',
          created_at: new Date().toISOString(),
          created_by: userData?.user?.id || 'current-user',
          scheduled_at: activity.scheduled_at || null,
          completed_at: null
        };
        
        // Add to mock activities
        mockActivities.unshift(newActivity);
        
        toast.success("تم إضافة النشاط بنجاح (وضع تجريبي)");
        return newActivity;
      }
      
      throw error;
    }
    
    toast.success("تم إضافة النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error creating lead activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

// Complete an activity - Always try Supabase first
export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    console.log("Completing activity:", activityId);
    
    // Always try Supabase first
    const { data, error } = await supabase
      .from('lead_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select()
      .single();
    
    if (error) {
      console.error("Error completing lead activity in Supabase:", error);
      
      // Find if it's a mock activity as fallback
      const mockActivityIndex = mockActivities.findIndex(a => a.id === activityId);
      if (mockActivityIndex !== -1) {
        console.log("Falling back to mock data for completing activity");
        
        // Update the mock activity
        mockActivities[mockActivityIndex].completed_at = new Date().toISOString();
        
        toast.success("تم إكمال النشاط بنجاح (وضع تجريبي)");
        return mockActivities[mockActivityIndex];
      }
      
      throw error;
    }
    
    toast.success("تم إكمال النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
