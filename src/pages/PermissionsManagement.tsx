
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchPermissions } from "@/services/permissions/permissionsService";
import PermissionForm from "@/components/permissions/PermissionForm";
import PermissionsList from "@/components/permissions/PermissionsList";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PermissionDefinition } from "@/services/permissions/permissionTypes";

const PermissionsManagement = () => {
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  
  // Cast the returned data as PermissionDefinition[] to match the expected type
  const { data: permissions, isLoading, refetch } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const data = await fetchPermissions();
      return data as unknown as PermissionDefinition[];
    },
  });

  const handlePermissionAdded = () => {
    refetch();
    setShowPermissionForm(false);
    toast.success("تم إضافة الصلاحية بنجاح");
  };

  const handlePermissionUpdated = () => {
    refetch();
    setShowPermissionForm(false);
    toast.success("تم تحديث الصلاحية بنجاح");
  };

  const handleEditPermission = (permissionId: string) => {
    setSelectedPermission(permissionId);
    setShowPermissionForm(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الصلاحيات</h1>
            <p className="text-gray-500">إدارة صلاحيات المستخدمين في النظام</p>
          </div>
          
          <Button onClick={() => {setSelectedPermission(null); setShowPermissionForm(true)}} className="flex items-center gap-2">
            <span>إضافة صلاحية جديدة</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>قائمة الصلاحيات</CardTitle>
            <CardDescription>
              الصلاحيات المتاحة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionsList 
              permissions={permissions || []}
              isLoading={isLoading}
              onEdit={handleEditPermission}
              onRefresh={refetch}
            />
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showPermissionForm} onOpenChange={setShowPermissionForm}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPermission ? "تعديل الصلاحية" : "إضافة صلاحية جديدة"}</DialogTitle>
          </DialogHeader>
          <MobileOptimizedContainer>
            <PermissionForm 
              permissionId={selectedPermission} 
              isEditing={!!selectedPermission}
              onSave={selectedPermission ? handlePermissionUpdated : handlePermissionAdded} 
            />
          </MobileOptimizedContainer>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PermissionsManagement;
