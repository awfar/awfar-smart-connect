
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchRoleById, createRole, updateRole, updateRolePermissions } from "@/services/rolesService";
import { fetchPermissions } from "@/services/permissions/permissionsService";
import { ObjectPermission } from "@/services/permissions/permissionTypes";
import { toast } from "sonner";
import PermissionMatrix from "./PermissionMatrix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoleFormEnhancedProps {
  roleId?: string | null;
  isEditing?: boolean;
  onSave: () => void;
}

const RoleFormEnhanced = ({ roleId, isEditing = false, onSave }: RoleFormEnhancedProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<ObjectPermission[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);

  const { data: role, refetch: refetchRole } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => fetchRoleById(roleId!),
    enabled: !!roleId && isEditing,
  });

  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
  });

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setDescription(role.description || "");
      
      // Populate selected permissions from role.permissions if available
      if (role.permissions && Array.isArray(role.permissions)) {
        // Convert role.permissions to ObjectPermission[] format
        const objectPermissionsMap = new Map<string, ObjectPermission>();
        
        role.permissions.forEach(permission => {
          const { object, level, scope } = permission;
          
          if (!objectPermissionsMap.has(object)) {
            objectPermissionsMap.set(object, {
              object,
              levels: {}
            });
          }
          
          const objPerm = objectPermissionsMap.get(object)!;
          objPerm.levels[level] = scope;
        });
        
        setSelectedPermissions(Array.from(objectPermissionsMap.values()));
      }
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Submitting role:", { name, description });
      console.log("Selected permissions:", selectedPermissions);
      
      let roleData;
      
      if (isEditing && roleId) {
        roleData = await updateRole({
          id: roleId,
          name,
          description,
        });
        
        if (!roleData) throw new Error("فشل تحديث الدور");
        
        // Convert matrix permissions to role permissions
        const permissionIds = getSelectedPermissionIds();
        
        const success = await updateRolePermissions(roleId, permissionIds);
        if (!success) throw new Error("فشل تحديث صلاحيات الدور");
      } else {
        roleData = await createRole({
          name,
          description,
        });
        
        if (!roleData) throw new Error("فشل إنشاء الدور");
        
        // Convert matrix permissions to role permissions
        const permissionIds = getSelectedPermissionIds();
        
        const success = await updateRolePermissions(roleData.id, permissionIds);
        if (!success) throw new Error("فشل تحديث صلاحيات الدور");
      }
      
      toast.success(isEditing ? "تم تحديث الدور بنجاح" : "تم إضافة الدور بنجاح");
      onSave();
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل الدور:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الدور");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to convert selected matrix permissions to permission IDs
  const getSelectedPermissionIds = (): string[] => {
    const permissionIds: string[] = [];
    
    selectedPermissions.forEach(op => {
      Object.entries(op.levels).forEach(([level, scope]) => {
        if (scope) {
          const permName = `${op.object}_${level}_${scope}`;
          console.log("Looking for permission with name:", permName);
          const permission = permissions.find(p => p.name === permName);
          if (permission) {
            console.log("Found permission:", permission);
            permissionIds.push(permission.id);
          } else {
            console.log("Permission not found:", permName);
          }
        }
      });
    });
    
    console.log("Selected permission IDs:", permissionIds);
    return permissionIds;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">تفاصيل الدور</TabsTrigger>
          <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <form className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="role_name">اسم الدور</Label>
              <Input 
                id="role_name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="مثال: مدير، مشرف، محرر"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role_description">وصف الدور</Label>
              <Textarea 
                id="role_description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر للدور والمسؤوليات المرتبطة به"
                rows={3}
              />
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionMatrix 
            permissions={permissions} 
            selectedPermissions={selectedPermissions} 
            onChange={setSelectedPermissions}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة الدور"}
        </Button>
      </div>
    </div>
  );
};

export default RoleFormEnhanced;
