
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Phone, FileText, Calendar, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from 'sonner';
import { CompanyContactForm } from './forms/CompanyContactForm';
import { CompanyDealForm } from './forms/CompanyDealForm';
import { CompanyActivityForm } from './forms/CompanyActivityForm';

interface CompanyActionsProps {
  companyId: string;
}

export const CompanyActions = ({ companyId }: CompanyActionsProps) => {
  const [actionType, setActionType] = React.useState<'contact' | 'deal' | 'activity' | null>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleClose = () => {
    setActionType(null);
  };

  const handleSuccess = async (type: string) => {
    await queryClient.invalidateQueries(['company', companyId]);
    toast.success(`تم إضافة ${type} بنجاح`);
    handleClose();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setActionType('contact')}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة جهة اتصال
        </Button>
        <Button size="sm" onClick={() => setActionType('deal')}>
          <FileText className="h-4 w-4 ml-2" />
          إضافة صفقة
        </Button>
        <Button size="sm" onClick={() => setActionType('activity')}>
          <Calendar className="h-4 w-4 ml-2" />
          إضافة نشاط
        </Button>
      </div>

      <Dialog open={!!actionType} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'contact' && 'إضافة جهة اتصال جديدة'}
              {actionType === 'deal' && 'إضافة صفقة جديدة'}
              {actionType === 'activity' && 'إضافة نشاط جديد'}
            </DialogTitle>
          </DialogHeader>

          {actionType === 'contact' && (
            <CompanyContactForm 
              companyId={companyId} 
              onSuccess={() => handleSuccess('جهة الاتصال')} 
              onCancel={handleClose}
            />
          )}
          {actionType === 'deal' && (
            <CompanyDealForm 
              companyId={companyId} 
              onSuccess={() => handleSuccess('الصفقة')} 
              onCancel={handleClose}
            />
          )}
          {actionType === 'activity' && (
            <CompanyActivityForm 
              companyId={companyId} 
              onSuccess={() => handleSuccess('النشاط')} 
              onCancel={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
