
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createLead, updateLead, Lead } from "@/services/leads";
import { useLeadForm } from '@/hooks/useLeadForm';
import LeadFormFields from './LeadFormFields';
import LeadFormToolbar from './LeadFormToolbar';
import { supabase } from "@/integrations/supabase/client";

interface LeadFormProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: (lead?: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const editMode = !!lead;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
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
    setDbError(null);
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (editMode && lead) {
        console.log("Updating lead:", lead.id);
        // Preserve the ID and owner properties from the original lead
        const updatedLead = await updateLead({
          ...lead,
          ...formData,
          id: lead.id,
          updated_at: new Date().toISOString()
        });
        console.log("Lead updated successfully:", updatedLead);
        
        if (updatedLead) {
          toast.success("تم تحديث العميل المحتمل بنجاح");
          
          if (onSuccess) {
            // Pass the updated lead to the success handler
            onSuccess(updatedLead);
          }
          
          if (onClose) onClose();
        } else {
          setDbError("فشل في تحديث العميل المحتمل - لم يتم استلام بيانات التحديث");
          toast.error("حدث خطأ أثناء تحديث العميل المحتمل");
        }
      } else {
        console.log("Creating new lead with data:", formData);
        
        // Set current timestamp for creation
        const newLeadData = {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add debug logging before creating lead
        console.log("About to create lead with this data:", JSON.stringify(newLeadData));
        
        // Check Supabase auth status for debugging
        const { data: authData } = await supabase.auth.getSession();
        console.log("Current auth session:", authData);
        
        try {
          const newLead = await createLead(newLeadData as Omit<Lead, "id">);
          
          console.log("Lead creation response:", newLead);
          
          if (newLead) {
            toast.success("تم إضافة العميل المحتمل بنجاح");
            
            // Verify lead was actually inserted to database
            console.log("Verifying lead in database with ID:", newLead.id);
            
            if (onSuccess) {
              // Pass the new lead to the success handler
              onSuccess(newLead);
            }
            
            if (onClose) onClose();
          } else {
            setDbError("فشل في إنشاء العميل المحتمل - لم يتم استلام بيانات الإنشاء");
            throw new Error("No lead data returned from creation");
          }
        } catch (innerError) {
          console.error("Inner error creating lead:", innerError);
          setDbError(innerError instanceof Error ? innerError.message : "خطأ غير معروف");
          toast.error("فشل في إنشاء العميل المحتمل");
        }
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setDbError(error instanceof Error ? error.message : "خطأ غير معروف");
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
      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
          <p className="font-semibold">خطأ في قاعدة البيانات:</p>
          <p className="text-sm">{dbError}</p>
        </div>
      )}
      
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
