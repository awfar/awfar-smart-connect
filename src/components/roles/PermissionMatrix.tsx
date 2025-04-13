
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { PermissionDefinition, ObjectPermission, PermissionScope, PermissionLevel } from "@/services/permissions/permissionTypes";
import { getSystemObjects } from "@/services/permissions/permissionsService";
import ObjectAccordionItem from "./ModuleAccordionItem";

interface PermissionMatrixProps {
  permissions: PermissionDefinition[];
  selectedPermissions: ObjectPermission[];
  onChange: (permissions: ObjectPermission[]) => void;
}

const PermissionMatrix = ({ permissions, selectedPermissions, onChange }: PermissionMatrixProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const systemObjects = getSystemObjects();
  
  // Group permissions by object
  const permissionsByObject: Record<string, PermissionDefinition[]> = {};
  permissions.forEach(permission => {
    if (!permission.object) return;
    
    if (!permissionsByObject[permission.object]) {
      permissionsByObject[permission.object] = [];
    }
    
    permissionsByObject[permission.object].push(permission);
  });

  // Get display label for an object
  const getObjectLabel = (objectName: string) => {
    const obj = systemObjects.find(o => o.name === objectName);
    return obj ? obj.label : objectName;
  };
  
  // Check if a specific permission is selected
  const isPermissionSelected = (object: string, level: PermissionLevel, scope: PermissionScope) => {
    const objectPermission = selectedPermissions.find(op => op.object === object);
    if (!objectPermission) return false;
    
    return objectPermission.levels[level] === scope;
  };
  
  // Toggle a permission selection
  const togglePermission = (object: string, level: PermissionLevel, scope: PermissionScope | null) => {
    let updatedPermissions = [...selectedPermissions];
    
    // Find if we already have this object in our selected permissions
    const objectIndex = updatedPermissions.findIndex(op => op.object === object);
    
    if (objectIndex === -1 && scope) {
      // If object doesn't exist and we're setting a permission, add it
      updatedPermissions.push({
        object,
        levels: {
          'read-only': level === 'read-only' ? scope : null,
          'read-edit': level === 'read-edit' ? scope : null,
          'full-access': level === 'full-access' ? scope : null
        }
      });
    } else if (objectIndex !== -1) {
      // Object exists, update the specific level
      updatedPermissions[objectIndex] = {
        ...updatedPermissions[objectIndex],
        levels: {
          ...updatedPermissions[objectIndex].levels,
          [level]: scope
        }
      };
      
      // If all levels are null, remove the object entirely
      const allLevelsNull = Object.values(updatedPermissions[objectIndex].levels).every(v => v === null);
      if (allLevelsNull) {
        updatedPermissions = updatedPermissions.filter((_, index) => index !== objectIndex);
      }
    }
    
    onChange(updatedPermissions);
  };

  // Get available scopes for a specific object and level
  const getAvailableScopesForLevel = (object: string, level: PermissionLevel): PermissionScope[] => {
    const scopes: PermissionScope[] = [];
    
    permissions
      .filter(p => p.object === object && p.level === level)
      .forEach(p => {
        if (!scopes.includes(p.scope)) {
          scopes.push(p.scope);
        }
      });
    
    return scopes;
  };

  // Filter objects based on search term
  const filteredObjects = Object.keys(permissionsByObject)
    .filter(object => {
      if (!searchTerm) return true;
      
      // Check if object name matches search
      if (getObjectLabel(object).toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Check if any permission in this object matches search
      return permissionsByObject[object].some(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort();

  // Scope display names
  const scopeLabels: Record<PermissionScope, string> = {
    'own': 'سجلاته',
    'team': 'سجلات فريقه',
    'all': 'جميع السجلات',
    'unassigned': 'سجلات غير مسندة'
  };
  
  // Level display names
  const levelLabels: Record<PermissionLevel, string> = {
    'read-only': 'قراءة فقط',
    'read-edit': 'قراءة وتعديل',
    'full-access': 'وصول كامل'
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
            {filteredObjects.map(object => (
              <ObjectAccordionItem
                key={object}
                object={object}
                objectLabel={getObjectLabel(object)}
                getAvailableScopesForLevel={getAvailableScopesForLevel}
                isPermissionSelected={isPermissionSelected}
                togglePermission={togglePermission}
                levelLabels={levelLabels}
                scopeLabels={scopeLabels}
              />
            ))}
          </Accordion>
          
          {filteredObjects.length === 0 && (
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
