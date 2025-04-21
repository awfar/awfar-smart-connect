
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield, UserCheck } from "lucide-react";
import { getUserPermissions } from '@/services/users/permissions';
import { checkUserStatus, grantSuperAdminToUser } from '@/services/permissions/userStatusChecker';
import { supabase } from '@/integrations/supabase/client';

interface UserPermissionCheckerProps {
  requiredPermission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const UserPermissionChecker: React.FC<UserPermissionCheckerProps> = ({
  requiredPermission,
  children,
  fallback
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setUserId(data.user.id);
          setUserEmail(data.user.email);
          
          // Check user status to get role
          const userStatus = await checkUserStatus(data.user.id);
          if (userStatus) {
            setUserRole(userStatus.roleName);
          }
          
          // Get permissions
          if (requiredPermission) {
            const permissions = await getUserPermissions(data.user.id);
            setUserPermissions(permissions);
            
            // Check if user has the required permission or is a super_admin
            const hasPerm = permissions.includes(requiredPermission) || userStatus?.roleName === 'super_admin';
            setHasPermission(hasPerm);
          } else {
            // If no specific permission is required, allow access
            setHasPermission(true);
          }
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredPermission]);

  const handleGrantSuperAdmin = async () => {
    if (!userId) return;
    
    const success = await grantSuperAdminToUser(userId);
    if (success) {
      setUserRole('super_admin');
      setHasPermission(true);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">جاري التحقق من الصلاحيات...</div>;
  }

  if (hasPermission === false) {
    return fallback || (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            غير مصرح
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>صلاحيات غير كافية</AlertTitle>
            <AlertDescription>
              ليس لديك الصلاحية المطلوبة للوصول إلى هذه الصفحة.
              {requiredPermission && (
                <p className="mt-2 text-sm">
                  الصلاحية المطلوبة: <strong>{requiredPermission}</strong>
                </p>
              )}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                البريد الإلكتروني: {userEmail || "غير مسجل الدخول"}
              </p>
              <p className="text-sm text-muted-foreground">
                الدور: {userRole || "غير معروف"}
              </p>
            </div>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGrantSuperAdmin}
                disabled={!userId}
              >
                <Shield className="h-4 w-4 mr-2" />
                منح صلاحية المسؤول الأعلى (للتطوير فقط)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default UserPermissionChecker;
