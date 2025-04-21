
// This file serves as a bridge between the UI components and the actual permission services

import { 
  getUserPermissions,
} from './permissions/userPermissionsService';
import { checkUserStatus } from './permissions/userStatusChecker';

// Re-export the functions with more descriptive names
export const fetchUserPermissions = getUserPermissions;
export const fetchUserRole = async (userId: string): Promise<string | null> => {
  const userStatus = await checkUserStatus(userId);
  return userStatus?.roleName || null;
};

// Add additional wrapper functions if needed
export const isUserAllowedTo = async (userId: string, permission: string): Promise<boolean> => {
  try {
    const permissions = await getUserPermissions(userId);
    const userStatus = await checkUserStatus(userId);
    
    // Super admin can do everything
    if (userStatus?.roleName === 'super_admin') {
      return true;
    }
    
    return permissions.includes(permission);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

export const getUserRoleAndPermissions = async (userId: string) => {
  try {
    const userStatus = await checkUserStatus(userId);
    const permissions = await getUserPermissions(userId);
    
    return {
      role: userStatus?.roleName || null,
      permissions,
      isActive: userStatus?.status === 'active',
      firstName: userStatus?.firstName,
      lastName: userStatus?.lastName,
      email: userStatus?.email
    };
  } catch (error) {
    console.error("Error fetching user role and permissions:", error);
    return {
      role: null,
      permissions: [],
      isActive: false,
      firstName: null,
      lastName: null,
      email: null
    };
  }
};
