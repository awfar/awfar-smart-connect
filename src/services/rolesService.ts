
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // إضافة الأدوار المحددة مسبقًا في النظام إذا لم تكن موجودة في النتائج
    const systemRoles = [
      { name: 'super_admin', description: 'مدير النظام مع كامل الصلاحيات' },
      { name: 'team_manager', description: 'مدير فريق' },
      { name: 'sales', description: 'موظف مبيعات' },
      { name: 'customer_service', description: 'موظف خدمة عملاء' },
      { name: 'technical_support', description: 'موظف دعم فني' }
    ];
    
    const existingRoleNames = data.map(role => role.name);
    
    const allRoles = [...data];
    
    // إضافة الأدوار المحددة مسبقًا التي لم تكن موجودة في النتائج
    systemRoles.forEach(role => {
      if (!existingRoleNames.includes(role.name)) {
        allRoles.push({
          id: role.name,
          name: role.name,
          description: role.description
        });
      }
    });
    
    return allRoles;
  } catch (error) {
    console.error("خطأ في جلب الأدوار:", error);
    toast.error("فشل في جلب قائمة الأدوار");
    return [];
  }
};

export const fetchRoleById = async (id: string): Promise<Role | null> => {
  try {
    // التحقق من إذا كان الدور من الأدوار المحددة مسبقًا في النظام
    const systemRoles: Record<string, { name: string, description: string }> = {
      'super_admin': { name: 'super_admin', description: 'مدير النظام مع كامل الصلاحيات' },
      'team_manager': { name: 'team_manager', description: 'مدير فريق' },
      'sales': { name: 'sales', description: 'موظف مبيعات' },
      'customer_service': { name: 'customer_service', description: 'موظف خدمة عملاء' },
      'technical_support': { name: 'technical_support', description: 'موظف دعم فني' }
    };
    
    if (systemRoles[id]) {
      return {
        id,
        name: systemRoles[id].name,
        description: systemRoles[id].description
      };
    }
    
    // إذا لم يكن من الأدوار المحددة مسبقًا، نبحث عنه في قاعدة البيانات
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الدور:", error);
    toast.error("فشل في جلب تفاصيل الدور");
    return null;
  }
};

export const createRole = async (role: Omit<Role, 'id' | 'created_at'>): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([role])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة الدور بنجاح");
    return data;
  } catch (error: any) {
    console.error("خطأ في إضافة الدور:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الدور موجود بالفعل، يرجى اختيار اسم آخر");
    } else {
      toast.error(error.message || "فشل في إضافة الدور");
    }
    
    return null;
  }
};

export const updateRole = async (role: Partial<Role> & { id: string }): Promise<Role | null> => {
  try {
    // التحقق من إذا كان الدور من الأدوار المحددة مسبقًا في النظام
    const systemRoles = ['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'];
    
    if (systemRoles.includes(role.id)) {
      toast.error("لا يمكن تعديل أدوار النظام الأساسية");
      return null;
    }
    
    const { data, error } = await supabase
      .from('roles')
      .update({
        name: role.name,
        description: role.description
      })
      .eq('id', role.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث الدور بنجاح");
    return data;
  } catch (error: any) {
    console.error("خطأ في تحديث الدور:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الدور موجود بالفعل، يرجى اختيار اسم آخر");
    } else {
      toast.error(error.message || "فشل في تحديث الدور");
    }
    
    return null;
  }
};

export const deleteRole = async (id: string): Promise<boolean> => {
  try {
    // التحقق من إذا كان الدور من الأدوار المحددة مسبقًا في النظام
    const systemRoles = ['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'];
    
    if (systemRoles.includes(id)) {
      toast.error("لا يمكن حذف أدوار النظام الأساسية");
      return false;
    }
    
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("خطأ في حذف الدور:", error);
    throw error;
  }
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
  try {
    // أولاً نحذف كل الصلاحيات الحالية للدور
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role', roleId);
    
    if (deleteError) throw deleteError;
    
    // ثم نضيف الصلاحيات الجديدة
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role: roleId,
        permission_id: permissionId
      }));
      
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);
      
      if (insertError) throw insertError;
    }
    
    toast.success("تم تحديث صلاحيات الدور بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تحديث صلاحيات الدور:", error);
    toast.error("فشل في تحديث صلاحيات الدور");
    return false;
  }
};
