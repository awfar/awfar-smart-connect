
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import LeadForm from '@/components/leads/LeadForm';
import { toast } from "sonner";

interface AddLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const handleSuccess = () => {
    toast.success("تم إضافة العميل المحتمل بنجاح");
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة عميل محتمل جديد</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MobileOptimizedContainer>
            <LeadForm 
              onClose={() => onOpenChange(false)}
              onSuccess={handleSuccess}
            />
          </MobileOptimizedContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
