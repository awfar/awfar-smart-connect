
import { useState, useEffect } from 'react';
import { 
  getLeadSources, 
  getLeadStages, 
  getSalesOwners, 
  getCountries, 
  getIndustries,
  Lead
} from "@/services/leads";
import { toast } from "sonner";

export interface LeadFormOptions {
  sources: string[];
  stages: string[];
  owners: {id: string, name: string}[];
  countries: string[];
  industries: string[];
}

export const useLeadForm = (lead?: Lead) => {
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
    assigned_to: lead?.assigned_to || "",
    country: lead?.country || "",
    industry: lead?.industry || "",
    created_at: lead?.created_at || new Date().toISOString(),
    updated_at: lead?.updated_at || new Date().toISOString(),
  });

  // State for dropdown options
  const [options, setOptions] = useState<LeadFormOptions>({
    sources: [],
    stages: [],
    owners: [],
    countries: [],
    industries: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch options for dropdown menus
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [sourcesData, stagesData, ownersData, countriesData, industriesData] = await Promise.all([
          getLeadSources(),
          getLeadStages(),
          getSalesOwners(),
          getCountries(),
          getIndustries()
        ]);
        
        setOptions({
          sources: Array.isArray(sourcesData) ? sourcesData : [],
          stages: Array.isArray(stagesData) ? stagesData : [],
          owners: Array.isArray(ownersData) ? ownersData : [],
          countries: Array.isArray(countriesData) ? countriesData : [],
          industries: Array.isArray(industriesData) ? industriesData : []
        });
      } catch (error) {
        console.error("Error fetching form options:", error);
        toast.error("فشل في تحميل خيارات النموذج");
        // Initialize with empty arrays as fallback
        setOptions({
          sources: [],
          stages: ["جديد"],
          owners: [],
          countries: [],
          industries: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    setFormData,
    options,
    isLoading,
    formErrors,
    handleChange,
    handleSelectChange,
    validateForm
  };
};
