
// Functions for lead activity operations
import { supabase } from "../../integrations/supabase/client";
import { LeadActivity } from "./types";
import { mockActivities } from "./mockData";

// Get activities for a lead from Supabase or fallback to mock data
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    console.log(`Fetching activities for lead ${leadId} from Supabase...`);
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        profiles:created_by (first_name, last_name)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching lead activities:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(activity => ({
        id: activity.id,
        leadId: activity.lead_id,
        lead_id: activity.lead_id,
        type: activity.type,
        description: activity.description,
        createdBy: activity.profiles ? `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}` : undefined,
        created_by: activity.created_by,
        createdAt: activity.created_at,
        created_at: activity.created_at,
        scheduled_at: activity.scheduled_at,
        completed_at: activity.completed_at
      }));
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    console.log("No activities found in Supabase, using mock data");
    return Promise.resolve(mockActivities[leadId] || []);
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    // استخدام البيانات المحلية في حالة حدوث خطأ
    return Promise.resolve(mockActivities[leadId] || []);
  }
};

// Add new activity to a lead
export const addLeadActivity = async (activity: Omit<LeadActivity, "id">): Promise<LeadActivity> => {
  try {
    console.log("Adding new activity:", activity);
    
    // تحضير البيانات للإرسال إلى Supabase
    const activityToInsert = {
      lead_id: activity.leadId || activity.lead_id,
      type: activity.type,
      description: activity.description,
      created_by: activity.createdBy || activity.created_by || null,
      scheduled_at: activity.scheduled_at,
      completed_at: null
    };
    
    // محاولة حفظ النشاط في Supabase
    const { data, error } = await supabase
      .from('lead_activities')
      .insert(activityToInsert)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding activity to Supabase:", error);
      throw error;
    }
    
    // إذا نجحت العملية، نقوم بإرجاع النشاط المضاف
    if (data) {
      return {
        id: data.id,
        leadId: data.lead_id,
        lead_id: data.lead_id,
        type: data.type,
        description: data.description,
        createdBy: data.created_by,
        created_by: data.created_by,
        createdAt: data.created_at,
        created_at: data.created_at,
        scheduled_at: data.scheduled_at,
        completed_at: data.completed_at
      };
    }
    
    // في حالة عدم وجود بيانات مرجعة، نستخدم البيانات المحلية
    const newActivity: LeadActivity = {
      id: `a${Date.now()}`,
      ...activity,
      lead_id: activity.leadId || activity.lead_id,
      created_by: activity.createdBy || activity.created_by,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    if (!mockActivities[newActivity.leadId!]) {
      mockActivities[newActivity.leadId!] = [];
    }
    
    mockActivities[newActivity.leadId!].push(newActivity);
    return Promise.resolve(newActivity);
  } catch (error) {
    console.error("Error adding lead activity:", error);
    
    // في حالة الخطأ، نستخدم البيانات المحلية
    const newActivity: LeadActivity = {
      id: `a${Date.now()}`,
      ...activity,
      lead_id: activity.leadId || activity.lead_id,
      created_by: activity.createdBy || activity.created_by,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    if (!mockActivities[newActivity.leadId!]) {
      mockActivities[newActivity.leadId!] = [];
    }
    
    mockActivities[newActivity.leadId!].push(newActivity);
    return Promise.resolve(newActivity);
  }
};
