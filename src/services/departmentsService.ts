
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select()
      .order('name');
    
    if (error) throw error;
    
    // احصل على عدد المستخدمين في كل قسم
    const departmentsWithCount = await Promise.all(data.map(async (dept) => {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('department_id', dept.id);
      
      return {
        ...dept,
        user_count: count || 0
      };
    }));
    
    return departmentsWithCount;
  } catch (error) {
    console.error("خطأ في جلب الأقسام:", error);
    toast.error("فشل في جلب بيانات الأقسام");
    return [];
  }
};

export const createDepartment = async (department: { name: string; description?: string }): Promise<Department | null> => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert([{
        name: department.name,
        description: department.description
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إنشاء القسم بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في إنشاء القسم:", error);
    toast.error("فشل في إنشاء القسم");
    return null;
  }
};

export const updateDepartment = async (department: Partial<Department> & { id: string }): Promise<Department | null> => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .update({
        name: department.name,
        description: department.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', department.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث القسم بنجاح");
    return data;
  } catch (error) {
    console.error("خطأ في تحديث القسم:", error);
    toast.error("فشل في تحديث القسم");
    return null;
  }
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    // التحقق من عدم وجود مستخدمين في القسم
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('department_id', id);
    
    if (countError) throw countError;
    
    if (count && count > 0) {
      toast.error("لا يمكن حذف القسم لأنه يحتوي على مستخدمين");
      return false;
    }
    
    // التحقق من عدم وجود فرق في القسم
    const { count: teamCount, error: teamCountError } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .eq('department_id', id);
    
    if (teamCountError) throw teamCountError;
    
    if (teamCount && teamCount > 0) {
      toast.error("لا يمكن حذف القسم لأنه يحتوي على فرق");
      return false;
    }
    
    // حذف القسم
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("تم حذف القسم بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف القسم:", error);
    toast.error("فشل في حذف القسم");
    return false;
  }
};
