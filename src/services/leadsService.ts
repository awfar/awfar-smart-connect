
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lead, LeadFilters } from "./types/leadTypes";
import { mapRowToLead } from "./utils/leadMappers";

// Type re-exports using 'export type' to fix isolatedModules issues
export type { Lead, LeadFilters } from "./types/leadTypes";
export { fetchLeadActivities, createLeadActivity, completeLeadActivity } from "./leadActivitiesService";

export const fetchLeads = async (filters?: LeadFilters): Promise<Lead[]> => {
  try {
    // Create base query
    let query = supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `);
    
    // Apply filters without chaining deeply
    if (filters) {
      // Handle stage filter
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('status', filters.stage);
      }
      
      // Handle source filter
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      
      // Handle country filter
      if (filters.country && filters.country !== 'all') {
        query = query.eq('country', filters.country);
      }
      
      // Handle industry filter
      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry);
      }
      
      // Handle assigned_to filter
      if (filters.assigned_to && filters.assigned_to !== 'all') {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      
      // Handle date_range filter
      if (filters.date_range === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (filters.date_range === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        query = query
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString());
      }
    }
    
    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Use type assertion to avoid deep recursion
    return Array.isArray(data) ? data.map(row => mapRowToLead(row)) : [];
    
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("فشل في جلب بيانات العملاء المحتملين");
    return [];
  }
};

export const fetchLeadById = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Use explicit typing to avoid deep recursion
    return mapRowToLead(data);
    
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    toast.error("فشل في جلب بيانات العميل المحتمل");
    return null;
  }
};

export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const leadData: any = { ...lead };
    if (lead.stage) {
      leadData.status = lead.stage;
      delete leadData.stage;
    }
    
    if (!leadData.country) leadData.country = '';
    if (!leadData.industry) leadData.industry = '';
    
    delete leadData.owner;
    
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة العميل المحتمل بنجاح");
    
    return data ? mapRowToLead(data) : null;
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("فشل في إضافة العميل المحتمل");
    return null;
  }
};

export const updateLead = async (id: string, lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const updateData: any = { ...lead };
    if (lead.stage) {
      updateData.status = lead.stage;
      delete updateData.stage;
    }
    
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    delete updateData.owner;
    
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
    
    return data ? mapRowToLead(data) : null;
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("فشل في تحديث بيانات العميل المحتمل");
    return null;
  }
};
