
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
      .select('id, name, email, phone')
      .order('name');
    
    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchClients:", error);
    return [];
  }
};
