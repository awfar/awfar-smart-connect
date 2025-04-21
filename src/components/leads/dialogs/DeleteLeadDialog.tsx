
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

interface DeleteLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  leadName: string;
}

const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  leadName
}) => {
  const handleConfirm = () => {
    onConfirm();
    toast.success(`تم حذف العميل المحتمل "${leadName}" بنجاح`);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف العميل المحتمل</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف العميل المحتمل "{leadName}"؟
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
