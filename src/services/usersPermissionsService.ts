
// This file is kept for backwards compatibility
// It re-exports functionality from the refactored services

import { fetchUserPermissions, getUserRole } from './permissions/userPermissionsService';
import { addPermissionToRole, removePermissionFromRole } from './permissions/rolePermissionsService';
import { assignRoleToUser, assignUserToTeam, changeUserStatus } from './users/userAssignmentService';
import { fetchActivityAnalytics } from './analytics/activityAnalyticsService';
import type { ActivityAnalytic } from './analytics/activityAnalyticsService';

export {
  fetchUserPermissions,
  getUserRole,
  addPermissionToRole,
  removePermissionFromRole,
  assignRoleToUser,
  assignUserToTeam,
  changeUserStatus,
  fetchActivityAnalytics
};

export type { ActivityAnalytic };
