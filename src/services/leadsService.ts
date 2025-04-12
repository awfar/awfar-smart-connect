
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string;
  industry: string;
  stage: string;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  position?: string | null;
  owner?: {
    name: string;
    avatar: string;
    initials: string;
  };
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: string;
  description: string;
  created_at: string;
  created_by?: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
}

export interface LeadFilters {
  stage?: string;
  source?: string;
  country?: string;
  industry?: string;
  assigned_to?: string;
  date_range?: string;
}

// Type definition for database lead row
interface LeadRow {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country?: string | null;
  industry?: string | null;
  status: string; // This is mapped to 'stage' in our interface
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
  position?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

// Helper function to map database row to Lead interface
const mapRowToLead = (row: LeadRow): Lead => {
  const ownerFirstName = row.profiles?.first_name || '';
  const ownerLastName = row.profiles?.last_name || '';
  const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();
  const ownerInitials = 
    (ownerFirstName ? ownerFirstName[0] : '') + 
    (ownerLastName ? ownerLastName[0] : '');
  
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    country: row.country || '',
    industry: row.industry || '',
    stage: row.status, // Map status to stage
    source: row.source,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    assigned_to: row.assigned_to || undefined,
    position: row.position,
    owner: ownerName ? {
      name: ownerName,
      avatar: '/placeholder.svg',
      initials: ownerInitials || 'مس'
    } : undefined
  };
};

export const fetchLeads = async (filters?: LeadFilters): Promise<Lead[]> => {
  try {
    let query = supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('status', filters.stage);
      }
      
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      
      if (filters.country && filters.country !== 'all') {
        query = query.eq('country', filters.country);
      }
      
      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry);
      }
      
      if (filters.assigned_to && filters.assigned_to !== 'all') {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      
      // Date range filter would need more complex logic
      // This is a simplified example
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

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map database rows to Lead objects
    return (data as LeadRow[] || []).map(mapRowToLead);
    
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
    
    // Map the row to a Lead object
    return mapRowToLead(data as LeadRow);
    
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    toast.error("فشل في جلب بيانات العميل المحتمل");
    return null;
  }
};

export const fetchLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching lead activities:", error);
    toast.error("فشل في جلب أنشطة العميل المحتمل");
    return [];
  }
};

export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Convert stage to status for DB
    const leadData: any = { ...lead };
    if (lead.stage) {
      leadData.status = lead.stage;
      delete leadData.stage;
    }
    
    // Add default values for required fields
    if (!leadData.country) leadData.country = '';
    if (!leadData.industry) leadData.industry = '';
    
    // Remove owner property as it's not in the database
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
    
    // Return the created lead with proper mapping
    return data ? mapRowToLead(data as LeadRow) : null;
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("فشل في إضافة العميل المحتمل");
    return null;
  }
};

export const updateLead = async (id: string, lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Convert stage to status field for DB
    const updateData: any = { ...lead };
    if (lead.stage) {
      updateData.status = lead.stage;
      delete updateData.stage;
    }
    
    // Remove properties that should not be sent to the database
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
    
    // Return the updated lead with proper mapping
    return data ? mapRowToLead(data as LeadRow) : null;
  } catch (error) {
    console.error("Error updating lead:", error);
    toast.error("فشل في تحديث بيانات العميل المحتمل");
    return null;
  }
};

export const createLeadActivity = async (activity: Partial<LeadActivity>): Promise<LeadActivity | null> => {
  try {
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
    
    if (error) throw error;
    
    toast.success("تم إضافة النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error creating lead activity:", error);
    toast.error("فشل في إضافة النشاط");
    return null;
  }
};

export const completeLeadActivity = async (activityId: string): Promise<LeadActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .update({
        completed_at: new Date().toISOString()
      })
      .eq('id', activityId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إكمال النشاط بنجاح");
    return data;
  } catch (error) {
    console.error("Error completing lead activity:", error);
    toast.error("فشل في إكمال النشاط");
    return null;
  }
};
