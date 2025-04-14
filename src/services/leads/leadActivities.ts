
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeadActivity } from "../types/leadTypes";
import { v4 as uuidv4 } from 'uuid';
import { mockLeads } from "./mockData";

// Mock activities for demo mode
const mockActivities: LeadActivity[] = [];

// Get activities for a lead
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log("Fetching activities for lead:", leadId);
    
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user || leadId.startsWith('lead-');
    
    if (useMockData) {
      console.log("Using mock data for activities");
      // Return activities that match this lead ID
      return mockActivities.filter(activity => activity.lead_id === leadId);
    }
    
    // Real implementation using Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead activities:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

// Add new activity
export const addLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    console.log("Adding activity:", activity);
    
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user || (activity.lead_id && activity.lead_id.startsWith('lead-'));
    
    if (useMockData) {
      console.log("Using mock data for adding activity");
      
      // Create a new mock activity
      const newActivity: LeadActivity = {
        id: uuidv4(),
        lead_id: activity.lead_id || '',
        type: activity.type || 'note',
        description: activity.description || '',
        created_at: new Date().toISOString(),
        created_by: 'current-user',
        scheduled_at: activity.scheduled_at || null,
        completed_at: null
      };
      
      // Add to mock activities
      mockActivities.unshift(newActivity);
      
      toast.success("تم إضافة النشاط بنجاح");
      return newActivity;
    }
    
    // Real implementation using Supabase
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
    
    if (error) {
      console.error("Error creating lead activity:", error);
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

// Complete an activity
export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    console.log("Completing activity:", activityId);
    
    // Find if it's a mock activity
    const mockActivityIndex = mockActivities.findIndex(a => a.id === activityId);
    const useMockData = mockActivityIndex !== -1;
    
    if (useMockData) {
      console.log("Using mock data for completing activity");
      
      // Update the mock activity
      mockActivities[mockActivityIndex].completed_at = new Date().toISOString();
      
      toast.success("تم إكمال النشاط بنجاح");
      return mockActivities[mockActivityIndex];
    }
    
    // Real implementation using Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select()
      .single();
    
    if (error) {
      console.error("Error completing lead activity:", error);
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
