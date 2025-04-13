
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// اضافة الصلاحيات الافتراضية للنظام
const defaultPermissions = [
  // صلاحيات العملاء المحتملين
  { name: 'view_leads', description: 'عرض العملاء المحتملين' },
  { name: 'create_leads', description: 'إضافة عملاء محتملين جدد' },
  { name: 'update_leads', description: 'تعديل العملاء المحتملين' },
  { name: 'delete_leads', description: 'حذف العملاء المحتملين' },
  { name: 'assign_leads', description: 'إسناد العملاء المحتملين لمستخدمين آخرين' },

  // صلاحيات الصفقات
  { name: 'view_deals', description: 'عرض الصفقات' },
  { name: 'create_deals', description: 'إضافة صفقات جديدة' },
  { name: 'update_deals', description: 'تعديل الصفقات' },
  { name: 'delete_deals', description: 'حذف الصفقات' },

  // صلاحيات الشركات
  { name: 'view_companies', description: 'عرض الشركات' },
  { name: 'create_companies', description: 'إضافة شركات جديدة' },
  { name: 'update_companies', description: 'تعديل الشركات' },
  { name: 'delete_companies', description: 'حذف الشركات' },

  // صلاحيات المواعيد
  { name: 'view_appointments', description: 'عرض المواعيد' },
  { name: 'create_appointments', description: 'إضافة مواعيد جديدة' },
  { name: 'update_appointments', description: 'تعديل المواعيد' },
  { name: 'delete_appointments', description: 'حذف المواعيد' },

  // صلاحيات المهام
  { name: 'view_tasks', description: 'عرض المهام' },
  { name: 'create_tasks', description: 'إضافة مهام جديدة' },
  { name: 'update_tasks', description: 'تعديل المهام' },
  { name: 'delete_tasks', description: 'حذف المهام' },
  { name: 'assign_tasks', description: 'إسناد المهام لمستخدمين آخرين' },

  // صلاحيات التذاكر
  { name: 'view_tickets', description: 'عرض التذاكر' },
  { name: 'create_tickets', description: 'إضافة تذاكر جديدة' },
  { name: 'update_tickets', description: 'تعديل التذاكر' },
  { name: 'delete_tickets', description: 'حذف التذاكر' },
  { name: 'assign_tickets', description: 'إسناد التذاكر لمستخدمين آخرين' },

  // صلاحيات التقارير
  { name: 'view_reports', description: 'عرض التقارير' },
  { name: 'create_reports', description: 'إنشاء تقارير مخصصة' },

  // صلاحيات المستخدمين
  { name: 'view_users', description: 'عرض المستخدمين' },
  { name: 'create_users', description: 'إضافة مستخدمين جدد' },
  { name: 'update_users', description: 'تعديل المستخدمين' },
  { name: 'delete_users', description: 'حذف المستخدمين' },
  { name: 'assign_roles', description: 'إسناد الأدوار للمستخدمين' },

  // صلاحيات الأدوار والصلاحيات
  { name: 'view_roles', description: 'عرض الأدوار' },
  { name: 'create_roles', description: 'إضافة أدوار جديدة' },
  { name: 'update_roles', description: 'تعديل الأدوار' },
  { name: 'delete_roles', description: 'حذف الأدوار' },
  { name: 'manage_permissions', description: 'إدارة صلاحيات الأدوار' },

  // صلاحيات الأقسام والفرق
  { name: 'view_departments', description: 'عرض الأقسام' },
  { name: 'manage_departments', description: 'إدارة الأقسام' },
  { name: 'view_teams', description: 'عرض الفرق' },
  { name: 'manage_teams', description: 'إدارة الفرق' },

  // صلاحيات الكتالوج
  { name: 'view_products', description: 'عرض المنتجات' },
  { name: 'manage_products', description: 'إدارة المنتجات' },
  { name: 'manage_packages', description: 'إدارة الباقات' },
  { name: 'manage_subscriptions', description: 'إدارة الاشتراكات' },

  // صلاحيات الفواتير
  { name: 'view_invoices', description: 'عرض الفواتير' },
  { name: 'create_invoices', description: 'إنشاء فواتير جديدة' },
  { name: 'update_invoices', description: 'تعديل الفواتير' },
  { name: 'delete_invoices', description: 'حذف الفواتير' },

  // صلاحيات النظام
  { name: 'admin.access', description: 'الوصول الكامل كمدير النظام' },
  { name: 'manage_settings', description: 'إدارة إعدادات النظام' },
  { name: 'manage_forms', description: 'إدارة نماذج النظام' },
  { name: 'manage_properties', description: 'إدارة خصائص النظام' },
  { name: 'manage_cms', description: 'إدارة نظام إدارة المحتوى' },
];

// جلب صلاحيات المستخدم الحالي
export const fetchUserPermissions = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions (name)
      `)
      .eq('role', await getUserRole(user.id));
    
    if (error) throw error;
    
    return Array.isArray(data) 
      ? data.map(item => item.permissions?.name).filter(Boolean)
      : [];
  } catch (error) {
    console.error("خطأ في جلب صلاحيات المستخدم:", error);
    toast.error("فشل في جلب صلاحيات المستخدم");
    return [];
  }
};

// جلب كافة الصلاحيات المتاحة في النظام (بما في ذلك الصلاحيات الافتراضية)
export const fetchAllAvailablePermissions = async () => {
  try {
    // جلب الصلاحيات المخزنة في قاعدة البيانات
    const { data: dbPermissions, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // إذا لم يكن هناك صلاحيات في قاعدة البيانات، نقوم بإضافة الصلاحيات الافتراضية
    if (!dbPermissions || dbPermissions.length === 0) {
      await addDefaultPermissions();
      // جلب الصلاحيات مرة أخرى بعد إضافتها
      const { data: freshPermissions, error: freshError } = await supabase
        .from('permissions')
        .select('*')
        .order('name');
      
      if (freshError) throw freshError;
      return freshPermissions || [];
    }
    
    // التحقق مما إذا كانت جميع الصلاحيات الافتراضية موجودة بالفعل في قاعدة البيانات
    const existingPermissionNames = dbPermissions.map(p => p.name);
    const missingPermissions = defaultPermissions.filter(p => !existingPermissionNames.includes(p.name));
    
    // إضافة الصلاحيات الافتراضية المفقودة إلى قاعدة البيانات
    if (missingPermissions.length > 0) {
      await supabase.from('permissions').insert(missingPermissions);
      // إعادة جلب الصلاحيات بعد إضافة الجديدة
      const { data: updatedPermissions, error: updatedError } = await supabase
        .from('permissions')
        .select('*')
        .order('name');
      
      if (updatedError) throw updatedError;
      return updatedPermissions || [];
    }
    
    return dbPermissions;
  } catch (error) {
    console.error("خطأ في جلب كافة الصلاحيات المتاحة:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return [];
  }
};

// إضافة الصلاحيات الافتراضية إلى قاعدة البيانات
const addDefaultPermissions = async (): Promise<void> => {
  try {
    await supabase.from('permissions').insert(defaultPermissions);
  } catch (error) {
    console.error("خطأ في إضافة الصلاحيات الافتراضية:", error);
  }
};

// الحصول على دور المستخدم
export const getUserRole = async (userId: string): Promise<string> => {
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
