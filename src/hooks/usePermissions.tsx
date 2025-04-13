
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { checkUserHasPermission } from "@/services/permissions/permissionsService";
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";

type PermissionKey = `${string}.${PermissionAction}.${PermissionScope}`;

interface PermissionsContextType {
  hasPermission: (module: string, action: PermissionAction, scope?: PermissionScope) => boolean;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  hasPermission: () => false,
  isLoading: true,
});

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPermissions = async () => {
    setIsLoading(true);
    
    // We'll implement this in a way that checks permissions when needed
    // instead of loading all at once to minimize initial load time
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const hasPermission = (module: string, action: PermissionAction, scope: PermissionScope = 'own') => {
    const key = `${module}.${action}.${scope}` as PermissionKey;
    
    // Check if we've already cached this permission check
    if (permissions[key] !== undefined) {
      return permissions[key];
    }
    
    // If permission not in cache, return false for synchronous call
    // but trigger an async check that will update the cache
    checkPermissionAsync(module, action, scope);
    return false;
  };
  
  const checkPermissionAsync = async (module: string, action: PermissionAction, scope: PermissionScope) => {
    const key = `${module}.${action}.${scope}` as PermissionKey;
    
    // Check with the server
    try {
      const hasAccess = await checkUserHasPermission(module, action, scope);
      
      // Cache the result
      setPermissions(prev => ({
        ...prev,
        [key]: hasAccess
      }));
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission, isLoading }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
