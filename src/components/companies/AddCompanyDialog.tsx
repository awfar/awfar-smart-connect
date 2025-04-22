
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompanyForm from './CompanyForm';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { createCompany } from '@/services/companiesService';

interface AddCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCompanyDialog: React.FC<AddCompanyDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();

  const handleSave = async (companyData: any) => {
    try {
      const newCompany = await createCompany(companyData);
      toast.success('تم إضافة الشركة بنجاح');
      onSuccess?.();
      onClose();
      navigate(`/dashboard/companies/${newCompany.id}`);
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('حدث خطأ أثناء إضافة الشركة');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة شركة جديدة</DialogTitle>
        </DialogHeader>
        <CompanyForm
          onCancel={onClose}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
