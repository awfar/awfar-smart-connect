
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import LeadForm from '@/components/leads/LeadForm';
import { Lead } from "@/services/leads";

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
                onSuccess={onSuccess}
              />
            )}
          </MobileOptimizedContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
