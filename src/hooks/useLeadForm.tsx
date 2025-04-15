
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
    assigned_to: lead?.assigned_to || null, // Changed from "not-assigned" to null
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
    countries: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "قطر", "الكويت", "البحرين", "عمان", "لبنان"],
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
        
        // Type guards to ensure we have the right data types - fixed TS errors
        const isStringArray = (data: any): data is string[] => 
          Array.isArray(data) && data.every(item => typeof item === 'string');
        
        const isOwnerArray = (data: any): data is {id: string, name: string}[] =>
          Array.isArray(data) && data.every(item => 
            typeof item === 'object' && item !== null && 
            'id' in item && 'name' in item &&
            typeof item.id === 'string' && typeof item.name === 'string');
        
        // Process and filter sources data - ensuring string type
        let filteredSources: string[] = [];
        if (isStringArray(sourcesData)) {
          filteredSources = sourcesData.filter(src => src.trim() !== '');
        } else if (Array.isArray(sourcesData)) {
          // Try to convert any non-string items to strings
          filteredSources = sourcesData
            .filter(item => item !== null && item !== undefined)
            .map(item => String(item))
            .filter(str => str.trim() !== '');
        }
        if (filteredSources.length === 0) filteredSources = options.sources;
        
        // Process and filter stages data - ensuring string type
        let filteredStages: string[] = [];
        if (isStringArray(stagesData)) {
          filteredStages = stagesData.filter(stage => stage.trim() !== '');
        } else if (Array.isArray(stagesData)) {
          // Try to convert any non-string items to strings
          filteredStages = stagesData
            .filter(item => item !== null && item !== undefined)
            .map(item => String(item))
            .filter(str => str.trim() !== '');
        }
        if (filteredStages.length === 0) filteredStages = ["جديد"];
        
        // Process and filter owners data - ensuring proper structure
        let filteredOwners: {id: string, name: string}[] = [];
        if (isOwnerArray(ownersData)) {
          filteredOwners = ownersData.filter(owner => owner.id.trim() !== '');
        } else if (Array.isArray(ownersData)) {
          // Fixed: Correctly process owner items with proper type checking and null safety
          filteredOwners = ownersData
            .filter((item): item is NonNullable<typeof item> => item !== null && typeof item === 'object')
            .map(item => {
              // Access properties safely with proper type checking
              if ('id' in item && 'name' in item) {
                // Safely extract id and name values as strings
                const id = typeof item.id === 'string' ? item.id : String(item.id ?? '');
                const name = typeof item.name === 'string' ? item.name : String(item.name ?? '');
                
                // Only proceed if both id and name are valid strings
                if (id.trim() !== '' && name.trim() !== '') {
                  return {
                    id,
                    name
                  };
                }
              }
              return null;
            })
            // Filter out any null entries
            .filter((item): item is {id: string, name: string} => item !== null);
        }
        
        // Always ensure "not-assigned" option is available
        if (!filteredOwners.some(owner => owner.id === 'not-assigned')) {
          filteredOwners.unshift({ id: "not-assigned", name: "غير مخصص" });
        }
        if (filteredOwners.length === 0) filteredOwners = options.owners;
        
        // Process and filter countries data - ensuring string type
        let filteredCountries: string[] = [];
        if (isStringArray(countriesData)) {
          filteredCountries = countriesData.filter(country => country.trim() !== '');
        } else if (Array.isArray(countriesData)) {
          // Try to convert any non-string items to strings
          filteredCountries = countriesData
            .filter(item => item !== null && item !== undefined)
            .map(item => String(item))
            .filter(str => str.trim() !== '');
        }
        if (filteredCountries.length === 0) filteredCountries = options.countries;
        
        // Process and filter industries data - ensuring string type
        let filteredIndustries: string[] = [];
        if (isStringArray(industriesData)) {
          filteredIndustries = industriesData.filter(industry => industry.trim() !== '');
        } else if (Array.isArray(industriesData)) {
          // Try to convert any non-string items to strings
          filteredIndustries = industriesData
            .filter(item => item !== null && item !== undefined)
            .map(item => String(item))
            .filter(str => str.trim() !== '');
        }
        if (filteredIndustries.length === 0) filteredIndustries = options.industries;
        
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
    
    // Special handling for assigned_to field
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
