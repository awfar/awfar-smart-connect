
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ModulePermission, PermissionDefinition, PermissionScope } from "@/services/permissions/permissionTypes";

interface PermissionMatrixProps {
  permissions: PermissionDefinition[];
  selectedPermissions: ModulePermission[];
  onChange: (permissions: ModulePermission[]) => void;
}

const PermissionMatrix = ({ permissions, selectedPermissions, onChange }: PermissionMatrixProps) => {
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>(selectedPermissions);
  
  // Group permissions by module
  const modules = Array.from(new Set(permissions.map(p => p.module)));
  
  useEffect(() => {
    // Initialize permissions structure if not provided
    if (selectedPermissions.length === 0) {
      const initialPerms = modules.map(module => ({
        module,
        actions: {
          create: null,
          read: null,
          update: null,
          delete: null,
        }
      }));
      setModulePermissions(initialPerms);
      onChange(initialPerms);
    } else {
      setModulePermissions(selectedPermissions);
    }
  }, [permissions]);
  
  const handleScopeChange = (module: string, action: string, scope: PermissionScope | null) => {
    const updatedPermissions = modulePermissions.map(mp => {
      if (mp.module === module) {
        return {
          ...mp,
          actions: {
            ...mp.actions,
            [action]: scope
          }
        };
      }
      return mp;
    });
    
    setModulePermissions(updatedPermissions);
    onChange(updatedPermissions);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">صلاحيات النظام</h3>
        <p className="text-sm text-muted-foreground">
          حدد الصلاحيات لكل وحدة في النظام
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">الوحدة</TableHead>
            <TableHead className="text-center">قراءة</TableHead>
            <TableHead className="text-center">إنشاء</TableHead>
            <TableHead className="text-center">تعديل</TableHead>
            <TableHead className="text-center">حذف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map(module => {
            const modulePermission = modulePermissions.find(mp => mp.module === module) || {
              module,
              actions: { create: null, read: null, update: null, delete: null }
            };
            
            return (
              <TableRow key={module}>
                <TableCell className="font-medium capitalize">{module}</TableCell>
                
                <TableCell>
                  <RadioGroup value={modulePermission.actions.read || ""} 
                             onValueChange={(val) => handleScopeChange(module, "read", val ? val as PermissionScope : null)}
                             className="flex justify-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="own" id={`${module}-read-own`} />
                        <Label htmlFor={`${module}-read-own`} className="text-xs">الخاصة</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="team" id={`${module}-read-team`} />
                        <Label htmlFor={`${module}-read-team`} className="text-xs">الفريق</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="all" id={`${module}-read-all`} />
                        <Label htmlFor={`${module}-read-all`} className="text-xs">الكل</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="" id={`${module}-read-none`} />
                        <Label htmlFor={`${module}-read-none`} className="text-xs">لا</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TableCell>
                
                <TableCell>
                  <RadioGroup value={modulePermission.actions.create || ""} 
                             onValueChange={(val) => handleScopeChange(module, "create", val ? val as PermissionScope : null)}
                             className="flex justify-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="own" id={`${module}-create-own`} />
                        <Label htmlFor={`${module}-create-own`} className="text-xs">الخاصة</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="team" id={`${module}-create-team`} />
                        <Label htmlFor={`${module}-create-team`} className="text-xs">الفريق</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="all" id={`${module}-create-all`} />
                        <Label htmlFor={`${module}-create-all`} className="text-xs">الكل</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="" id={`${module}-create-none`} />
                        <Label htmlFor={`${module}-create-none`} className="text-xs">لا</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TableCell>
                
                <TableCell>
                  <RadioGroup value={modulePermission.actions.update || ""} 
                             onValueChange={(val) => handleScopeChange(module, "update", val ? val as PermissionScope : null)}
                             className="flex justify-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="own" id={`${module}-update-own`} />
                        <Label htmlFor={`${module}-update-own`} className="text-xs">الخاصة</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="team" id={`${module}-update-team`} />
                        <Label htmlFor={`${module}-update-team`} className="text-xs">الفريق</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="all" id={`${module}-update-all`} />
                        <Label htmlFor={`${module}-update-all`} className="text-xs">الكل</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="" id={`${module}-update-none`} />
                        <Label htmlFor={`${module}-update-none`} className="text-xs">لا</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TableCell>
                
                <TableCell>
                  <RadioGroup value={modulePermission.actions.delete || ""} 
                             onValueChange={(val) => handleScopeChange(module, "delete", val ? val as PermissionScope : null)}
                             className="flex justify-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="own" id={`${module}-delete-own`} />
                        <Label htmlFor={`${module}-delete-own`} className="text-xs">الخاصة</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="team" id={`${module}-delete-team`} />
                        <Label htmlFor={`${module}-delete-team`} className="text-xs">الفريق</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="all" id={`${module}-delete-all`} />
                        <Label htmlFor={`${module}-delete-all`} className="text-xs">الكل</Label>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <RadioGroupItem value="" id={`${module}-delete-none`} />
                        <Label htmlFor={`${module}-delete-none`} className="text-xs">لا</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionMatrix;
