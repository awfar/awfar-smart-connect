
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import LeadForm from '@/components/leads/LeadForm';
import { Lead } from "@/services/leads";
import { toast } from "sonner";

interface EditLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSuccess: () => void;
}

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  lead,
  onSuccess
}) => {
  const handleSuccess = (updatedLead?: Lead) => {
    if (updatedLead) {
      const fullName = `${updatedLead.first_name} ${updatedLead.last_name}`.trim();
      toast.success(`تم تحديث بيانات العميل المحتمل "${fullName}" بنجاح`);
    } else {
      toast.success("تم تحديث بيانات العميل المحتمل بنجاح");
    }
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تعديل بيانات العميل المحتمل</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MobileOptimizedContainer>
            {lead && (
              <LeadForm 
                lead={lead}
                onClose={() => onOpenChange(false)}
                onSuccess={handleSuccess}
              />
            )}
          </MobileOptimizedContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
