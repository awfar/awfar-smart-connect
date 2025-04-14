
// إضافة خدمات الموظفين
import { supabase } from "@/integrations/supabase/client";

export interface Staff {
  id: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
}

export const fetchStaff = async (): Promise<Staff[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, department_id')
      .order('first_name');
    
    if (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
    
    // تنسيق البيانات لتناسب واجهة Staff
    const formattedStaff = (data || []).map(profile => ({
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      email: '', // Email not selected in the query
      role: profile.role,
      department: profile.department_id
    }));
    
    return formattedStaff;
  } catch (error) {
    console.error("Error in fetchStaff:", error);
    return [];
  }
};
