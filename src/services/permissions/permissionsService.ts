
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionDefinition, PermissionAction, PermissionScope, ModulePermission } from "./permissionTypes";

// Helper function to map database permission to PermissionDefinition
const mapDbPermissionToDefinition = (permission: any): PermissionDefinition => {
  // Extract module, action, scope from the permission name (e.g., "leads_read_own")
  const nameParts = permission.name?.split('_') || [];
  const action = nameParts.length > 1 ? nameParts[1] as PermissionAction : 'read';
  const scope = nameParts.length > 2 ? nameParts[2] as PermissionScope : 'own';
  let module = nameParts.length > 0 ? nameParts[0] : '';
  
  // If module/action/scope are directly in the database record, use those
  if (permission.module) module = permission.module;

  return {
    id: permission.id,
    name: permission.name,
    description: permission.description,
    module: module,
    action: permission.action || action,
    scope: permission.scope || scope
  };
};

// Define system modules and their available permissions
const systemModules = [
  {
    name: 'leads',
    label: 'إدارة العملاء المحتملين',
    permissions: [
      { action: 'create', scopes: ['own', 'team', 'all'], description: 'إضافة عميل محتمل' },
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض العملاء المحتملين' },
      { action: 'update', scopes: ['own', 'team', 'all'], description: 'تعديل بيانات العميل المحتمل' },
      { action: 'delete', scopes: ['own', 'team', 'all'], description: 'حذف عميل محتمل' },
    ]
  },
  {
    name: 'deals',
    label: 'إدارة الصفقات',
    permissions: [
      { action: 'create', scopes: ['own', 'team', 'all'], description: 'إضافة صفقة' },
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض الصفقات' },
      { action: 'update', scopes: ['own', 'team', 'all'], description: 'تعديل بيانات الصفقة' },
      { action: 'delete', scopes: ['own', 'team', 'all'], description: 'حذف صفقة' },
    ]
  },
  {
    name: 'companies',
    label: 'إدارة الشركات',
    permissions: [
      { action: 'create', scopes: ['own', 'team', 'all'], description: 'إضافة شركة' },
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض الشركات' },
      { action: 'update', scopes: ['own', 'team', 'all'], description: 'تعديل بيانات الشركة' },
      { action: 'delete', scopes: ['own', 'team', 'all'], description: 'حذف شركة' },
    ]
  },
  {
    name: 'tasks',
    label: 'إدارة المهام',
    permissions: [
      { action: 'create', scopes: ['own', 'team', 'all'], description: 'إضافة مهمة' },
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض المهام' },
      { action: 'update', scopes: ['own', 'team', 'all'], description: 'تعديل بيانات المهمة' },
      { action: 'delete', scopes: ['own', 'team', 'all'], description: 'حذف مهمة' },
    ]
  },
  {
    name: 'users',
    label: 'إدارة المستخدمين',
    permissions: [
      { action: 'create', scopes: ['all'], description: 'إضافة مستخدم' },
      { action: 'read', scopes: ['all'], description: 'عرض المستخدمين' },
      { action: 'update', scopes: ['all'], description: 'تعديل بيانات المستخدم' },
      { action: 'delete', scopes: ['all'], description: 'حذف مستخدم' },
    ]
  },
  {
    name: 'roles',
    label: 'إدارة الأدوار',
    permissions: [
      { action: 'create', scopes: ['all'], description: 'إضافة دور' },
      { action: 'read', scopes: ['all'], description: 'عرض الأدوار' },
      { action: 'update', scopes: ['all'], description: 'تعديل بيانات الدور' },
      { action: 'delete', scopes: ['all'], description: 'حذف دور' },
    ]
  },
  {
    name: 'reports',
    label: 'التقارير',
    permissions: [
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض التقارير' },
    ]
  },
  {
    name: 'settings',
    label: 'الإعدادات',
    permissions: [
      { action: 'read', scopes: ['all'], description: 'عرض الإعدادات' },
      { action: 'update', scopes: ['all'], description: 'تعديل الإعدادات' },
    ]
  },
  {
    name: 'invoices',
    label: 'الفواتير',
    permissions: [
      { action: 'create', scopes: ['own', 'team', 'all'], description: 'إنشاء فاتورة' },
      { action: 'read', scopes: ['own', 'team', 'all'], description: 'عرض الفواتير' },
      { action: 'update', scopes: ['own', 'team', 'all'], description: 'تعديل الفاتورة' },
      { action: 'delete', scopes: ['own', 'team', 'all'], description: 'حذف فاتورة' },
    ]
  },
  {
    name: 'products',
    label: 'المنتجات',
    permissions: [
      { action: 'create', scopes: ['all'], description: 'إضافة منتج' },
      { action: 'read', scopes: ['all'], description: 'عرض المنتجات' },
      { action: 'update', scopes: ['all'], description: 'تعديل بيانات المنتج' },
      { action: 'delete', scopes: ['all'], description: 'حذف منتج' },
    ]
  }
];

