
import { supabase } from "@/integrations/supabase/client";
import { Company } from "./companyTypes";
import { transformCompanyData } from "./companyUtils";

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching companies from Supabase:", error);
      throw error;
    }
    
    return data.map(transformCompanyData);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching company from Supabase:", error);
      throw error;
    }
    
    return data ? transformCompanyData(data) : null;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return null;
  }
};

export const filterCompanies = async (filters: {
  industry?: string;
  country?: string;
  type?: string;
}): Promise<Company[]> => {
  try {
    let query = supabase.from('companies').select('*');
    
    if (filters.industry && filters.industry !== 'all') {
      query = query.eq('industry', filters.industry);
    }
    
    if (filters.country && filters.country !== 'all') {
      query = query.eq('country', filters.country);
    }
    
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error filtering companies in Supabase:", error);
      throw error;
    }
    
    return data.map(transformCompanyData);
  } catch (error) {
    console.error("Error filtering companies:", error);
    return [];
  }
};
