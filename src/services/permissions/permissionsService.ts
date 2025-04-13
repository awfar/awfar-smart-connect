
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionDefinition, PermissionLevel, PermissionScope, ObjectPermission } from "./permissionTypes";

// Helper function to map database permission to PermissionDefinition
const mapDbPermissionToDefinition = (permission: any): PermissionDefinition => {
  // Extract object, level, scope from the permission name (e.g., "deals_read-only_own")
  const nameParts = permission.name?.split('_') || [];
  const level = nameParts.length > 1 ? nameParts[1] as PermissionLevel : 'read-only';
  const scope = nameParts.length > 2 ? nameParts[2] as PermissionScope : 'own';
  let object = nameParts.length > 0 ? nameParts[0] : '';
  
  // If object/level/scope are directly in the database record, use those
  if (permission.object) object = permission.object;

  return {
    id: permission.id,
    name: permission.name,
    description: permission.description,
    object: permission.object || object,
    level: permission.level || level,
    scope: permission.scope || scope
  };
};

// Define system objects and their available permissions
const systemObjects = [
  {
    name: 'contacts',
    label: 'جهات الاتصال',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض جهات الاتصال' },
      { level: 'read-edit', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض وتعديل جهات الاتصال' },
      { level: 'full-access', scopes: ['own', 'team', 'all', 'unassigned'], description: 'وصول كامل لجهات الاتصال' },
    ]
  },
  {
    name: 'companies',
    label: 'الشركات',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض الشركات' },
      { level: 'read-edit', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض وتعديل الشركات' },
      { level: 'full-access', scopes: ['own', 'team', 'all', 'unassigned'], description: 'وصول كامل للشركات' },
    ]
  },
  {
    name: 'deals',
    label: 'الصفقات',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض الصفقات' },
      { level: 'read-edit', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض وتعديل الصفقات' },
      { level: 'full-access', scopes: ['own', 'team', 'all', 'unassigned'], description: 'وصول كامل للصفقات' },
    ]
  },
  {
    name: 'tickets',
    label: 'التذاكر',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض التذاكر' },
      { level: 'read-edit', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض وتعديل التذاكر' },
      { level: 'full-access', scopes: ['own', 'team', 'all', 'unassigned'], description: 'وصول كامل للتذاكر' },
    ]
  },
  {
    name: 'tasks',
    label: 'المهام',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض المهام' },
      { level: 'read-edit', scopes: ['own', 'team', 'all', 'unassigned'], description: 'عرض وتعديل المهام' },
      { level: 'full-access', scopes: ['own', 'team', 'all', 'unassigned'], description: 'وصول كامل للمهام' },
    ]
  },
  {
    name: 'emails',
    label: 'البريد الإلكتروني',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all'], description: 'عرض رسائل البريد الإلكتروني' },
      { level: 'read-edit', scopes: ['own', 'team', 'all'], description: 'عرض وتعديل رسائل البريد الإلكتروني' },
      { level: 'full-access', scopes: ['own', 'team', 'all'], description: 'وصول كامل لرسائل البريد الإلكتروني' },
    ]
  },
  {
    name: 'meetings',
    label: 'الاجتماعات',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all'], description: 'عرض الاجتماعات' },
      { level: 'read-edit', scopes: ['own', 'team', 'all'], description: 'عرض وتعديل الاجتماعات' },
      { level: 'full-access', scopes: ['own', 'team', 'all'], description: 'وصول كامل للاجتماعات' },
    ]
  },
  {
    name: 'calls',
    label: 'المكالمات',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all'], description: 'عرض المكالمات' },
      { level: 'read-edit', scopes: ['own', 'team', 'all'], description: 'عرض وتعديل المكالمات' },
      { level: 'full-access', scopes: ['own', 'team', 'all'], description: 'وصول كامل للمكالمات' },
    ]
  },
  {
    name: 'notes',
    label: 'الملاحظات',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all'], description: 'عرض الملاحظات' },
      { level: 'read-edit', scopes: ['own', 'team', 'all'], description: 'عرض وتعديل الملاحظات' },
      { level: 'full-access', scopes: ['own', 'team', 'all'], description: 'وصول كامل للملاحظات' },
    ]
  },
  {
    name: 'invoices',
    label: 'الفواتير',
    permissions: [
      { level: 'read-only', scopes: ['own', 'team', 'all'], description: 'عرض الفواتير' },
      { level: 'read-edit', scopes: ['own', 'team', 'all'], description: 'عرض وتعديل الفواتير' },
      { level: 'full-access', scopes: ['own', 'team', 'all'], description: 'وصول كامل للفواتير' },
    ]
  },
  {
    name: 'users',
    label: 'المستخدمين',
    permissions: [
      { level: 'read-only', scopes: ['all'], description: 'عرض المستخدمين' },
      { level: 'read-edit', scopes: ['all'], description: 'عرض وتعديل المستخدمين' },
      { level: 'full-access', scopes: ['all'], description: 'وصول كامل للمستخدمين' },
    ]
  },
  {
    name: 'roles',
    label: 'الأدوار',
    permissions: [
      { level: 'read-only', scopes: ['all'], description: 'عرض الأدوار' },
      { level: 'read-edit', scopes: ['all'], description: 'عرض وتعديل الأدوار' },
      { level: 'full-access', scopes: ['all'], description: 'وصول كامل للأدوار' },
    ]
  },
  {
    name: 'products',
    label: 'المنتجات',
    permissions: [
      { level: 'read-only', scopes: ['all'], description: 'عرض المنتجات' },
      { level: 'read-edit', scopes: ['all'], description: 'عرض وتعديل المنتجات' },
      { level: 'full-access', scopes: ['all'], description: 'وصول كامل للمنتجات' },
    ]
  }
];

// Function to initialize system permissions
export const initializeSystemPermissions = async (): Promise<boolean> => {
  try {
    let permissionsToCreate = [];
    
    // Generate all system permissions
    for (const object of systemObjects) {
      for (const perm of object.permissions) {
        for (const scope of perm.scopes) {
          const permissionName = `${object.name}_${perm.level}_${scope}`;
          
          // Check if permission already exists
          const { data: existingPerm } = await supabase
            .from('permissions')
            .select('name')
            .eq('name', permissionName)
            .single();
            
          if (!existingPerm) {
            permissionsToCreate.push({
              name: permissionName,
              description: `${perm.description} (${scope === 'own' ? 'سجلاته' : scope === 'team' ? 'سجلات فريقه' : scope === 'unassigned' ? 'سجلات غير مسندة' : 'جميع السجلات'})`,
              object: object.name,
              level: perm.level,
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
        object: permission.object,
        level: permission.level,
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

export const fetchPermissionsByObject = async (): Promise<Record<string, PermissionDefinition[]>> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    const permissions = (data || []).map(mapDbPermissionToDefinition);
    const groupedPermissions: Record<string, PermissionDefinition[]> = {};
    
    permissions.forEach(permission => {
      if (!permission.object) return;
      
      if (!groupedPermissions[permission.object]) {
        groupedPermissions[permission.object] = [];
      }
      
      groupedPermissions[permission.object].push(permission);
    });
    
    return groupedPermissions;
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات حسب الوحدة:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return {};
  }
};

// Check if a user has a specific permission
export const checkUserHasPermission = async (object: string, level: PermissionLevel, scope?: PermissionScope): Promise<boolean> => {
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
    const permissionName = `${object}_${level}_${scope || 'own'}`;
    
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

// Get all objects with their display names
export const getSystemObjects = () => {
  return systemObjects.map(object => ({
    name: object.name,
    label: object.label
  }));
};
