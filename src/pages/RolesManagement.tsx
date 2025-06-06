
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchRoles } from "@/services/rolesService";
import RoleFormEnhanced from "@/components/roles/RoleFormEnhanced";
import RolesList from "@/components/roles/RolesList";
import RolePermissions from "@/components/roles/RolePermissions";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";
import DashboardLayout from "@/components/layout/DashboardLayout";

const RolesManagement = () => {
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showRolePermissions, setShowRolePermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const { data: roles, isLoading, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(),
  });

  const handleRoleAdded = () => {
    refetch();
    setShowRoleForm(false);
    toast.success("تم إضافة الدور بنجاح");
  };

  const handleRoleUpdated = () => {
    refetch();
    setShowRoleForm(false);
    toast.success("تم تحديث الدور بنجاح");
  };

  const handlePermissionsUpdated = () => {
    refetch();
    setShowRolePermissions(false);
    toast.success("تم تحديث صلاحيات الدور بنجاح");
  };

  const handleEditRole = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRoleForm(true);
  };

  const handleManagePermissions = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRolePermissions(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الأدوار</h1>
            <p className="text-gray-500">إدارة الأدوار والصلاحيات في النظام</p>
          </div>
          
          <Button onClick={() => {setSelectedRole(null); setShowRoleForm(true)}} className="flex items-center gap-2">
            <span>إضافة دور جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>قائمة الأدوار</CardTitle>
            <CardDescription>
              الأدوار المتاحة في النظام وإدارة صلاحياتها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RolesList 
              roles={roles || []}
              isLoading={isLoading}
              onEdit={handleEditRole}
              onManagePermissions={handleManagePermissions}
              onRefresh={refetch}
            />
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showRoleForm} onOpenChange={setShowRoleForm}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? "تعديل الدور" : "إضافة دور جديد"}</DialogTitle>
          </DialogHeader>
          <MobileOptimizedContainer>
            <RoleFormEnhanced 
              roleId={selectedRole} 
              isEditing={!!selectedRole}
              onSave={selectedRole ? handleRoleUpdated : handleRoleAdded} 
            />
          </MobileOptimizedContainer>
        </DialogContent>
      </Dialog>

      <Sheet open={showRolePermissions} onOpenChange={setShowRolePermissions}>
        <SheetContent className="w-full md:max-w-xl rtl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>إدارة صلاحيات الدور</SheetTitle>
          </SheetHeader>
          <MobileOptimizedContainer>
            {selectedRole && (
              <RolePermissions
                roleId={selectedRole}
                onSave={handlePermissionsUpdated}
              />
            )}
          </MobileOptimizedContainer>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default RolesManagement;
