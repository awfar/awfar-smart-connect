
import { useLeadFormData } from './useLeadFormData';
import { useLeadFormOptions } from './useLeadFormOptions';
import { useLeadFormValidation } from './useLeadFormValidation';
import { Lead } from "@/services/leads";

export { type LeadFormOptions } from './useLeadFormOptions';

export const useLeadForm = (lead?: Lead) => {
  const { formData, setFormData, formErrors, setFormErrors, handleChange, handleSelectChange } = useLeadFormData(lead);
  const { options, isLoading } = useLeadFormOptions();
  const { validateForm } = useLeadFormValidation();

  const validateFormData = (): boolean => {
    const { isValid, errors } = validateForm(formData);
    setFormErrors(errors);
    return isValid;
  };

  return {
    formData,
    setFormData,
    options,
    isLoading,
    formErrors,
    handleChange,
    handleSelectChange,
    validateForm: validateFormData
  };
};
