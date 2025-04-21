
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Model for user status information
export interface UserStatus {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Checks the current user's status from the database
 */
export const checkUserStatus = async (userId: string): Promise<UserStatus | null> => {
  try {
    const { data: userData, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        role (
          name
        ),
        status,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user status:", error);
      return null;
    }

    if (!userData) {
      console.log("User not found:", userId);
      return null;
    }

    // Extract role name safely
    let roleName = 'user'; // default role
    if (userData.role) {
      if (typeof userData.role === 'string') {
        roleName = userData.role;
      } else if (userData.role && typeof userData.role === 'object') {
        // Handle both array and object formats safely
        if (Array.isArray(userData.role) && userData.role[0]?.name) {
          roleName = userData.role[0].name;
        } else if (userData.role.name) {
          roleName = userData.role.name;
        }
      }
    }

    const transformedData: UserStatus = {
      userId: userData.id,
      email: userData.email || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      roleName: roleName,
      status: userData.status || 'inactive',
      createdAt: userData.created_at || '',
      updatedAt: userData.updated_at || '',
    };

    return transformedData;
  } catch (error) {
    console.error("Unexpected error checking user status:", error);
    return null;
  }
};

/**
 * Function to check the current authenticated user's status
 * Useful for UI components that need to know about the current user
 */
export const checkCurrentUserStatus = async (): Promise<UserStatus | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    return checkUserStatus(user.id);
  } catch (error) {
    console.error("Error checking current user status:", error);
    return null;
  }
};

/**
 * Grants super_admin role to a user (for development purposes)
 */
export const grantSuperAdminToUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'super_admin' })
      .eq('id', userId);
    
    if (error) {
      console.error("Error granting super admin role:", error);
      toast.error("فشل في منح صلاحية المسؤول الأعلى");
      return false;
    }
    
    toast.success("تم منح صلاحية المسؤول الأعلى بنجاح");
    return true;
  } catch (error) {
    console.error("Unexpected error granting super admin role:", error);
    toast.error("حدث خطأ غير متوقع أثناء منح الصلاحية");
    return false;
  }
};
