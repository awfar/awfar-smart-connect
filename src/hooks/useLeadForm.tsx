
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
    sources: [],
    stages: ["جديد"],
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
        
        // جلب البيانات بشكل متسلسل لتجنب المشاكل المحتملة
        let sourcesData;
        try {
          sourcesData = await getLeadSources();
          console.log("Sources data:", sourcesData);
        } catch (error) {
          console.log("Using default sources");
          sourcesData = ["إعلان", "مواقع التواصل الاجتماعي", "التسويق الإلكتروني", "توصية من عميل", "معرض", "اتصال مباشر", "موقع الويب"];
        }
        
        let stagesData;
        try {
          stagesData = await getLeadStages();
          console.log("Using default stages");
          console.log("Stages data:", stagesData);
        } catch (error) {
          console.log("Using default stages");
          stagesData = ["جديد", "اتصال أولي", "تفاوض", "عرض سعر", "مؤهل", "فاز", "خسر", "مؤجل"];
        }
        
        let ownersData;
        try {
          ownersData = await getSalesOwners();
          console.log("Using default owners");
          console.log("Owners data:", ownersData);
        } catch (error) {
          console.log("Using default owners");
          ownersData = [
            { id: "unassigned", name: "غير مخصص" },
            { id: "user-1", name: "أحمد محمد" },
            { id: "user-2", name: "سارة خالد" },
            { id: "user-3", name: "محمد علي" },
          ];
        }
        
        let countriesData;
        try {
          countriesData = await getCountries();
          console.log("Countries data:", countriesData);
        } catch (error) {
          countriesData = [
            "المملكة العربية السعودية",
            "الإمارات العربية المتحدة",
            "قطر",
            "الكويت",
            // Add more default countries here
          ];
        }
        
        let industriesData;
        try {
          industriesData = await getIndustries();
          console.log("Industries data:", industriesData);
        } catch (error) {
          industriesData = [
            "التكنولوجيا والاتصالات",
            "الرعاية الصحية",
            "التعليم",
            "العقارات",
            // Add more default industries here
          ];
        }
        
        // Make sure all arrays are properly filtered for empty values
        const filteredSources = Array.isArray(sourcesData) ? 
          sourcesData.filter(src => src && src.trim() !== '') : [];
          
        const filteredStages = Array.isArray(stagesData) && stagesData.length > 0 ? 
          stagesData.filter(stage => stage && stage.trim() !== '') : ["جديد"];
          
        const filteredOwners = Array.isArray(ownersData) ? 
          ownersData.filter(owner => owner && owner.id && owner.name) : [];
          
        const filteredCountries = Array.isArray(countriesData) ? 
          countriesData.filter(country => country && country.trim() !== '') : [];
          
        const filteredIndustries = Array.isArray(industriesData) ? 
          industriesData.filter(industry => industry && industry.trim() !== '') : [];
        
        setOptions({
          sources: filteredSources,
          stages: filteredStages,
          owners: filteredOwners,
          countries: filteredCountries,
          industries: filteredIndustries
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
