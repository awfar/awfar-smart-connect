
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
    assigned_to: lead?.assigned_to || "not-assigned",
    country: lead?.country || "",
    industry: lead?.industry || "",
    created_at: lead?.created_at || new Date().toISOString(),
    updated_at: lead?.updated_at || new Date().toISOString(),
  });

  // State for dropdown options
  const [options, setOptions] = useState<LeadFormOptions>({
    sources: ["إعلان", "مواقع التواصل الاجتماعي", "التسويق الإلكتروني", "توصية من عميل", "معرض", "اتصال مباشر", "موقع الويب"],
    stages: ["جديد", "اتصال أولي", "تفاوض", "عرض سعر", "مؤهل", "فاز", "خسر", "مؤجل"],
    owners: [
      { id: "not-assigned", name: "غير مخصص" },
      { id: "user-1", name: "أحمد محمد" },
      { id: "user-2", name: "سارة خالد" },
      { id: "user-3", name: "محمد علي" },
    ],
    countries: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "قطر", "الكويت", "البحرين", "عمان"],
    industries: ["التكنولوجيا والاتصالات", "الرعاية الصحية", "التعليم", "العقارات", "المالية والتأمين", "التجزئة"]
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch options for dropdown menus
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        
        // Create an array of promises for parallel fetching
        const promises = [
          getLeadSources().catch(() => options.sources),
          getLeadStages().catch(() => options.stages),
          getSalesOwners().catch(() => options.owners),
          getCountries().catch(() => options.countries),
          getIndustries().catch(() => options.industries)
        ];
        
        // Wait for all promises to resolve
        const [sourcesData, stagesData, ownersData, countriesData, industriesData] = await Promise.all(promises);
        
        // Process and filter sources data
        const filteredSources = Array.isArray(sourcesData) && sourcesData.length > 0 ? 
          sourcesData.filter((src): src is string => typeof src === 'string' && src.trim() !== '') : 
          options.sources;
          
        // Process and filter stages data
        const filteredStages = Array.isArray(stagesData) && stagesData.length > 0 ? 
          stagesData.filter((stage): stage is string => typeof stage === 'string' && stage.trim() !== '') : 
          options.stages;
          
        // Process and filter owners data
        const filteredOwners = Array.isArray(ownersData) && ownersData.length > 0 ? 
          ownersData.filter((owner): owner is {id: string, name: string} => 
            owner && typeof owner === 'object' && 'id' in owner && 'name' in owner) : 
          options.owners;
          
        // Process and filter countries data
        const filteredCountries = Array.isArray(countriesData) && countriesData.length > 0 ? 
          countriesData.filter((country): country is string => typeof country === 'string' && country.trim() !== '') : 
          options.countries;
          
        // Process and filter industries data
        const filteredIndustries = Array.isArray(industriesData) && industriesData.length > 0 ? 
          industriesData.filter((industry): industry is string => typeof industry === 'string' && industry.trim() !== '') : 
          options.industries;
        
        // Make sure there's always at least a default option
        if (filteredStages.length === 0) filteredStages.push("جديد");
        
        // Update options state with filtered data
        setOptions({
          sources: filteredSources,
          stages: filteredStages,
          owners: filteredOwners,
          countries: filteredCountries,
          industries: filteredIndustries
        });
        
        console.log("Form options loaded successfully:", {
          sources: filteredSources.length,
          stages: filteredStages.length,
          owners: filteredOwners.length,
          countries: filteredCountries.length,
          industries: filteredIndustries.length
        });
      } catch (error) {
        console.error("Error fetching form options:", error);
        // Keep using default options if fetching fails
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
    console.log(`Setting ${name} to:`, value);
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
