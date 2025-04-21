
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ActivityForm from '@/components/leads/ActivityForm';
import { LeadActivity } from '@/types/leads';

interface ActivityFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  activityType: 'note' | 'call' | 'meeting' | 'email' | 'task' | 'whatsapp';
  onSuccess?: (activity?: LeadActivity) => void;
}

const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  isOpen,
  onOpenChange,
  leadId,
  activityType,
  onSuccess
}) => {
  const getDialogTitle = () => {
    switch (activityType) {
      case 'note': return 'إضافة ملاحظة جديدة';
      case 'call': return 'تسجيل مكالمة';
      case 'meeting': return 'تسجيل اجتماع';
      case 'email': return 'تسجيل بريد إلكتروني';
      case 'task': return 'إضافة مهمة جديدة';
      case 'whatsapp': return 'تسجيل محادثة واتساب';
      default: return 'إضافة نشاط جديد';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <ActivityForm 
          leadId={leadId} 
          activityType={activityType}
          onSuccess={onSuccess}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
