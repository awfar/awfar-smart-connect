
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  stage: string;
  source: string;
  notes: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  position?: string;
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
  scheduled_at?: string;
  completed_at?: string;
}

export interface LeadFilters {
  stage?: string;
  source?: string;
  country?: string;
  industry?: string;
  assigned_to?: string;
  date_range?: string;
}

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
    
    return (data || []).map(lead => {
      const ownerFirstName = lead.profiles?.first_name || '';
      const ownerLastName = lead.profiles?.last_name || '';
      const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();
      const ownerInitials = 
        (ownerFirstName ? ownerFirstName[0] : '') + 
        (ownerLastName ? ownerLastName[0] : '');
      
      return {
        ...lead,
        owner: ownerName ? {
          name: ownerName,
          avatar: '/placeholder.svg',
          initials: ownerInitials || 'مس'
        } : undefined
      };
    });
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
    
    const ownerFirstName = data.profiles?.first_name || '';
    const ownerLastName = data.profiles?.last_name || '';
    const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();
    const ownerInitials = 
      (ownerFirstName ? ownerFirstName[0] : '') + 
      (ownerLastName ? ownerLastName[0] : '');
    
    return {
      ...data,
      owner: ownerName ? {
        name: ownerName,
        avatar: '/placeholder.svg',
        initials: ownerInitials || 'مس'
      } : undefined
    };
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
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        first_name: lead.first_name,
        last_name: lead.last_name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        country: lead.country,
        industry: lead.industry,
        status: lead.stage || 'new',
        source: lead.source,
        position: lead.position,
        notes: lead.notes,
        assigned_to: lead.assigned_to
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة العميل المحتمل بنجاح");
    return data;
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
    
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    delete updateData.owner;
    
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
    return data;
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
