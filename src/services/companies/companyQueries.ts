
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
  if (!id) {
    throw new Error('Company ID is required');
  }

  try {
    // Modified query to remove the account_manager join which is causing errors
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching company with id ${id}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error(`Company with id ${id} not found`);
    }

    return transformCompanyData(data);
  } catch (error) {
    console.error(`Failed to fetch company with id ${id}:`, error);
    throw error;
  }
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
