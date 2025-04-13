
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
    
    const { data, error } = await supabase.rpc('has_permission', { 
      user_id: user.id, 
      permission_name: 'admin.access' 
    });
    
    if (error) throw error;
    
    // ملاحظة: في نظام حقيقي، يجب أن نقوم بجلب قائمة كاملة من الصلاحيات
    // هنا نقوم بإرجاع نتيجة التحقق فقط كمثال بسيط
    return data ? ['admin.access'] : [];
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};

// استدعاء دالة قاعدة البيانات لجلب تحليلات النشاط
export const fetchActivityAnalytics = async (type: 'action' | 'user' | 'entity'): Promise<ActivityAnalytic[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    let functionName = '';
    switch (type) {
      case 'action':
        functionName = 'count_activities_by_action';
        break;
      case 'user':
        functionName = 'count_activities_by_user';
        break;
      case 'entity':
        functionName = 'count_activities_by_entity_type';
        break;
      default:
        functionName = 'count_activities_by_action';
    }
    
    const { data, error } = await supabase.rpc(functionName);
    
    if (error) throw error;
    
    // تنسيق البيانات لعرضها في المخطط البياني
    return data.map((item: any) => ({
      name: item.action || item.user_id || item.entity_type || 'غير معروف',
      count: item.count
    }));
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
        { role_id: roleId, permission_id: permissionId }
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
      .update({ role_id: roleId })
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
export const changeUserStatus = async (userId: string, status: 'active' | 'suspended'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);
    
    if (error) throw error;
    
    const statusText = status === 'active' ? 'تنشيط' : 'تعليق';
    toast.success(`تم ${statusText} المستخدم بنجاح`);
    return true;
  } catch (error) {
    console.error("خطأ في تغيير حالة المستخدم:", error);
    toast.error("فشل في تغيير حالة المستخدم");
    return false;
  }
};
