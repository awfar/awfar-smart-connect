
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper function to safely access object properties
const safeGetName = (obj: any): string => {
  if (!obj) return '';
  
  // Handle array case
  if (Array.isArray(obj)) {
    const firstItem = obj[0];
    return firstItem && firstItem.name ? firstItem.name : '';
  }
  
  // Handle object case
  return obj.name || '';
};

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    // أولاً، نحصل على دور المستخدم
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Use the safeGetName helper to safely extract the role name
    const roleName = safeGetName(userData?.role);
    
    // ثم نحصل على الصلاحيات المرتبطة بهذا الدور
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', roleName);
    
    if (permissionsError) throw permissionsError;
    
    // Extract permission names safely
    return permissionsData.map(p => {
      if (p.permissions) {
        // Handle if permissions is an array
        if (Array.isArray(p.permissions)) {
          return p.permissions[0]?.name || '';
        }
        // Handle if permissions is an object
        return p.permissions.name || '';
      }
      return '';
    }).filter(name => name !== ''); // Filter out any empty strings
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};
