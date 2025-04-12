
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { fetchRoleById, updateRolePermissions } from "@/services/rolesService";
import { fetchPermissions } from "@/services/permissionsService";
import { fetchRolePermissions } from "@/services/permissionsService";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RolePermissionsProps {
  roleId: string;
  onSave: () => void;
}

const RolePermissions = ({ roleId, onSave }: RolePermissionsProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: role } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => fetchRoleById(roleId),
    enabled: !!roleId,
  });

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
  });

  const { data: rolePermissions = [] } = useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => fetchRolePermissions(roleId),
    enabled: !!roleId,
  });

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map(p => p.permission_id));
    }
  }, [rolePermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateRolePermissions(roleId, selectedPermissions);
      onSave();
    } catch (error: any) {
      console.error("خطأ في تحديث صلاحيات الدور:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث الصلاحيات");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Group permissions by module (extract module from permission name)
  const groupedPermissions = permissions.reduce((groups: Record<string, any[]>, permission) => {
    // Extract module from permission name (e.g., "view_users" -> "users")
    let module = "أخرى";
    
    if (permission.name.includes('_')) {
      const parts = permission.name.split('_');
      if (parts.length > 1) {
        module = parts[parts.length - 1]; // Use the last part as module name
      }
    }
    
    if (!groups[module]) {
      groups[module] = [];
    }
    
    groups[module].push(permission);
    return groups;
  }, {});

  // Filter permissions based on search term
  const filteredPermissions = searchTerm 
    ? permissions.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          إدارة صلاحيات: {role?.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {role?.description}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search">بحث عن صلاحية</Label>
          <Input
            id="search"
            placeholder="ابحث باسم الصلاحية أو الوصف"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {searchTerm ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">نتائج البحث</h3>
              <div className="space-y-2">
                {filteredPermissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">لا توجد نتائج</p>
                ) : (
                  filteredPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handleCheckboxChange(permission.id)}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </Label>
                        {permission.description && (
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <div key={module} className="mb-6">
                <h3 className="text-sm font-medium mb-2 capitalize">{module}</h3>
                <div className="space-y-2">
                  {modulePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handleCheckboxChange(permission.id)}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </Label>
                        {permission.description && (
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ الصلاحيات"}
        </Button>
      </div>
    </div>
  );
};

export default RolePermissions;
