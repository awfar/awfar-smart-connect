
// Functions for fetching lead data
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDBRow } from "../types/leadTypes";
import { mockLeads } from "./mockData";
import { toast } from "sonner";
import { transformLeadFromSupabase } from "./utils";

// Get all leads with filter options
export const getLeads = async (filters?: Record<string, any>): Promise<Lead[]> => {
  try {
    console.log("Fetching leads from Supabase with filters:", filters);
    
    // Start building the query
    let query = supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `);
    
    // Apply filters if provided
    if (filters) {
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('status', filters.stage);
      }
      
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      
      if (filters.assigned_to && filters.assigned_to !== 'all') {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      // Handle country filter with type safety
      if (filters.country && filters.country !== 'all') {
        query = query.eq('country', filters.country as string);
      }
      
      // Handle industry filter with type safety
      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry as string);
      }
      
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }
    }
    
    // Add sorting - newest first
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
    
    // Transform data before returning
    if (data && data.length > 0) {
      return data.map((lead: LeadDBRow) => transformLeadFromSupabase(lead));
    }
    
    console.log("No data found in Supabase, returning empty array");
    return [];
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("تعذر جلب بيانات العملاء المحتملين");
    return mockLeads; // Return mock data only if there's an error
  }
};

// Get lead by ID from Supabase
export const getLeadById = async (id: string): Promise<Lead | null> => {
  try {
    console.log(`Fetching lead with id ${id} from Supabase...`);
    
    // Check if it's a mock ID
    if (id.startsWith('lead-')) {
      console.log("Lead ID appears to be mock data, checking mock array");
      const mockLead = mockLeads.find((lead) => lead.id === id);
      if (mockLead) return mockLead;
    }
    
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching lead by ID:", error);
      throw error;
    }
    
    if (data) {
      return transformLeadFromSupabase(data as LeadDBRow);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    toast.error("تعذر جلب بيانات العميل المحتمل");
    
    // Look in mock data as fallback only if there's an error
    const mockLead = mockLeads.find((lead) => lead.id === id);
    return Promise.resolve(mockLead || null);
  }
};

// Get available lead sources
export const getLeadSources = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null)
      .not('source', 'eq', '');
    
    if (error) throw error;
    
    // Extract unique sources
    const sources = data
      .map(item => item.source as string)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return sources.length > 0 ? sources : getDefaultSources();
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    return getDefaultSources();
  }
};

// Get available statuses
export const getLeadStages = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status')
      .not('status', 'is', null)
      .not('status', 'eq', '');
    
    if (error) throw error;
    
    // Extract unique statuses
    const statuses = data
      .map(item => item.status as string)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return statuses.length > 0 ? statuses : getDefaultStages();
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    return getDefaultStages();
  }
};

// Get available sales owners (users)
export const getSalesOwners = async (): Promise<{id: string, name: string}[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');
    
    if (error) throw error;
    
    return data.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.id
    }));
  } catch (error) {
    console.error("Error fetching sales owners:", error);
    return [];
  }
};

// Get countries for filtering - Fixed approach to avoid deep type instantiation
export const getCountries = async (): Promise<string[]> => {
  try {
    // First check if table exists
    const { count } = await supabase.rpc('get_table_row_count', { table_name: 'leads' });
    
    if (!count) {
      console.log("Leads table not found or empty, returning default countries");
      return getDefaultCountries();
    }
    
    // Try to query the country column
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('country')
        .not('country', 'is', null)
        .not('country', 'eq', '');
      
      // If error contains 'column not found', return defaults
      if (error && error.message && error.message.includes("column") && error.message.includes("does not exist")) {
        console.log("Country column doesn't exist, returning default countries");
        return getDefaultCountries();
      }
      
      if (error) throw error;
      
      // Extract unique countries
      const countries = data
        .map(item => item.country as string)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      return countries.length > 0 ? countries : getDefaultCountries();
    } catch (error: any) {
      console.error("Error fetching countries:", error);
      return getDefaultCountries();
    }
  } catch (error) {
    console.error("Error in getCountries:", error);
    return getDefaultCountries();
  }
};

// Get industries for filtering - Fixed approach to avoid deep type instantiation
export const getIndustries = async (): Promise<string[]> => {
  try {
    // First check if table exists
    const { count } = await supabase.rpc('get_table_row_count', { table_name: 'leads' });
    
    if (!count) {
      console.log("Leads table not found or empty, returning default industries");
      return getDefaultIndustries();
    }
    
    // Try to query the industry column
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('industry')
        .not('industry', 'is', null)
        .not('industry', 'eq', '');
      
      // If error contains 'column not found', return defaults
      if (error && error.message && error.message.includes("column") && error.message.includes("does not exist")) {
        console.log("Industry column doesn't exist, returning default industries");
        return getDefaultIndustries();
      }
      
      if (error) throw error;
      
      // Extract unique industries
      const industries = data
        .map(item => item.industry as string)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      return industries.length > 0 ? industries : getDefaultIndustries();
    } catch (error) {
      console.error("Error fetching industries:", error);
      return getDefaultIndustries();
    }
  } catch (error) {
    console.error("Error in getIndustries:", error);
    return getDefaultIndustries();
  }
};

// Helper functions for default values
const getDefaultSources = (): string[] => {
  return [
    "موقع إلكتروني",
    "وسائل التواصل الاجتماعي",
    "معرض تجاري",
    "توصية",
    "إعلان",
    "مكالمة هاتفية",
    "شريك أعمال",
    "أخرى"
  ];
};

const getDefaultStages = (): string[] => {
  return [
    "جديد",
    "مؤهل",
    "عرض سعر",
    "تفاوض",
    "مغلق مكسب",
    "مغلق خسارة",
    "مؤجل"
  ];
};

const getDefaultIndustries = (): string[] => {
  return [
    "تكنولوجيا المعلومات",
    "الرعاية الصحية",
    "التعليم",
    "التجزئة",
    "التصنيع",
    "الخدمات المالية",
    "البناء",
    "النقل",
    "الترفيه",
    "أخرى"
  ];
};

const getDefaultCountries = (): string[] => {
  return [
    "المملكة العربية السعودية",
    "الإمارات العربية المتحدة",
    "مصر",
    "الأردن",
    "قطر",
    "البحرين",
    "الكويت",
    "عمان",
    "العراق",
    "لبنان"
  ];
};

// Alias for backward compatibility
export const fetchLeadById = getLeadById;
