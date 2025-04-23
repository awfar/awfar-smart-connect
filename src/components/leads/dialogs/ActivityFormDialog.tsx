
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityForm from '@/components/leads/ActivityForm';
import { LeadActivity } from '@/types/leads';
import { LeadActivityType } from '@/services/leads/types';

interface ActivityFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  activityType: LeadActivityType;
  onSuccess?: (activity?: LeadActivity) => void;
}

const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  open,
  onClose,
  leadId,
  activityType,
  onSuccess
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة نشاط</DialogTitle>
        </DialogHeader>
        <ActivityForm 
          leadId={leadId} 
          initialType={activityType}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
