
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
