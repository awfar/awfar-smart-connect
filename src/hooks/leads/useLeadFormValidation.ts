
export interface FormErrors {
  [key: string]: string;
}

export const useLeadFormValidation = () => {
  const validateForm = (formData: { 
    first_name?: string;
    last_name?: string;
    email?: string;
  }): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};
    
    if (!formData.first_name) {
      errors.first_name = "الاسم الأول مطلوب";
    }
    
    if (!formData.last_name) {
      errors.last_name = "اسم العائلة مطلوب";
    }
    
    if (!formData.email) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return { validateForm };
};
