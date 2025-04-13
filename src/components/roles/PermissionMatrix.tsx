
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { PermissionDefinition, ModulePermission, PermissionScope, PermissionAction } from "@/services/permissions/permissionTypes";
import { getSystemModules } from "@/services/permissions/permissionsService";
import ModuleAccordionItem from "./ModuleAccordionItem";

interface PermissionMatrixProps {
  permissions: PermissionDefinition[];
  selectedPermissions: ModulePermission[];
  onChange: (permissions: ModulePermission[]) => void;
}

const PermissionMatrix = ({ permissions, selectedPermissions, onChange }: PermissionMatrixProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const systemModules = getSystemModules();
  
  // Group permissions by module
  const permissionsByModule: Record<string, PermissionDefinition[]> = {};
  permissions.forEach(permission => {
    if (!permission.module) return;
    
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    
    permissionsByModule[permission.module].push(permission);
  });

  // Get display label for a module
  const getModuleLabel = (moduleName: string) => {
    const module = systemModules.find(m => m.name === moduleName);
    return module ? module.label : moduleName;
  };
  
  // Check if a specific permission is selected
  const isPermissionSelected = (module: string, action: PermissionAction, scope: PermissionScope) => {
    const modulePermission = selectedPermissions.find(mp => mp.module === module);
    if (!modulePermission) return false;
    
    return modulePermission.actions[action] === scope;
  };
  
  // Toggle a permission selection
  const togglePermission = (module: string, action: PermissionAction, scope: PermissionScope | null) => {
    let updatedPermissions = [...selectedPermissions];
    
    // Find if we already have this module in our selected permissions
    const moduleIndex = updatedPermissions.findIndex(mp => mp.module === module);
    
    if (moduleIndex === -1 && scope) {
      // If module doesn't exist and we're setting a permission, add it
      updatedPermissions.push({
        module,
        actions: {
          create: action === 'create' ? scope : null,
          read: action === 'read' ? scope : null,
          update: action === 'update' ? scope : null,
          delete: action === 'delete' ? scope : null
        }
      });
    } else if (moduleIndex !== -1) {
      // Module exists, update the specific action
      updatedPermissions[moduleIndex] = {
        ...updatedPermissions[moduleIndex],
        actions: {
          ...updatedPermissions[moduleIndex].actions,
          [action]: scope
        }
      };
      
      // If all actions are null, remove the module entirely
      const allActionsNull = Object.values(updatedPermissions[moduleIndex].actions).every(v => v === null);
      if (allActionsNull) {
        updatedPermissions = updatedPermissions.filter((_, index) => index !== moduleIndex);
      }
    }
    
    onChange(updatedPermissions);
  };

  // Get available scopes for a specific module and action
  const getAvailableScopesForAction = (module: string, action: PermissionAction): PermissionScope[] => {
    const scopes: PermissionScope[] = [];
    
    permissions
      .filter(p => p.module === module && p.action === action)
      .forEach(p => {
        if (!scopes.includes(p.scope)) {
          scopes.push(p.scope);
        }
      });
    
    return scopes;
  };

  // Filter modules based on search term
  const filteredModules = Object.keys(permissionsByModule)
    .filter(module => {
      if (!searchTerm) return true;
      
      // Check if module name matches search
      if (getModuleLabel(module).toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Check if any permission in this module matches search
      return permissionsByModule[module].some(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort();

  // Scope display names
  const scopeLabels: Record<PermissionScope, string> = {
    'own': 'خاصة بالمستخدم',
    'team': 'فريق المستخدم',
    'all': 'جميع البيانات'
  };
  
  // Action display names
  const actionLabels: Record<PermissionAction, string> = {
    'create': 'إنشاء',
    'read': 'قراءة',
    'update': 'تعديل',
    'delete': 'حذف'
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="ابحث عن صلاحيات..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>
      
      <ScrollArea className="h-[500px] pr-4 border rounded-md">
        <div className="p-4 space-y-4">
          <Accordion type="multiple" className="w-full">
            {filteredModules.map(module => (
              <ModuleAccordionItem
                key={module}
                module={module}
                moduleLabel={getModuleLabel(module)}
                getAvailableScopesForAction={getAvailableScopesForAction}
                isPermissionSelected={isPermissionSelected}
                togglePermission={togglePermission}
                actionLabels={actionLabels}
                scopeLabels={scopeLabels}
              />
            ))}
          </Accordion>
          
          {filteredModules.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              لا توجد صلاحيات تطابق البحث
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PermissionMatrix;
