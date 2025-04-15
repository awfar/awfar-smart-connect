
import { useState } from 'react';
import { Lead } from "@/services/leads";
import { FormErrors } from './useLeadFormValidation';

export const useLeadFormData = (lead?: Lead) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    company: lead?.company || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    position: lead?.position || "",
    source: lead?.source || "",
    status: lead?.status || lead?.stage || "جديد",
    notes: lead?.notes || "",
    assigned_to: lead?.assigned_to || null,
    country: lead?.country || "",
    industry: lead?.industry || "",
    created_at: lead?.created_at || new Date().toISOString(),
    updated_at: lead?.updated_at || new Date().toISOString(),
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Setting ${name} to:`, value);
    
    if (name === "assigned_to") {
      const assignedValue = value === "not-assigned" ? null : value;
      setFormData(prev => ({
        ...prev,
        [name]: assignedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    handleChange,
    handleSelectChange
  };
};
