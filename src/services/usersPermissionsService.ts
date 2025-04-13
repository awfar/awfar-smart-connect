import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivityAnalytic {
  name: string;
  count: number;
}

// جلب صلاحيات المستخدم الحالي
export const fetchUserPermissions = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Usamos una consulta directa en lugar de una función RPC que no está tipada
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', await getUserRole(user.id));
    
    if (error) throw error;
    
    // Verificamos si data es un array antes de usar map
    return Array.isArray(data) 
      ? data.map(item => item.permissions?.name).filter(Boolean)
      : [];
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};

// Función auxiliar para obtener el rol del usuario
const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.role || '';
  } catch (error) {
    console.error("Error getting user role:", error);
    return '';
  }
};

// استدعاء دالة قاعدة البيانات لجلب تحليلات النشاط
export const fetchActivityAnalytics = async (type: 'action' | 'user' | 'entity'): Promise<ActivityAnalytic[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    switch (type) {
      case 'action': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('action, count')
          .order('count', { ascending: false });
        
        if (error) throw error;
        
        return data.map(item => ({
          name: item.action || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
      
      case 'user': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('user_id, count')
          .order('count', { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => ({
          name: item.user_id || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
        
      case 'entity': {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('entity_type, count')
          .order('count', { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => ({
          name: item.entity_type || 'غير معروف',
          count: typeof item.count === 'string' 
            ? parseInt(item.count, 10) 
            : Number(item.count)
        }));
      }
        
      default:
        return [];
    }
  } catch (error) {
    console.error(`خطأ في جلب تحليلات النشاط (${type}):`, error);
    toast.error("فشل في جلب تحليلات النشاط");
    return [];
  }
};

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

// تعيين دور للمستخدم
export const assignRoleToUser = async (userId: string, roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: roleId })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("تم تعيين الدور للمستخدم بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تعيين الدور للمستخدم:", error);
    toast.error("فشل في تعيين الدور للمستخدم");
    return false;
  }
};

// تعيين مستخدم لفريق
export const assignUserToTeam = async (userId: string, teamId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ team_id: teamId })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("تم تعيين المستخدم للفريق بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تعيين المستخدم للفريق:", error);
    toast.error("فشل في تعيين المستخدم للفريق");
    return false;
  }
};

// تغيير حالة المستخدم (نشط/معلق)
export const changeUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);
    
    if (error) throw error;
    
    const statusText = isActive ? 'تنشيط' : 'تعليق';
    toast.success(`تم ${statusText} المستخدم بنجاح`);
    return true;
  } catch (error) {
    console.error("خطأ في تغيير حالة المستخدم:", error);
    toast.error("فشل في تغيير حالة المستخدم");
    return false;
  }
};
