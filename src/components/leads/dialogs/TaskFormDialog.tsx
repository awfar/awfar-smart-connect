
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskCreateInput } from '@/services/tasks/types';
import TaskForm from '@/components/tasks/TaskForm';
import { createTask } from '@/services/tasks/api';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onClose,
  leadId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TaskCreateInput) => {
    if (!leadId) {
      console.error("Missing leadId for task creation");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Creating task for lead:", leadId, "with data:", data);
      
      const result = await createTask({
        ...data,
        lead_id: leadId,
      });
      
      if (result) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>إضافة مهمة</DialogTitle>
        </DialogHeader>
        
        <TaskForm
          onSubmit={handleSubmit}
          onClose={onClose}
          leadId={leadId}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
