
// Define the permission levels and scopes
export type PermissionLevel = 'read-only' | 'read-edit' | 'full-access';
export type PermissionScope = 'own' | 'team' | 'all' | 'unassigned';

// Permission definition for the HubSpot-style permissions system
export interface PermissionDefinition {
  id: string;
  name: string;
  description?: string;
  object: string; // e.g. 'contacts', 'companies', etc.
  level: PermissionLevel;
  scope: PermissionScope;
}

// Object permissions for the form-based permission selection
export interface ObjectPermission {
  object: string;
  levels: {
    'read-only'?: PermissionScope | null;
    'read-edit'?: PermissionScope | null;
    'full-access'?: PermissionScope | null;
  };
}
