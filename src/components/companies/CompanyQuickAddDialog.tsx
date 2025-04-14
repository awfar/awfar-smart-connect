
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCompany } from "@/services/companiesService";

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

  // Reset form when dialog opens
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
    
    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when field is changed
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
      // Use the service to create a company in the database
      const newCompany = await createCompany({
        name: formData.name,
        industry: formData.industry || "",
        website: formData.website || "",
        country: formData.country || "",
        phone: "", // Add required fields to fix the type error
        address: "", // Add required fields to fix the type error
        type: "customer",
        contacts: [],
        status: "active"
      });
      
      console.log("Company created:", newCompany);
      
      // Ensure we're passing the company name back to the parent component
      if (newCompany && newCompany.name) {
        onSuccess(newCompany.name);
        toast.success("تم إضافة الشركة بنجاح");
      } else if (formData.name) {
        // Fallback if company object doesn't have a name for some reason
        onSuccess(formData.name);
        toast.success("تم إضافة الشركة بنجاح");
      }
      
      // Close the dialog after success
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("حدث خطأ أثناء إضافة الشركة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
