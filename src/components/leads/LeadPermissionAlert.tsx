
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserPermissionChecker from '@/components/users/UserPermissionChecker';

interface LeadPermissionAlertProps {
  email: string | null;
}

const LeadPermissionAlert: React.FC<LeadPermissionAlertProps> = ({ email }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 flex items-center gap-2">
          <span>تنبيه بشأن صلاحيات المستخدم</span>
          <User className="h-4 w-4" /> 
          <span className="font-bold text-amber-900">{email || "غير معروف"}</span>
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mb-2">يبدو أن هناك مشكلة في صلاحيات المستخدم الحالي. قد لا تكون لديك صلاحيات كافية لإدارة العملاء المحتملين.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
            className="mt-1 bg-amber-100 hover:bg-amber-200 border-amber-300"
          >
            التحقق من الصلاحيات
          </Button>
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
