
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadActivity, LeadActivityInput } from "./types";
import { toast } from "sonner";

/**
 * Fetches all leads from the database
 */
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        profiles:assigned_to (
          id, first_name, last_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform response data to match Lead type
    const leads = data.map(lead => ({
      ...lead,
      owner: lead.profiles ? {
        id: lead.profiles.id || "",
        first_name: lead.profiles.first_name,
        last_name: lead.profiles.last_name,
        name: `${lead.profiles.first_name || ""} ${lead.profiles.last_name || ""}`.trim(),
        initials: `${(lead.profiles.first_name || "")[0] || ""}${(lead.profiles.last_name || "")[0] || ""}`.toUpperCase(),
      } : undefined
    })) as unknown as Lead[];

    return leads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("حدث خطأ أثناء تحميل العملاء المحتملين");
    return [];
  }
};

/**
 * Fetches a specific lead by ID
 */
export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        profiles:assigned_to (
          id, first_name, last_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform response data to match Lead type
    const lead = {
      ...data,
      owner: data.profiles ? {
        id: data.profiles.id || "",
        first_name: data.profiles.first_name,
        last_name: data.profiles.last_name,
        name: `${data.profiles.first_name || ""} ${data.profiles.last_name || ""}`.trim(),
        initials: `${(data.profiles.first_name || "")[0] || ""}${(data.profiles.last_name || "")[0] || ""}`.toUpperCase(),
      } : undefined
    } as unknown as Lead;

    return lead;
  } catch (error) {
    console.error("Error fetching lead:", error);
    toast.error("حدث خطأ أثناء تحميل بيانات العميل المحتمل");
    return null;
  }
};

/**
 * Creates a new lead
 */
export const createLead = async (leadData: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Check for required fields
    if (!leadData.first_name || !leadData.email) {
      throw new Error("First name and email are required");
    }
    
    const { data, error } = await supabase
      .from("leads")
      .insert({
        first_name: leadData.first_name,
        last_name: leadData.last_name || "",
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        position: leadData.position,
        industry: leadData.industry,
        country: leadData.country,
        status: leadData.status || "new",
        source: leadData.source,
        notes: leadData.notes,
        assigned_to: leadData.assigned_to,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("تم إنشاء العميل المحتمل بنجاح");
    return data as Lead;
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("حدث خطأ أثناء إنشاء العميل المحتمل");
    return null;
  }
};

/**
 * Updates an existing lead
 */
export const updateLead = async (leadData: Lead): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .update({
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        position: leadData.position,
        industry: leadData.industry,
        country: leadData.country,
        status: leadData.status,
        source: leadData.source,
        notes: leadData.notes,
        assigned_to: leadData.assigned_to,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadData.id)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
    return data as Lead;
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("حدث خطأ أثناء تحديث بيانات العميل المحتمل");
    return null;
  }
};

/**
 * Adds a new lead activity
 */
export const addLeadActivity = async (activityData: LeadActivityInput): Promise<LeadActivity | null> => {
  try {
    if (!activityData.lead_id || !activityData.type || !activityData.description) {
      throw new Error("Lead ID, type, and description are required");
    }
    
    // Add created_by if not provided
    const { data: userData } = await supabase.auth.getUser();
    const created_by = activityData.created_by || userData.user?.id;
    
    const { data, error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: activityData.lead_id,
        type: activityData.type,
        description: activityData.description,
        scheduled_at: activityData.scheduled_at,
        completed_at: activityData.completed_at,
        created_by
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("تم إضافة النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error adding lead activity:", error);
    toast.error("حدث خطأ في إضافة النشاط");
    return null;
  }
};

/**
 * Completes a lead activity
 */
export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .update({
        completed_at: new Date().toISOString()
      })
      .eq("id", activityId)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم إكمال النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("حدث خطأ في تحديث النشاط");
    return null;
  }
};

/**
 * Gets all activities for a lead
 */
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .select(`
        *,
        profiles:created_by (
          first_name, last_name
        )
      `)
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform response data to match LeadActivity type
    const activities = data.map(activity => {
      return {
        ...activity,
        created_by: activity.profiles 
          ? { first_name: activity.profiles.first_name || "", last_name: activity.profiles.last_name || "" }
          : activity.created_by
      };
    }) as LeadActivity[];

    return activities;
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("حدث خطأ في تحميل أنشطة العميل المحتمل");
    return [];
  }
};

/**
 * Gets leads by status/stage for analytics
 */
export const getLeadsByStatus = async (): Promise<{ status: string; count: number }[]> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("status", { count: "exact", head: false })
      .order("status");

    if (error) throw error;

    // Count leads by status
    const statusCounts: Record<string, number> = {};
    (data || []).forEach(lead => {
      const status = lead.status || "undefined";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  } catch (error) {
    console.error("Error fetching leads by status:", error);
    return [];
  }
};

/**
 * Gets leads by source for analytics
 */
export const getLeadsBySource = async (): Promise<{ source: string; count: number }[]> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("source", { count: "exact", head: false });

    if (error) throw error;

    // Count leads by source
    const sourceCounts: Record<string, number> = {};
    (data || []).forEach(lead => {
      const source = lead.source || "undefined";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    return Object.entries(sourceCounts).map(([source, count]) => ({ source, count }));
  } catch (error) {
    console.error("Error fetching leads by source:", error);
    return [];
  }
};

/**
 * Delete a lead by ID
 */
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    // First, delete all related activities
    const { error: activitiesError } = await supabase
      .from("lead_activities")
      .delete()
      .eq("lead_id", id);

    if (activitiesError) {
      console.error("Error deleting lead activities:", activitiesError);
    }

    // Then delete the lead
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) throw error;

    toast.success("تم حذف العميل المحتمل بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    toast.error("حدث خطأ في حذف العميل المحتمل");
    return false;
  }
};

// Delete lead activity function
export const deleteLeadActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .delete()
      .eq('id', activityId);
      
    if (error) throw error;
    
    toast.success("تم حذف النشاط بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead activity:", error);
    toast.error("حدث خطأ في حذف النشاط");
    return false;
  }
};
