
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { createAppointment } from '@/services/appointments/api';
import { toast } from 'sonner';

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  open,
  onClose,
  leadId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!leadId) {
      console.error("Missing leadId for appointment creation");
      toast.error("العميل المحتمل غير محدد");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Creating appointment for lead:", leadId, "with data:", data);
      
      // Ensure lead_id is set
      const appointmentData = {
        ...data,
        lead_id: leadId,
      };
      
      const result = await createAppointment(appointmentData);
      
      if (result) {
        toast.success("تم إنشاء الموعد بنجاح");
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Error adding appointment:', error);
      toast.error(`فشل في إنشاء الموعد: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>جدولة موعد</DialogTitle>
        </DialogHeader>
        
        <AppointmentForm
          leadId={leadId}
          onSubmit={handleSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
