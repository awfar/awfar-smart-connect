
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, ChevronDown, ChevronUp, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserPermissionChecker from '@/components/users/UserPermissionChecker';
import { useNavigate } from 'react-router-dom';

interface LeadPermissionAlertProps {
  email: string | null;
  isAuthenticated?: boolean;
}

const LeadPermissionAlert: React.FC<LeadPermissionAlertProps> = ({ email, isAuthenticated = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // إذا كان المستخدم مسجل الدخول، لا نظهر التنبيه
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 flex items-center gap-2">
          <span>تنبيه: أنت غير مسجل الدخول</span>
          <User className="h-4 w-4" /> 
          <span className="font-bold text-amber-900">{email || "مستخدم غير معروف"}</span>
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mb-2">يجب تسجيل الدخول للتمكن من حفظ البيانات بشكل دائم. حاليًا ستكون البيانات مؤقتة.</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
              className="bg-amber-100 hover:bg-amber-200 border-amber-300"
            >
              التحقق من الصلاحيات
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <LogIn className="ml-1 h-4 w-4" />
              تسجيل الدخول
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rtl">
          <DialogHeader>
            <DialogTitle>فحص صلاحيات المستخدم</DialogTitle>
          </DialogHeader>
          <UserPermissionChecker />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadPermissionAlert;
