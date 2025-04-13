
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type PermissionScope = 'own' | 'team' | 'all';

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export interface ModulePermission {
  module: string;
  actions: {
    create: PermissionScope | null;
    read: PermissionScope | null;
    update: PermissionScope | null;
    delete: PermissionScope | null;
  };
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string | null;
  permissions: ModulePermission[];
}