// Function to initialize system permissions
export const initializeSystemPermissions = async (): Promise<boolean> => {
  try {
    let permissionsToCreate = [];
    
    // Generate all system permissions
    for (const module of systemModules) {
      for (const perm of module.permissions) {
        for (const scope of perm.scopes) {
          const permissionName = `${module.name}_${perm.action}_${scope}`;
          
          // Check if permission already exists
          const { data: existingPerm } = await supabase
            .from('permissions')
            .select('name')
            .eq('name', permissionName)
            .single();
            
          if (!existingPerm) {
            permissionsToCreate.push({
              name: permissionName,
              description: `${perm.description} (${scope === 'own' ? 'خاص بالمستخدم' : scope === 'team' ? 'خاص بالفريق' : 'جميع البيانات'})`,
              module: module.name,
              action: perm.action,
              scope: scope
            });
          }
        }
      }
    }
    
    // Insert permissions in batches if needed
    if (permissionsToCreate.length > 0) {
      const { error } = await supabase
        .from('permissions')
        .insert(permissionsToCreate);
      
      if (error) throw error;
      
      console.log(`تم إضافة ${permissionsToCreate.length} صلاحية جديدة`);
    }
    
    return true;
  } catch (error) {
    console.error("خطأ في تهيئة صلاحيات النظام:", error);
    toast.error("فشل في تهيئة صلاحيات النظام");
    return false;
  }
};

export const fetchPermissions = async (): Promise<PermissionDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(mapDbPermissionToDefinition);
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return [];
  }
};

export const fetchPermissionById = async (id: string): Promise<PermissionDefinition | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? mapDbPermissionToDefinition(data) : null;
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الصلاحية:", error);
    toast.error("فشل في جلب تفاصيل الصلاحية");
    return null;
  }
};

export const createPermission = async (permission: Omit<PermissionDefinition, 'id'>): Promise<PermissionDefinition | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .insert([permission])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم إضافة الصلاحية بنجاح");
    return data ? mapDbPermissionToDefinition(data) : null;
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

export const updatePermission = async (permission: Partial<PermissionDefinition> & { id: string }): Promise<PermissionDefinition | null> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .update({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        action: permission.action,
        scope: permission.scope
      })
      .eq('id', permission.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("تم تحديث الصلاحية بنجاح");
    return data ? mapDbPermissionToDefinition(data) : null;
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

export const fetchPermissionsByModule = async (): Promise<Record<string, PermissionDefinition[]>> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    const permissions = (data || []).map(mapDbPermissionToDefinition);
    const groupedPermissions: Record<string, PermissionDefinition[]> = {};
    
    permissions.forEach(permission => {
      if (!permission.module) return;
      
      if (!groupedPermissions[permission.module]) {
        groupedPermissions[permission.module] = [];
      }
      
      groupedPermissions[permission.module].push(permission);
    });
    
    return groupedPermissions;
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات حسب الوحدة:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return {};
  }
};

export const checkUserHasPermission = async (module: string, action: PermissionAction, scope?: PermissionScope): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Get the user's role
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfile?.role) return false;
    
    // Check if the user's role has the specified permission
    const permissionName = `${module}_${action}_${scope || 'own'}`;
    
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions!inner (name)
      `)
      .eq('role', userProfile.role)
      .filter('permissions.name', 'eq', permissionName)
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("خطأ في التحقق من الصلاحية:", error);
    return false;
  }
};

// Get all modules with their display names
export const getSystemModules = () => {
  return systemModules.map(module => ({
    name: module.name,
    label: module.label
  }));
};
