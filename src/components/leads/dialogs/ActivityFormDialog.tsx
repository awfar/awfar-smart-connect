
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ActivityForm from '@/components/leads/ActivityForm';
import { LeadActivity } from '@/types/leads';

interface ActivityFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  activityType?: 'note' | 'call' | 'meeting' | 'email' | 'task' | 'whatsapp';
  onSuccess?: (activity?: LeadActivity) => void;
}

const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  isOpen,
  onOpenChange,
  leadId,
  activityType,
  onSuccess
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة نشاط جديد</DialogTitle>
        </DialogHeader>
        
        <ActivityForm 
          leadId={leadId} 
          activityType={activityType}
          onSuccess={onSuccess} 
          onClose={handleClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
