
import { fetchUsers, fetchUserById } from './fetchUsers';
import { updateUser, deactivateUser, activateUser } from './updateUser';
import { getUserPermissions } from './permissions';
import { createSuperAdmin } from './createAdmin';
import { assignRoleToUser, assignUserToTeam, changeUserStatus } from './userAssignmentService';

// Re-export types with the proper 'export type' syntax
export type { User, SupabaseUserData, AuthUser } from './types';

// Re-export functions
export {
  fetchUsers,
  fetchUserById,
  updateUser,
  deactivateUser,
  activateUser,
  getUserPermissions,
  createSuperAdmin,
  assignRoleToUser,
  assignUserToTeam,
  changeUserStatus
};
