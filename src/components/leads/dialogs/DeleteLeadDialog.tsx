
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Lead } from "@/services/leads";

interface DeleteLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  lead?: Lead | null;
}

const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  lead
}) => {
  const handleConfirm = () => {
    onConfirm();
    if (lead) {
      const fullName = `${lead.first_name} ${lead.last_name}`.trim();
      toast.success(`تم حذف العميل المحتمل "${fullName}" بنجاح`);
    } else {
      toast.success("تم حذف العميل المحتمل بنجاح");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف العميل المحتمل</AlertDialogTitle>
          <AlertDialogDescription>
            {lead ? (
              <>هل أنت متأكد من رغبتك في حذف العميل المحتمل "{lead.first_name} {lead.last_name}"؟</>
            ) : (
              <>هل أنت متأكد من رغبتك في حذف هذا العميل المحتمل؟</>
            )}
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-red-600">
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLeadDialog;
