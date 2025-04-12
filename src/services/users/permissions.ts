
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    // أولاً، نحصل على دور المستخدم
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // ثم نحصل على الصلاحيات المرتبطة بهذا الدور
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', userData.role);
    
    if (permissionsError) throw permissionsError;
    
    return permissionsData.map(p => p.permissions.name);
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};
