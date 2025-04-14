
import { supabase } from "@/integrations/supabase/client";
import { LeadActivity } from "../types/leadTypes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Get activities for a specific lead
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log(`Fetching activities for lead ${leadId}`);
    
    // Handle mock data IDs (they start with "lead-")
    if (leadId.startsWith("lead-")) {
      console.log("Using mock data for lead activities");
      return getMockActivities(leadId);
    }
    
    // For real UUIDs, fetch from Supabase
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error in getLeadActivities:", error);
      throw error;
    }
    
    return data as LeadActivity[];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    
    // Return mock activities if there was an error
    return getMockActivities(leadId);
  }
};

// Add a new activity for a lead
export const addLeadActivity = async (activity: Omit<LeadActivity, "id" | "created_at">): Promise<LeadActivity> => {
  try {
    // Handle mock data IDs
    if (activity.lead_id.startsWith("lead-")) {
      console.log("Using mock data for adding activity");
      const mockActivity = {
        ...activity,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      } as LeadActivity;
      
      return Promise.resolve(mockActivity);
    }
    
    const { data, error } = await supabase
      .from("lead_activities")
      .insert({
        ...activity,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as LeadActivity;
  } catch (error) {
    console.error("Error adding lead activity:", error);
    toast.error("تعذر إضافة النشاط للعميل المحتمل");
    throw error;
  }
};

// Mark an activity as complete
export const completeLeadActivity = async (activityId: string): Promise<LeadActivity> => {
  try {
    // Handle mock data
    if (activityId.includes("mock")) {
      console.log("Using mock data for completing activity");
      const mockActivity = {
        id: activityId,
        completed_at: new Date().toISOString(),
      } as LeadActivity;
      
      return Promise.resolve(mockActivity);
    }
    
    const { data, error } = await supabase
      .from("lead_activities")
      .update({
        completed_at: new Date().toISOString(),
      })
      .eq("id", activityId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as LeadActivity;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("تعذر تحديث حالة النشاط");
    throw error;
  }
};

// Helper function to generate mock activities for leads
const getMockActivities = (leadId: string): LeadActivity[] => {
  return [
    {
      id: `mock-activity-${uuidv4()}`,
      lead_id: leadId,
      type: "call",
      description: "اتصال أولي للتعريف بالخدمات",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      created_by: "user-1",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: `mock-activity-${uuidv4()}`,
      lead_id: leadId,
      type: "note",
      description: "العميل مهتم بباقة الأعمال المتكاملة",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      created_by: "user-1",
      scheduled_at: null,
      completed_at: null,
    },
    {
      id: `mock-activity-${uuidv4()}`,
      lead_id: leadId,
      type: "meeting",
      description: "اجتماع لمناقشة تفاصيل المشروع",
      created_at: new Date().toISOString(),
      created_by: "user-1",
      scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      completed_at: null,
    },
  ];
};
