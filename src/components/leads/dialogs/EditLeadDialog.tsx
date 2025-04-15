
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import LeadForm from '@/components/leads/LeadForm';
import { Lead } from "@/services/leads";
import { toast } from "@/components/ui/use-toast";
import { useBreakpoints } from '@/hooks/use-mobile';

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
  const { isMobile } = useBreakpoints();

  const handleSuccess = (updatedLead?: Lead) => {
    if (updatedLead) {
      const fullName = `${updatedLead.first_name} ${updatedLead.last_name}`.trim();
      toast({
        title: "تم تحديث بيانات العميل المحتمل بنجاح",
        description: `تم تحديث بيانات "${fullName}"`,
      });
    } else {
      toast({
        title: "تم تحديث بيانات العميل المحتمل بنجاح",
      });
    }
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] max-w-none p-3 h-[90vh] overflow-y-auto' : 'sm:max-w-lg'}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تعديل بيانات العميل المحتمل</DialogTitle>
        </DialogHeader>
        <div className={`${isMobile ? 'overflow-y-auto flex-1' : 'mt-4'}`}>
          <MobileOptimizedContainer noPadding={isMobile}>
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
