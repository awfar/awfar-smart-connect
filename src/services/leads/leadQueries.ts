
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
      
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }
    }
    
    // Add sorting
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
    
    console.log("No data found in Supabase, using mock data");
    return Promise.resolve(mockLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("تعذر جلب بيانات العملاء المحتملين");
    return Promise.resolve(mockLeads);
  }
};

// Get lead by ID from Supabase
export const getLeadById = async (id: string): Promise<Lead | null> => {
  try {
    console.log(`Fetching lead with id ${id} from Supabase...`);
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
    
    // If no data found, look in mock data
    console.log("Lead not found in Supabase, checking mock data");
    const mockLead = mockLeads.find((lead) => lead.id === id);
    return Promise.resolve(mockLead || null);
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    toast.error("تعذر جلب بيانات العميل المحتمل");
    
    // Look in mock data as fallback
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
      .not('source', 'is', null);
    
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
      .not('status', 'is', null);
    
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

// Get companies for dropdown
export const getCompanies = async (): Promise<{id: string, name: string}[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
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
    "مغلق"
  ];
};

// Alias for backward compatibility
export const fetchLeadById = getLeadById;
