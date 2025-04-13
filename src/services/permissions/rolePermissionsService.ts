
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// إضافة صلاحية لدور
export const addPermissionToRole = async (roleId: string, permissionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .insert([
        { role: roleId, permission_id: permissionId }
      ]);
    
    if (error) throw error;
    
    toast.success("تمت إضافة الصلاحية بنجاح");
    return true;
  } catch (error: any) {
    console.error("خطأ في إضافة الصلاحية للدور:", error);
    
    if (error.code === '23505') {
      toast.error("الصلاحية موجودة بالفعل لهذا الدور");
    } else {
      toast.error("فشل في إضافة الصلاحية");
    }
    
    return false;
  }
};

// إزالة صلاحية من دور
export const removePermissionFromRole = async (rolePermissionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('id', rolePermissionId);
    
    if (error) throw error;
    
    toast.success("تمت إزالة الصلاحية بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في إزالة الصلاحية من الدور:", error);
    toast.error("فشل في إزالة الصلاحية");
    return false;
  }
};
