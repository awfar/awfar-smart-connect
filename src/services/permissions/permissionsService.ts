
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionDefinition, PermissionLevel, PermissionScope, ObjectPermission, SystemObject } from "./permissionTypes";

// This function will be used by usePermissions hook
export const checkUserHasPermission = async (
  object: string, 
  level: PermissionLevel, 
  scope: PermissionScope = 'own'
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Get user role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile) return false;
    
    // Check if role has the required permission
    const { data: rolePermission } = await supabase
      .from('role_permissions')
      .select(`
        permissions (id, name, object, level, scope)
      `)
      .eq('role', profile.role)
      .eq('permissions.object', object)
      .eq('permissions.level', level)
      .eq('permissions.scope', scope)
      .single();
    
    return !!rolePermission;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

// Initialize system permissions if they don't exist
export const initializeSystemPermissions = async (): Promise<void> => {
  try {
    // Check if permissions already exist
    const { count } = await supabase
      .from('permissions')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log("Permissions already initialized");
      return;
    }
    
    // Get all system objects
    const systemObjects = getSystemObjects();
    const permissionsToCreate: Omit<PermissionDefinition, 'id'>[] = [];
    
    // Create permissions for each object, level, and scope
    systemObjects.forEach(obj => {
      obj.permissions.forEach(perm => {
        perm.scopes.forEach(scope => {
          permissionsToCreate.push({
            name: `${obj.name}_${perm.level}_${scope}`,
            description: `${getPermissionDescription(obj.label, perm.level, scope)}`,
            object: obj.name,
            level: perm.level,
            scope: scope
          });
        });
      });
    });
    
    // Insert permissions in batches to avoid request size limits
    const batchSize = 50;
    for (let i = 0; i < permissionsToCreate.length; i += batchSize) {
      const batch = permissionsToCreate.slice(i, i + batchSize);
      const { error } = await supabase.from('permissions').insert(batch);
      if (error) throw error;
    }
    
    console.log(`Initialized ${permissionsToCreate.length} system permissions`);
  } catch (error) {
    console.error("Error initializing permissions:", error);
    toast.error("فشل في تهيئة صلاحيات النظام");
  }
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
    return data;
  } catch (error) {
    console.error("خطأ في جلب الصلاحيات:", error);
    toast.error("فشل في جلب قائمة الصلاحيات");
    return [];
  }
};

export const fetchPermissionById = async (id: string): Promise<PermissionDefinition | null> => {
  try {
    console.log("Fetching permission by ID:", id);
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching permission:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الصلاحية:", error);
    toast.error("فشل في جلب تفاصيل الصلاحية");
    return null;
  }
};

export const createPermission = async (permission: Omit<PermissionDefinition, 'id'>): Promise<PermissionDefinition | null> => {
  try {
    console.log("Creating permission:", permission);
    const { data, error } = await supabase
      .from('permissions')
      .insert([permission])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating permission:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("خطأ في إضافة الصلاحية:", error);
    toast.error("فشل في إضافة الصلاحية");
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
        description: permission.description,
        object: permission.object,
        level: permission.level,
        scope: permission.scope
      })
      .eq('id', permission.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating permission:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("خطأ في تحديث الصلاحية:", error);
    toast.error("فشل في تحديث الصلاحية");
    return null;
  }
};

export const deletePermission = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting permission:", id);
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting permission:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("خطأ في حذف الصلاحية:", error);
    toast.error("فشل في حذف الصلاحية");
    return false;
  }
};

export const getSystemObjects = (): SystemObject[] => {
  return [
    {
      name: 'leads',
      label: 'العملاء المحتملين',
      permissions: [
        {
          level: 'read-only',
          scopes: ['own', 'team', 'all', 'unassigned'] as PermissionScope[]
        },
        {
          level: 'read-edit',
          scopes: ['own', 'team', 'all', 'unassigned'] as PermissionScope[]
        },
        {
          level: 'full-access',
          scopes: ['own', 'team', 'all'] as PermissionScope[]
        }
      ]
    },
    {
      name: 'deals',
      label: 'الصفقات',
      permissions: [
        {
          level: 'read-only',
          scopes: ['own', 'team', 'all'] as PermissionScope[]
        },
        {
          level: 'read-edit',
          scopes: ['own', 'team', 'all'] as PermissionScope[]
        },
        {
          level: 'full-access',
          scopes: ['own', 'team', 'all'] as PermissionScope[]
        }
      ]
    },
    {
      name: 'tickets',
      label: 'التذاكر',
      permissions: [
        {
          level: 'read-only',
          scopes: ['own', 'team', 'all', 'unassigned'] as PermissionScope[]
        },
        {
          level: 'read-edit',
          scopes: ['own', 'team', 'all', 'unassigned'] as PermissionScope[]
        },
        {
          level: 'full-access',
          scopes: ['own', 'team', 'all'] as PermissionScope[]
        }
      ]
    },
    {
      name: 'users',
      label: 'المستخدمين',
      permissions: [
        {
          level: 'read-only',
          scopes: ['team', 'all'] as PermissionScope[]
        },
        {
          level: 'read-edit',
          scopes: ['team', 'all'] as PermissionScope[]
        },
        {
          level: 'full-access',
          scopes: ['all'] as PermissionScope[]
        }
      ]
    },
  ];
};

const getPermissionDescription = (objectLabel: string, level: PermissionLevel, scope: PermissionScope): string => {
  let levelDesc = '';
  let scopeDesc = '';
  
  switch (level) {
    case 'read-only':
      levelDesc = 'عرض';
      break;
    case 'read-edit':
      levelDesc = 'عرض وتعديل';
      break;
    case 'full-access':
      levelDesc = 'تحكم كامل في';
      break;
  }
  
  switch (scope) {
    case 'own':
      scopeDesc = 'الخاصة بالمستخدم';
      break;
    case 'team':
      scopeDesc = 'الخاصة بفريق المستخدم';
      break;
    case 'all':
      scopeDesc = 'جميع';
      break;
    case 'unassigned':
      scopeDesc = 'غير المسندة';
      break;
  }
  
  return `${levelDesc} ${scopeDesc} ${objectLabel}`;
};
