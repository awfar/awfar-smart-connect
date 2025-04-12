
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
  permission_name?: string;
}

export const fetchPermissions = async (): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return [];
  }
};

export const fetchPermissionById = async (id: string): Promise<Permission | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الصلاحية:", error);
    toast.error("فشل في جلب تفاصيل الصلاحية");
    return null;
  }
};

export const createPermission = async (permission: Omit<Permission, 'id' | 'created_at'>): Promise<Permission | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .insert([permission])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة الصلاحية بنجاح");
    return data;
  } catch (error: any) {
    console.error("خطأ في إضافة الصلاحية:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الصلاحية موجود بالفعل، يرجى اختيار اسم آخر");
    } else {
      toast.error(error.message || "فشل في إضافة الصلاحية");
    }
    
    return null;
  }
};

export const updatePermission = async (permission: Partial<Permission> & { id: string }): Promise<Permission | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .update({
        name: permission.name,
        description: permission.description
      })
      .eq('id', permission.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث الصلاحية بنجاح");
    return data;
  } catch (error: any) {
    console.error("خطأ في تحديث الصلاحية:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الصلاحية موجود بالفعل، يرجى اختيار اسم آخر");
    } else {
      toast.error(error.message || "فشل في تحديث الصلاحية");
    }
    
    return null;
  }
};

export const deletePermission = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("خطأ في حذف الصلاحية:", error);
    throw error;
  }
};

export const fetchRolePermissions = async (roleId: string): Promise<RolePermission[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        id,
        role,
        permission_id,
        permissions(name)
      `)
      .eq('role', roleId);
    
    if (error) throw error;
    
    return data.map((rp: any) => ({
      ...rp,
      permission_name: rp.permissions?.name
    })) || [];
  } catch (error) {
    console.error("خطأ في جلب صلاحيات الدور:", error);
    toast.error("فشل في جلب صلاحيات الدور");
    return [];
  }
};

export const checkUserPermission = async (userId: string, permissionName: string): Promise<boolean> => {
  try {
    // استخدام دالة قاعدة البيانات للتحقق من الصلاحية
    const { data, error } = await supabase
      .rpc('has_permission', { 
        user_id: userId, 
        permission_name: permissionName 
      });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("خطأ في التحقق من صلاحية المستخدم:", error);
    return false;
  }
};
