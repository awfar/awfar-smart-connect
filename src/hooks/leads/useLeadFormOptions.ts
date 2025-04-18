import { useState, useEffect } from 'react';
import { 
  getLeadSources, 
  getLeadStages, 
  getSalesOwners, 
  getCountries, 
  getIndustries 
} from "@/services/leads/utils";

export interface LeadFormOptions {
  sources: string[];
  stages: string[];
  owners: {id: string, name: string}[];
  countries: string[];
  industries: string[];
}

export const useLeadFormOptions = () => {
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

  const isStringArray = (data: any): data is string[] => 
    Array.isArray(data) && data.every(item => typeof item === 'string');
  
  const isOwnerArray = (data: any): data is {id: string, name: string}[] =>
    Array.isArray(data) && data.every(item => 
      typeof item === 'object' && item !== null && 
      'id' in item && 'name' in item &&
      typeof item.id === 'string' && typeof item.name === 'string');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        
        const promises = [
          getLeadSources().catch(() => options.sources),
          getLeadStages().catch(() => options.stages),
          getSalesOwners().catch(() => options.owners),
          getCountries().catch(() => options.countries),
          getIndustries().catch(() => options.industries)
        ];
        
        const [sourcesData, stagesData, ownersData, countriesData, industriesData] = await Promise.all(promises);
        
        let filteredSources: string[] = processStringArray(sourcesData, options.sources);
        let filteredStages: string[] = processStringArray(stagesData, options.stages);
        let filteredCountries: string[] = processStringArray(countriesData, options.countries);
        let filteredIndustries: string[] = processStringArray(industriesData, options.industries);
        let filteredOwners: {id: string, name: string}[] = processOwnerArray(ownersData, options.owners);
        
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const processStringArray = (data: any, defaultValue: string[]): string[] => {
    let filtered: string[] = [];
    if (isStringArray(data)) {
      filtered = data.filter(item => item.trim() !== '');
    } else if (Array.isArray(data)) {
      filtered = data
        .filter(item => item !== null && item !== undefined)
        .map(item => String(item))
        .filter(str => str.trim() !== '');
    }
    return filtered.length > 0 ? filtered : defaultValue;
  };

  const processOwnerArray = (data: any, defaultValue: {id: string, name: string}[]): {id: string, name: string}[] => {
    let filtered: {id: string, name: string}[] = [];
    
    if (isOwnerArray(data)) {
      filtered = data.filter(owner => owner.id.trim() !== '');
    } else if (Array.isArray(data)) {
      filtered = data
        .filter(item => item !== null)
        .map(item => {
          // Handle the case where item is a string
          if (typeof item === 'string') {
            return { id: '', name: '' };
          }
          
          // Handle the case where item is an object - use type assertion to avoid "never" type
          if (typeof item === 'object' && item !== null) {
            const itemObj = item as Record<string, unknown>;
            
            const id = 'id' in itemObj
              ? (typeof itemObj.id === 'string' ? itemObj.id : String(itemObj.id || ''))
              : '';
              
            const name = 'name' in itemObj
              ? (typeof itemObj.name === 'string' ? itemObj.name : String(itemObj.name || ''))
              : '';
              
            return { id, name };
          }
          
          // Default case for any other type
          return { id: '', name: '' };
        })
        .filter(owner => owner.id.trim() !== '' && owner.name.trim() !== '');
    }
    
    if (!filtered.some(owner => owner.id === 'not-assigned')) {
      filtered.unshift({ id: "not-assigned", name: "غير مخصص" });
    }
    
    return filtered.length > 0 ? filtered : defaultValue;
  };

  return { options, isLoading };
};
