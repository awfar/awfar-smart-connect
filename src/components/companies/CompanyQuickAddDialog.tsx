import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCompany } from "@/services/companies";
import { Company } from "@/services/companies";

interface CompanyQuickAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (companyName: string) => void;
}

interface CompanyFormData {
  name: string;
  industry?: string;
  website?: string;
  country?: string;
}

const CompanyQuickAddDialog: React.FC<CompanyQuickAddDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "" });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) {
      errors.name = "اسم الشركة مطلوب";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const newCompany = await createCompany({
        name: formData.name,
        industry: formData.industry || "",
        website: formData.website || "",
        country: formData.country || "",
        phone: "",
        address: "",
        type: "customer",
        contacts: [],
        status: "active"
      });
      
      console.log("Company created:", newCompany);
      
      if (newCompany?.name) {
        toast.success(`تم إضافة الشركة "${newCompany.name}" بنجاح`);
        setTimeout(() => {
          onSuccess(newCompany.name);
          onOpenChange(false);
        }, 100);
      } else if (formData.name) {
        toast.success(`تم إضافة الشركة "${formData.name}" بنجاح`);
        setTimeout(() => {
          onSuccess(formData.name);
          onOpenChange(false);
        }, 100);
      }
      
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("حدث خطأ أثناء إضافة الشركة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة شركة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم الشركة *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? "border-red-500" : ""}
              autoFocus
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="website">الموقع الإلكتروني</Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyQuickAddDialog;
