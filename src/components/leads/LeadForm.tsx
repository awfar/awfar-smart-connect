
import React, { useState } from 'react';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createLead, updateLead, Lead } from "@/services/leads";
import { useLeadForm } from '@/hooks/useLeadForm';
import LeadFormFields from './LeadFormFields';
import LeadFormToolbar from './LeadFormToolbar';

interface LeadFormProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: (lead?: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const editMode = !!lead;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    formData, 
    options, 
    isLoading, 
    formErrors, 
    handleChange, 
    handleSelectChange, 
    validateForm 
  } = useLeadForm(lead);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted with data:", formData);
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Process assigned_to value
      let processedFormData = {...formData};
      if (processedFormData.assigned_to === "not-assigned") {
        processedFormData.assigned_to = null;
      }

      if (editMode && lead) {
        console.log("Updating lead:", lead.id);
        // Preserve the ID and owner properties from the original lead
        const updatedLead = await updateLead({
          ...lead,
          ...processedFormData,
          id: lead.id,
          updated_at: new Date().toISOString()
        });
        console.log("Lead updated successfully:", updatedLead);
        
        if (updatedLead) {
          // Show success toast first
          toast.success("تم تحديث العميل المحتمل بنجاح");
          
          // Then call onSuccess callback
          if (onSuccess) onSuccess(updatedLead);
          
          // Only close if no errors occurred
          if (onClose) onClose();
        } else {
          toast.error("حدث خطأ أثناء تحديث العميل المحتمل");
        }
      } else {
        console.log("Creating new lead");
        // Set current timestamp for creation
        const newLeadData = {
          ...processedFormData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log("New lead data:", newLeadData);
        const newLead = await createLead(newLeadData as Omit<Lead, "id">);
        console.log("Lead created successfully:", newLead);
        
        if (newLead) {
          // Show success toast first
          toast.success("تم إضافة العميل المحتمل بنجاح");
          
          // Then call onSuccess callback
          if (onSuccess) onSuccess(newLead);
          
          // Only close if no errors occurred
          if (onClose) onClose();
        } else {
          toast.error("حدث خطأ أثناء إنشاء العميل المحتمل");
        }
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-2 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <LeadFormFields 
        formData={formData}
        formErrors={formErrors}
        options={options}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <LeadFormToolbar 
        isSubmitting={isSubmitting}
        onClose={onClose}
        isEditMode={editMode}
      />
    </form>
  );
};

export default LeadForm;
