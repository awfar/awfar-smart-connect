
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileOptimizedContainer from '@/components/ui/mobile-optimized-container';
import LeadForm from '@/components/leads/LeadForm';
import { toast } from "@/components/ui/use-toast";
import { Lead } from "@/services/leads";
import { useBreakpoints } from '@/hooks/use-mobile';

interface AddLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (lead?: Lead) => void;
}

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const { isMobile } = useBreakpoints();

  const handleSuccess = (lead?: Lead) => {
    if (lead) {
      const fullName = `${lead.first_name} ${lead.last_name}`.trim();
      toast({
        title: "تم إضافة العميل المحتمل بنجاح",
        description: `تم إضافة "${fullName}" إلى قائمة العملاء المحتملين`,
      });
    } else {
      toast({
        title: "تم إضافة العميل المحتمل بنجاح",
      });
    }
    onSuccess(lead);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] max-w-none p-3 h-[90vh] overflow-y-auto' : 'sm:max-w-lg'}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة عميل محتمل جديد</DialogTitle>
        </DialogHeader>
        <div className={`${isMobile ? 'overflow-y-auto flex-1' : 'mt-4'}`}>
          <MobileOptimizedContainer noPadding={isMobile}>
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
