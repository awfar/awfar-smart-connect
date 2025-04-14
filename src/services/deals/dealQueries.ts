
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealDBRow } from "../types/dealTypes";
import { toast } from "sonner";
import { transformDealFromSupabase } from "./utils";

// Get all deals with filter options
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
    }
    
    // Add sorting - newest first
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
    
    // Transform data before returning
    if (data && data.length > 0) {
      return data.map((deal: DealDBRow) => transformDealFromSupabase(deal));
    }
    
    console.log("No deals found in Supabase, returning empty array");
    return [];
  } catch (error) {
    console.error("Error fetching deals:", error);
    toast.error("تعذر جلب بيانات الصفقات");
    return [];
  }
};

// Get deal by ID from Supabase
export const getDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
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
    
    if (data) {
      return transformDealFromSupabase(data as DealDBRow);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    toast.error("تعذر جلب بيانات الصفقة");
    return null;
  }
};

// Get available deal stages
export const getDealStages = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('stage')
      .not('stage', 'is', null)
      .not('stage', 'eq', '');
    
    if (error) throw error;
    
    // Extract unique stages
    const stages = data
      .map(item => item.stage as string)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return stages.length > 0 ? stages : getDefaultStages();
  } catch (error) {
    console.error("Error fetching deal stages:", error);
    return getDefaultStages();
  }
};

// Helper function for default deal stages
const getDefaultStages = (): string[] => {
  return [
    "تأهيل",
    "اجتماع أولي",
    "تحليل احتياجات",
    "تقديم عرض",
    "تفاوض",
    "مغلق مكسب",
    "مغلق خسارة"
  ];
};
