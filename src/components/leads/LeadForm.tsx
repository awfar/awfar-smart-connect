
import React, { useState, useEffect } from 'react';
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
        
        toast.success("تم تحديث العميل المحتمل بنجاح");
        
        if (updatedLead) {
          if (onSuccess) {
            // Short delay to ensure UI updates after confirmation toast
            setTimeout(() => {
              onSuccess(updatedLead);
            }, 300);
          }
          
          if (onClose) onClose();
        } else {
          toast.error("حدث خطأ أثناء تحديث العميل المحتمل");
        }
      } else {
        console.log("Creating new lead with data:", processedFormData);
        
        // Set current timestamp for creation
        const newLeadData = {
          ...processedFormData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        try {
          // Add debug logging before creating lead
          console.log("About to create lead with this data:", JSON.stringify(newLeadData));
          
          const newLead = await createLead(newLeadData as Omit<Lead, "id">);
          console.log("Lead created successfully:", newLead);
          
          toast.success("تم إضافة العميل المحتمل بنجاح");
          
          if (newLead) {
            if (onSuccess) {
              // Increased delay to ensure UI updates after confirmation toast
              setTimeout(() => {
                onSuccess(newLead);
              }, 500);
            }
            
            if (onClose) onClose();
          } else {
            throw new Error("No lead data returned from creation");
          }
        } catch (innerError) {
          console.error("Inner error creating lead:", innerError);
          toast.error("فشل في إنشاء العميل المحتمل");
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
