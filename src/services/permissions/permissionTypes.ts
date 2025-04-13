
// Change from CRUD-based permissions to HubSpot-style permission levels
export type PermissionLevel = 'read-only' | 'read-edit' | 'full-access';
export type PermissionScope = 'own' | 'team' | 'all' | 'unassigned';

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string | null;
  object: string;  // Instead of module
  level: PermissionLevel;
  scope: PermissionScope;
}

export interface ObjectPermission {
  object: string;
  levels: {
    'read-only': PermissionScope | null;
    'read-edit': PermissionScope | null;
    'full-access': PermissionScope | null;
  };
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string | null;
  permissions: ObjectPermission[];
}
