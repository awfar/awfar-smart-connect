
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionDefinition } from "./permissions/permissionTypes";

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  permissions?: PermissionDefinition[];
}

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    console.log("Fetching roles...");
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
    
    console.log("Roles fetched:", data);
    
    // Define the system roles
    const systemRoles = [
      { name: 'super_admin', description: 'مدير النظام مع كامل الصلاحيات' },
      { name: 'team_manager', description: 'مدير فريق' },
      { name: 'sales', description: 'موظف مبيعات' },
      { name: 'customer_service', description: 'موظف خدمة عملاء' },
      { name: 'technical_support', description: 'موظف دعم فني' }
    ];
    
    const existingRoleNames = data?.map(role => role.name) || [];
    
    const allRoles = [...(data || [])];
    
    // Add system roles that don't exist in the database
    systemRoles.forEach(role => {
      if (!existingRoleNames.includes(role.name)) {
        allRoles.push({
          id: role.name,
          name: role.name,
          description: role.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
    console.log("Fetching role by ID:", id);
    // Check if it's a system role
    const systemRoles: Record<string, { name: string, description: string }> = {
      'super_admin': { name: 'super_admin', description: 'مدير النظام مع كامل الصلاحيات' },
      'team_manager': { name: 'team_manager', description: 'مدير فريق' },
      'sales': { name: 'sales', description: 'موظف مبيعات' },
      'customer_service': { name: 'customer_service', description: 'موظف خدمة عملاء' },
      'technical_support': { name: 'technical_support', description: 'موظف دعم فني' }
    };
    
    if (systemRoles[id]) {
      const roleData: Role = {
        id,
        name: systemRoles[id].name,
        description: systemRoles[id].description
      };
      
      // For system roles, we need to fetch permissions separately
      try {
        const { data: rolePermissions, error: permError } = await supabase
          .from('role_permissions')
          .select(`
            permission_id,
            permissions (*)
          `)
          .eq('role', id);
        
        if (!permError && rolePermissions && rolePermissions.length > 0) {
          const permissions = rolePermissions.map((rp: any) => rp.permissions);
          roleData.permissions = permissions;
        }
      } catch (permError) {
        console.error("Error fetching role permissions:", permError);
      }
      
      return roleData;
    }
    
    // If not a system role, look up in the database
    try {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          role_permissions!inner (
            permission_id,
            permissions (*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No role permissions found, fetch just the role
          const { data: roleOnly, error: roleError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();
            
          if (roleError) throw roleError;
          return roleOnly;
        }
        throw error;
      }
      
      if (data && data.role_permissions) {
        // Check if data.role_permissions is an error object
        if (typeof data.role_permissions === 'object' && !Array.isArray(data.role_permissions) && 'code' in data.role_permissions) {
          // This is an error object, not an array
          console.error("Error in role permissions join:", data.role_permissions);
          
          // Return just the role data without permissions
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        }
        
        // This is a valid array of permissions
        if (Array.isArray(data.role_permissions)) {
          const permissions = data.role_permissions.map((rp: any) => rp.permissions);
          return {
            ...data,
            permissions
          };
        } else {
          console.error("Unexpected role_permissions structure:", data.role_permissions);
          return data;
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      
      // Fallback to simple query if the join fails
      const { data: simpleData, error: simpleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (simpleError) throw simpleError;
      return simpleData;
    }
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الدور:", error);
    toast.error("فشل في جلب تفاصيل الدور");
    return null;
  }
};

export const createRole = async (role: Omit<Role, 'id' | 'created_at'>): Promise<Role | null> => {
  try {
    console.log("Creating role:", role);
    
    const { data, error } = await supabase
      .from('roles')
      .insert([role])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating role:", error);
      throw error;
    }
    
    console.log("Role created successfully:", data);
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
    console.log("Updating role:", role);
    // Check if it's a system role
    const systemRoles = ['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'];
    
    if (systemRoles.includes(role.id)) {
      console.log("Cannot update system role:", role.id);
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
    
    if (error) {
      console.error("Error updating role:", error);
      throw error;
    }
    
    console.log("Role updated successfully:", data);
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
    console.log("Attempting to delete role:", id);
    // Check if it's a system role
    const systemRoles = ['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'];
    
    if (systemRoles.includes(id)) {
      console.log("Cannot delete system role:", id);
      toast.error("لا يمكن حذف أدوار النظام الأساسية");
      return false;
    }
    
    // Check if any users have this role
    const { count: userCount, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', id);
      
    if (countError) {
      console.error("Error checking users with role:", countError);
      throw countError;
    }
    
    if (userCount && userCount > 0) {
      console.log("Cannot delete role used by users:", userCount);
      toast.error("لا يمكن حذف الدور لأنه مستخدم من قبل مستخدمين");
      return false;
    }
    
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
    
    console.log("Role deleted successfully");
    toast.success("تم حذف الدور بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في حذف الدور:", error);
    toast.error("فشل في حذف الدور");
    return false;
  }
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
  try {
    console.log("Updating role permissions for role:", roleId);
    console.log("New permissions:", permissionIds);
    
    // Delete all current role permissions
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role', roleId);
    
    if (deleteError) {
      console.error("Error deleting existing role permissions:", deleteError);
      throw deleteError;
    }
    
    // Add new role permissions
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role: roleId,
        permission_id: permissionId
      }));
      
      console.log("Inserting role permissions:", rolePermissions);
      
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);
      
      if (insertError) {
        console.error("Error inserting role permissions:", insertError);
        throw insertError;
      }
    }
    
    console.log("Role permissions updated successfully");
    toast.success("تم تحديث صلاحيات الدور بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ في تحديث صلاحيات الدور:", error);
    toast.error("فشل في تحديث صلاحيات الدور");
    return false;
  }
};

export const getRolePermissions = async (roleId: string): Promise<PermissionDefinition[]> => {
  try {
    console.log("Fetching permissions for role:", roleId);
    
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permissions (*)
      `)
      .eq('role', roleId);
    
    if (error) {
      console.error("Error fetching role permissions:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const permissions = data.map((rp: any) => rp.permissions);
    console.log("Role permissions fetched:", permissions);
    
    return permissions;
  } catch (error) {
    console.error("خطأ في جلب صلاحيات الدور:", error);
    toast.error("فشل في جلب صلاحيات الدور");
    return [];
  }
};
