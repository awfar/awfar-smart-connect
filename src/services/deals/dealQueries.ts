
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealDBRow } from "../types/dealTypes";
import { toast } from "sonner";
import { transformDealFromSupabase } from "./utils";

// Get all deals with filter options - simplified type handling
export const getDeals = async (filters?: Record<string, any>): Promise<Deal[]> => {
  try {
    console.log("Fetching deals from Supabase with filters:", filters);
    
    // Start building the query
    let query = supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name),
        leads:lead_id (first_name, last_name, email)
      `);
    
    // Apply filters if provided
    if (filters) {
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('stage', filters.stage);
      }
      
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.owner_id && filters.owner_id !== 'all') {
        query = query.eq('owner_id', filters.owner_id);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.minValue) {
        query = query.gte('value', filters.minValue);
      }

      if (filters.maxValue) {
        query = query.lte('value', filters.maxValue);
      }

      if (filters.closeDate) {
        const { fromDate, toDate } = filters.closeDate;
        if (fromDate) {
          query = query.gte('expected_close_date', fromDate);
        }
        if (toDate) {
          query = query.lte('expected_close_date', toDate);
        }
      }

      // Sort by specific column if provided
      if (filters.sortBy) {
        const { column, direction = 'asc' } = filters.sortBy;
        if (column) {
          query = query.order(column, { ascending: direction === 'asc' });
        }
      }
    } else {
      // Default sorting - newest first
      query = query.order('created_at', { ascending: false });
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
    
    // Transform data before returning
    return (data || []).map((deal) => {
      // Use type assertion to tell TypeScript about the expected structure
      return transformDealFromSupabase(deal as unknown as DealDBRow);
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    toast.error("تعذر جلب بيانات الصفقات");
    return [];
  }
};

// Get deal by ID from Supabase with explicit typing
export const getDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name),
        leads:lead_id (first_name, last_name, email)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching deal by ID:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Use type assertion to tell TypeScript about the expected structure
    return transformDealFromSupabase(data as unknown as DealDBRow);
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    toast.error("تعذر جلب بيانات الصفقة");
    return null;
  }
};

// Get deals by company ID
export const getDealsByCompanyId = async (companyId: string): Promise<Deal[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name),
        leads:lead_id (first_name, last_name, email)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching deals by company ID:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map((deal) => transformDealFromSupabase(deal as unknown as DealDBRow));
    }

    return [];
  } catch (error) {
    console.error("Error fetching deals by company ID:", error);
    toast.error("تعذر جلب صفقات الشركة");
    return [];
  }
};

// Get deals by lead ID
export const getDealsByLeadId = async (leadId: string): Promise<Deal[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name),
        leads:lead_id (first_name, last_name, email)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching deals by lead ID:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map((deal) => transformDealFromSupabase(deal as unknown as DealDBRow));
    }

    return [];
  } catch (error) {
    console.error("Error fetching deals by lead ID:", error);
    toast.error("تعذر جلب صفقات العميل المحتمل");
    return [];
  }
};

// Get available deal stages
export const getDealStages = async (): Promise<string[]> => {
  return ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
};

// Get sales team members (deal owners)
export const getSalesTeamMembers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('role', 'sales')
      .order('first_name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching sales team members:", error);
    return [];
  }
};
