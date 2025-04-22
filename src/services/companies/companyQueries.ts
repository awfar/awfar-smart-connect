
import { supabase } from '@/integrations/supabase/client';
import { transformCompanyData } from './companyUtils';
import type { Company } from './companyTypes';

export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return data.map(transformCompanyData);
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching company with id ${id}:`, error);
    throw error;
  }

  return transformCompanyData(data);
};

export const searchCompanies = async (query: string): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name');

  if (error) {
    console.error('Error searching companies:', error);
    throw error;
  }

  return data.map(transformCompanyData);
};
