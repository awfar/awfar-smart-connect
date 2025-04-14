
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  name: string;
}

export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id, first_name, last_name')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    
    return data?.map(client => ({
      id: client.id,
      name: `${client.first_name} ${client.last_name}`
    })) || [];
  } catch (error) {
    console.error("خطأ في جلب العملاء:", error);
    return [];
  }
};
