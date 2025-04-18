
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadActivity } from "./types";
import { toast } from "sonner";

// Get all leads with optional filtering
export const getLeads = async (filters?: Record<string, any>): Promise<Lead[]> => {
  try {
    let query = supabase
      .from('leads')
      .select(`
        *,
        owner:assigned_to(id, first_name, last_name, name, avatar, initials)
      `)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'search') {
          query = query.eq(key, value);
        }
      });

      // Handle search separately
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(
          `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as Lead[];
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("فشل في تحميل العملاء المحتملين");
    return [];
  }
};

// Get a single lead by ID
export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        owner:assigned_to(id, first_name, last_name, name, avatar, initials)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Lead;
  } catch (error) {
    console.error("Error fetching lead:", error);
    toast.error("فشل في تحميل بيانات العميل المحتمل");
    return null;
  }
};

// Create a new lead
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("تم إضافة العميل المحتمل بنجاح");
    return data as Lead;
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("فشل في إضافة العميل المحتمل");
    return null;
  }
};

// Update an existing lead
export const updateLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    if (!lead.id) {
      throw new Error("Lead ID is required for update");
    }

    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', lead.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
    return data as Lead;
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("فشل في تحديث بيانات العميل المحتمل");
    return null;
  }
};

// Delete a lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success("تم حذف العميل المحتمل بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    toast.error("فشل في حذف العميل المحتمل");
    return false;
  }
};

// Get lead activities
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        profiles:created_by(first_name, last_name)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as LeadActivity[];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في تحميل أنشطة العميل المحتمل");
    return [];
  }
};

// Add a new lead activity
export const addLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert(activity)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("تم إضافة النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error adding lead activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

// Complete a lead activity
export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', activityId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("تم إتمام النشاط بنجاح");
    return data as LeadActivity;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إتمام النشاط");
    return null;
  }
};

// Get lead sources for filtering
export const getLeadSources = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null);

    if (error) {
      throw error;
    }

    // Extract unique sources
    const sources = [...new Set(data.map(item => item.source).filter(Boolean))];
    return sources;
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    return [];
  }
};

// Get lead stages for filtering
export const getLeadStages = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status');

    if (error) {
      throw error;
    }

    // Extract unique stages, using status field
    const stages = [...new Set(
      data
        .map(item => item.status)
        .filter(Boolean)
    )];
    
    return stages;
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    return [];
  }
};

// Get countries for filtering
export const getCountries = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('country')
      .not('country', 'is', null);

    if (error) {
      throw error;
    }

    // Extract unique countries
    const countries = [...new Set(data.map(item => item.country).filter(Boolean))];
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

// Get industries for filtering
export const getIndustries = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('industry')
      .not('industry', 'is', null);

    if (error) {
      throw error;
    }

    // Extract unique industries
    const industries = [...new Set(data.map(item => item.industry).filter(Boolean))];
    return industries;
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
};

// Get sales owners for filtering
export const getSalesOwners = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'sales')
      .order('first_name', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching sales owners:", error);
    return [];
  }
};

// Get lead count by status for dashboard
export const getLeadCountByStatus = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status');

    if (error) {
      throw error;
    }

    // Count leads by status
    const counts: Record<string, number> = {};
    data.forEach(lead => {
      const status = lead.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  } catch (error) {
    console.error("Error fetching lead counts by status:", error);
    return {};
  }
};

// Get total lead count
export const getTotalLeadCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error fetching total lead count:", error);
    return 0;
  }
};
