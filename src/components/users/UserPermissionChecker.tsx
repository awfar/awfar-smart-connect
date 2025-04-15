
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ShieldCheck, ShieldAlert, User, Check, X } from "lucide-react";
import { checkCurrentUserStatus, grantSuperAdminToUser } from '@/services/permissions/userStatusChecker';

const UserPermissionChecker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const checkUserStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await checkCurrentUserStatus();
      setUserStatus(status);
      
      if (status.error) {
        setError(status.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التحقق من صلاحيات المستخدم');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGrantSuperAdmin = async () => {
    if (!userStatus?.currentUserId) return;
    
    setIsProcessing(true);
    
    try {
      const success = await grantSuperAdminToUser(userStatus.currentUserId);
      if (success) {
        // إعادة تحميل معلومات المستخدم بعد التحديث
        await checkUserStatus();
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  useEffect(() => {
    checkUserStatus();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>فحص صلاحيات المستخدم</CardTitle>
        <CardDescription>التحقق من صلاحيات المستخدم الحالي في النظام</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3">جاري التحقق من صلاحيات المستخدم...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ في التحقق</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">حالة المصادقة:</span>
              <div className="flex items-center">
                {userStatus?.isAuthenticated ? (
                  <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                    <Check className="h-3 w-3" /> مسجل الدخول
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <X className="h-3 w-3" /> غير مسجل الدخول
                  </Badge>
                )}
              </div>
            </div>
            
            {userStatus?.isAuthenticated && (
              <>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <span className="text-gray-700">{userStatus?.email || "غير معروف"}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">معرف المستخدم:</span>
                  <span className="text-gray-700 text-xs max-w-[200px] truncate">{userStatus?.currentUserId || "غير معروف"}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">الدور:</span>
                  <Badge variant="outline" className={userStatus?.isSuperAdmin ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}>
                    {userStatus?.role || "غير محدد"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">صلاحيات سوبر أدمن:</span>
                  <div>
                    {userStatus?.isSuperAdmin ? (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> نعم
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> لا
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-2">الصلاحيات المتاحة:</h3>
                  {userStatus?.permissions && userStatus.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userStatus.permissions.map((perm: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">لا توجد صلاحيات محددة</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={checkUserStatus} 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          تحديث البيانات
        </Button>
        
        {userStatus?.isAuthenticated && !userStatus?.isSuperAdmin && (
          <Button 
            onClick={handleGrantSuperAdmin} 
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            منح صلاحية سوبر أدمن
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserPermissionChecker;
