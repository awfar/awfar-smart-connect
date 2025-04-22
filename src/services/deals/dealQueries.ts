
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealDBRow } from "../types/dealTypes";
import { toast } from "sonner";
import { transformDealFromSupabase } from "./utils";

// Type for filter options - explicit to avoid deep type instantiation
export interface DealFilters {
  stage?: string;
  status?: string;
  owner_id?: string;
  search?: string;
  minValue?: number;
  maxValue?: number;
  closeDate?: {
    fromDate?: string;
    toDate?: string;
  };
  sortBy?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

// Get all deals with filter options
export const getDeals = async (filters?: DealFilters): Promise<Deal[]> => {
  try {
    console.log("Fetching deals from Supabase with filters:", filters);
    
    // Start building the query
    let query = supabase
      .from('deals')
      .select(`
        id,
        name,
        description,
        value,
        stage,
        status,
        expected_close_date,
        owner_id,
        company_id,
        contact_id,
        created_at,
        updated_at,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name)
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
    
    // Transform data using safely constructed objects
    return (data || []).map((deal) => {
      // Safely handle potentially null joined data
      const profiles = deal.profiles || null;
      const companies = deal.companies || null;
      const company_contacts = deal.company_contacts || null;
      
      // Transform data with explicit typing
      return transformDealFromSupabase({
        id: deal.id,
        name: deal.name,
        description: deal.description,
        value: deal.value,
        stage: deal.stage,
        status: deal.status,
        expected_close_date: deal.expected_close_date,
        owner_id: deal.owner_id,
        company_id: deal.company_id,
        contact_id: deal.contact_id,
        created_at: deal.created_at,
        updated_at: deal.updated_at,
        profiles: profiles,
        companies: companies,
        company_contacts: company_contacts,
        leads: null // No leads queried here
      });
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    toast.error("تعذر جلب بيانات الصفقات");
    return [];
  }
};

// Get deal by ID
export const getDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        id,
        name,
        description,
        value,
        stage,
        status,
        expected_close_date,
        owner_id,
        company_id,
        contact_id,
        created_at,
        updated_at,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching deal by ID:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Using explicit safe transformation to avoid deep type instantiation
    return transformDealFromSupabase({
      id: data.id,
      name: data.name,
      description: data.description,
      value: data.value,
      stage: data.stage,
      status: data.status,
      expected_close_date: data.expected_close_date,
      owner_id: data.owner_id,
      company_id: data.company_id,
      contact_id: data.contact_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      profiles: data.profiles || null,
      companies: data.companies || null,
      company_contacts: data.company_contacts || null,
      leads: null // No lead data in this query
    });
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
        id,
        name,
        description,
        value,
        stage,
        status,
        expected_close_date,
        owner_id,
        company_id,
        contact_id,
        created_at,
        updated_at,
        profiles:owner_id (first_name, last_name),
        companies:company_id (name),
        company_contacts:contact_id (name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching deals by company ID:", error);
      throw error;
    }

    if (!data || data.length === 0) return [];

    return data.map((deal) => {
      // Using explicit safe transformation to avoid deep type instantiation
      return transformDealFromSupabase({
        id: deal.id,
        name: deal.name,
        description: deal.description,
        value: deal.value,
        stage: deal.stage,
        status: deal.status,
        expected_close_date: deal.expected_close_date,
        owner_id: deal.owner_id,
        company_id: deal.company_id,
        contact_id: deal.contact_id,
        created_at: deal.created_at,
        updated_at: deal.updated_at,
        profiles: deal.profiles || null,
        companies: deal.companies || null,
        company_contacts: deal.company_contacts || null,
        leads: null // No lead data in this query
      });
    });
  } catch (error) {
    console.error("Error fetching deals by company ID:", error);
    toast.error("تعذر جلب صفقات الشركة");
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
