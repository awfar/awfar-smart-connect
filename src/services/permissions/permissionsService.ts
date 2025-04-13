import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionDefinition, PermissionLevel, PermissionScope } from "./permissionTypes";

const mapDbPermissionToDefinition = (permission: any): PermissionDefinition => {
  const nameParts = permission.name?.split('_') || [];
  const level = nameParts.length > 1 ? nameParts[1] as PermissionLevel : 'read-only';
  const scope = nameParts.length > 2 ? nameParts[2] as PermissionScope : 'own';
  let object = nameParts.length > 0 ? nameParts[0] : '';
  
  return {
    id: permission.id,
    name: permission.name,
    description: permission.description,
    object: object,
    level: level,
    scope: scope
  };
};

export const getSystemObjects = () => [
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
  }
];

export const getAvailableScopesForLevel = (object: string, level: PermissionLevel): PermissionScope[] => {
  const objectDefinition = getSystemObjects().find(obj => obj.name === object);
  if (!objectDefinition) return [];
  
  const permissionDefinition = objectDefinition.permissions.find(p => p.level === level);
  return permissionDefinition?.scopes || [];
};

export const fetchPermissions = async (): Promise<PermissionDefinition[]> => {
  try {
    console.log("Fetching permissions...");
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
    
    console.log("Permissions fetched:", data);
    return (data || []).map(mapDbPermissionToDefinition);
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return [];
  }
};

export const fetchPermissionById = async (permissionId: string): Promise<PermissionDefinition | null> => {
  try {
    console.log("Fetching permission by ID:", permissionId);
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', permissionId)
      .single();
    
    if (error) {
      console.error("Error fetching permission by ID:", error);
      throw error;
    }
    
    console.log("Permission fetched:", data);
    return mapDbPermissionToDefinition(data);
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الصلاحية:", error);
    toast.error("فشل في جلب تفاصيل الصلاحية");
    return null;
  }
};

export const createPermission = async (permission: Omit<PermissionDefinition, "id">): Promise<PermissionDefinition | null> => {
  try {
    console.log("Creating permission:", permission);
    
    const { data, error } = await supabase
      .from('permissions')
      .insert([{
        name: permission.name,
        description: permission.description || permission.name
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating permission:", error);
      throw error;
    }
    
    console.log("Permission created successfully:", data);
    toast.success("تم إضافة الصلاحية بنجاح");
    return mapDbPermissionToDefinition(data);
  } catch (error: any) {
    console.error("خطأ في إضافة الصلاحية:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الصلاحية موجود بالفعل");
    } else {
      toast.error("فشل في إضافة الصلاحية");
    }
    
    return null;
  }
};

export const updatePermission = async (permission: PermissionDefinition): Promise<PermissionDefinition | null> => {
  try {
    console.log("Updating permission:", permission);
    
    const { data, error } = await supabase
      .from('permissions')
      .update({
        name: permission.name,
        description: permission.description
      })
      .eq('id', permission.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating permission:", error);
      throw error;
    }
    
    console.log("Permission updated successfully:", data);
    toast.success("تم تحديث الصلاحية بنجاح");
    return mapDbPermissionToDefinition(data);
  } catch (error: any) {
    console.error("خطأ في تحديث الصلاحية:", error);
    
    if (error.code === '23505') {
      toast.error("اسم الصلاحية موجود بالفعل");
    } else {
      toast.error("فشل في تحديث الصلاحية");
    }
    
    return null;
  }
};

export const deletePermission = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting permission:", id);
    
    const { count, error: countError } = await supabase
      .from('role_permissions')
      .select('role', { count: 'exact', head: true })
      .eq('permission_id', id);
    
    if (countError) {
      console.error("Error checking role permissions:", countError);
      throw countError;
    }
    
    if (count && count > 0) {
      console.log("Cannot delete permission assigned to roles:", count);
      toast.error("لا يمكن حذف الصلاحية لأنها مرتبطة بأدوار في النظام");
      return false;
    }
    
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting permission:", error);
      throw error;
    }
    
    console.log("Permission deleted successfully");
    toast.success("تم حذف الصلاحية بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف الصلاحية:", error);
    toast.error("فشل في حذف الصلاحية");
    return false;
  }
};

export const checkUserHasPermission = async (object: string, level: PermissionLevel, scope: PermissionScope): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return false;
    
    const permissionName = `${object}_${level}_${scope}`;
    
    const { data, error } = await supabase
      .rpc('has_permission', {
        user_id: user.user.id,
        permission_name: permissionName
      });
    
    if (error) {
      console.error("Error checking permission:", error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

export const initializeSystemPermissions = async (): Promise<boolean> => {
  try {
    const { count, error: countError } = await supabase
      .from('permissions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    if (count && count > 0) {
      console.log("Permissions already initialized, count:", count);
      return true;
    }
    
    console.log("Initializing system permissions...");
    
    const systemObjects = getSystemObjects();
    const permissionsToCreate = [];
    
    for (const obj of systemObjects) {
      for (const perm of obj.permissions) {
        for (const scope of perm.scopes) {
          const permName = `${obj.name}_${perm.level}_${scope}`;
          permissionsToCreate.push({
            name: permName,
            description: `${perm.description} (${scope})`
          });
        }
      }
    }
    
    if (permissionsToCreate.length > 0) {
      const { error: insertError } = await supabase
        .from('permissions')
        .insert(permissionsToCreate);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing permissions:", error);
    return false;
  }
};
