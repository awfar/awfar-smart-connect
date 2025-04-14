
import { supabase } from "@/integrations/supabase/client";

export interface StaffMember {
  id: string;
  name: string;
}

export const fetchStaff = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .order('first_name');
    
    if (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
    
    return data?.map(staff => ({
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`
    })) || [];
  } catch (error) {
    console.error("خطأ في جلب الموظفين:", error);
    return [];
  }
};
