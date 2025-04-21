import { supabase } from "@/integrations/supabase/client";

// Helper function to safely access object properties
const safeGetName = (obj: any): string => {
  if (!obj) return '';
  
  // Handle array case
  if (Array.isArray(obj)) {
    const firstItem = obj[0];
    return firstItem?.name || '';
  }
  
  // Handle object case
  return obj.name || '';
};

export const getUserPermissions = async (userId: string) => {
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
      console.error("Error fetching user permissions:", error);
      return null;
    }

    if (!userData) {
      console.log("User not found:", userId);
      return null;
    }

    const transformedData = {
      userId: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      roleName: safeGetName(userData?.role),
      status: userData.status,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };

    return transformedData;
  } catch (error) {
    console.error("Unexpected error fetching user permissions:", error);
    return null;
  }
};
