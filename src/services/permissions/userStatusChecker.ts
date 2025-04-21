import { supabase } from '@/integrations/supabase/client';

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

export const checkUserStatus = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        status,
        role (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return {
        isActive: false,
        roleName: 'Unknown',
        message: 'Error fetching user data'
      };
    }

    if (!userData) {
      return {
        isActive: false,
        roleName: 'Unknown',
        message: 'User not found'
      };
    }

    const isActive = userData.status === 'active';

    const userStatus = {
      isActive: isActive,
      roleName: safeGetName(userData?.role),
      message: isActive ? 'User is active' : 'User is inactive'
    };
    
    return userStatus;

  } catch (error) {
    console.error('Unexpected error checking user status:', error);
    return {
      isActive: false,
      roleName: 'Unknown',
      message: 'Unexpected error'
    };
  }
};
