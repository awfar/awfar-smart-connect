
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { checkUserHasPermission, initializeSystemPermissions } from "@/services/permissions/permissionsService";
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";

type PermissionKey = `${string}.${PermissionLevel}.${PermissionScope}`;

interface PermissionsContextType {
  hasPermission: (object: string, level: PermissionLevel, scope?: PermissionScope) => boolean;
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
    
    // Initialize system permissions if needed
    await initializeSystemPermissions();
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const hasPermission = (object: string, level: PermissionLevel, scope: PermissionScope = 'own') => {
    const key = `${object}.${level}.${scope}` as PermissionKey;
    
    // Check if we've already cached this permission check
    if (permissions[key] !== undefined) {
      return permissions[key];
    }
    
    // If permission not in cache, return false for synchronous call
    // but trigger an async check that will update the cache
    checkPermissionAsync(object, level, scope);
    return false;
  };
  
  const checkPermissionAsync = async (object: string, level: PermissionLevel, scope: PermissionScope) => {
    const key = `${object}.${level}.${scope}` as PermissionKey;
    
    // Check with the server
    try {
      const hasAccess = await checkUserHasPermission(object, level, scope);
      
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
