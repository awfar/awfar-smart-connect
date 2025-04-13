
export type PermissionLevel = 'read-only' | 'read-edit' | 'full-access';
export type PermissionScope = 'own' | 'team' | 'all' | 'unassigned';

export interface PermissionDefinition {
  id: string;
  name: string;
  description?: string;
  object: string;
  level: PermissionLevel;
  scope: PermissionScope;
}

export interface ObjectPermission {
  object: string;
  levels: {
    [key in PermissionLevel]?: PermissionScope;
  };
}

export interface SystemObject {
  name: string;
  label: string;
  permissions: {
    level: PermissionLevel;
    scopes: PermissionScope[];
  }[];
}
