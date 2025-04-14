
// إضافة خدمات العملاء
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, phone')
      .order('name');
    
    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
    
    return (data || []).map(company => ({
      id: company.id,
      name: company.name,
      phone: company.phone,
      email: '', // Not available in companies table
      company: company.name
    }));
  } catch (error) {
    console.error("Error in fetchClients:", error);
    return [];
  }
};
