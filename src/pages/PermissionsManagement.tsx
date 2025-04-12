
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { fetchPermissions } from "@/services/permissionsService";
import PermissionForm from "@/components/permissions/PermissionForm";
import PermissionsList from "@/components/permissions/PermissionsList";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";

const PermissionsManagement = () => {
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  
  const { data: permissions, isLoading, refetch } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => fetchPermissions(),
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
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
        </main>
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
    </div>
  );
};

export default PermissionsManagement;
