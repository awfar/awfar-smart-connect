
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// التحقق من حالة المستخدم الحالي
export const checkCurrentUserStatus = async (): Promise<{
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  currentUserId: string | null;
  email: string | null;
  role: string | null;
  permissions: string[];
  error?: string;
}> => {
  try {
    // التحقق من حالة المصادقة
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error("خطأ في التحقق من جلسة المستخدم:", authError);
      return {
        isAuthenticated: false,
        isSuperAdmin: false,
        currentUserId: null,
        email: null,
        role: null,
        permissions: [],
        error: `خطأ في المصادقة: ${authError.message}`
      };
    }
    
    const isAuthenticated = !!authData.session;
    
    if (!isAuthenticated) {
      return {
        isAuthenticated: false,
        isSuperAdmin: false,
        currentUserId: null,
        email: null,
        role: null,
        permissions: [],
        error: "المستخدم غير مسجل الدخول"
      };
    }
    
    const currentUserId = authData.session?.user?.id || null;
    const email = authData.session?.user?.email || null;
    
    // الحصول على معلومات الملف الشخصي للمستخدم
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUserId)
      .single();
      
    if (profileError) {
      console.error("خطأ في جلب معلومات الملف الشخصي:", profileError);
      return {
        isAuthenticated: true,
        isSuperAdmin: false,
        currentUserId,
        email,
        role: null,
        permissions: [],
        error: `خطأ في جلب الملف الشخصي: ${profileError.message}`
      };
    }
    
    const role = profileData?.role || null;
    const isSuperAdmin = role === 'super_admin';
    
    // الحصول على صلاحيات المستخدم
    let permissions: string[] = [];
    
    try {
      // استخدام دالة قاعدة البيانات للتحقق ما إذا كان المستخدم سوبر ادمن
      const { data: isSuperAdminCheck, error: superAdminError } = await supabase
        .rpc('is_super_admin', { user_id: currentUserId });
        
      if (superAdminError) throw superAdminError;
      
      // الحصول على صلاحيات المستخدم بناءً على دوره
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permissions (name)
        `)
        .eq('role', role);
      
      if (permissionsError) throw permissionsError;
      
      permissions = permissionsData?.map(item => item.permissions?.name).filter(Boolean) || [];
      
      if (isSuperAdminCheck) {
        // إذا كان المستخدم سوبر ادمن، نضيف صلاحية خاصة
        permissions.push('admin.access');
      }
    } catch (permError) {
      console.error("خطأ في جلب صلاحيات المستخدم:", permError);
    }
    
    return {
      isAuthenticated,
      isSuperAdmin,
      currentUserId,
      email,
      role,
      permissions,
      error: undefined
    };
    
  } catch (error) {
    console.error("خطأ في التحقق من حالة المستخدم:", error);
    return {
      isAuthenticated: false,
      isSuperAdmin: false,
      currentUserId: null,
      email: null,
      role: null,
      permissions: [],
      error: `خطأ في التحقق: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    };
  }
};

// إضافة دور سوبر ادمن للمستخدم الحالي
export const grantSuperAdminToUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'super_admin' })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success("تم منح صلاحيات السوبر ادمن بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في منح صلاحيات السوبر ادمن:", error);
    toast.error("فشل في منح صلاحيات السوبر ادمن");
    return false;
  }
};
