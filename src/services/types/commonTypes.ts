
// Common type definitions used across multiple modules

// Owner (usually a user) representation
export interface Owner {
  name: string;
  avatar?: string;
  initials?: string;
  first_name?: string; // Add first_name field
  last_name?: string;  // Add last_name field
}
