
// Functions for fetching lead data
import { supabase } from "../../integrations/supabase/client";
import { Lead } from "./types";
import { mockLeads } from "./mockData";
import { toast } from "sonner";
import { transformLeadFromSupabase } from "./utils";

// Get all leads from Supabase or fallback to mock data
export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log("Fetching leads from Supabase...");
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `);
    
    if (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
    
    // تحويل البيانات من Supabase إلى الشكل المطلوب
    if (data && data.length > 0) {
      return data.map(lead => {
        const profile = lead.profiles;
        return {
          ...lead,
          owner: profile ? {
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "غير معروف",
            avatar: "/placeholder.svg",
            initials: profile.first_name ? profile.first_name.charAt(0) : "؟"
          } : undefined
        };
      });
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    console.log("No data found in Supabase, using mock data");
    return Promise.resolve(mockLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("تعذر جلب بيانات العملاء المحتملين، جاري استخدام البيانات المحلية");
    return Promise.resolve(mockLeads);
  }
};

// Get lead by ID from Supabase or fallback to mock data
export const getLeadById = async (id: string): Promise<Lead | null> => {
  try {
    console.log(`Fetching lead with id ${id} from Supabase...`);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching lead by ID:", error);
      throw error;
    }
    
    if (data) {
      const profile = data.profiles;
      return {
        ...data,
        owner: profile ? {
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "غير معروف",
          avatar: "/placeholder.svg",
          initials: profile.first_name ? profile.first_name.charAt(0) : "؟"
        } : undefined
      };
    }
    
    // استخدام البيانات المحلية في حالة عدم وجود بيانات في Supabase
    const mockLead = mockLeads.find((lead) => lead.id === id);
    console.log("No data found in Supabase, using mock data");
    return Promise.resolve(mockLead || null);
  } catch (error) {
    console.error("Error fetching lead by ID:", error);
    // استخدام البيانات المحلية في حالة حدوث خطأ
    const mockLead = mockLeads.find((lead) => lead.id === id);
    return Promise.resolve(mockLead || null);
  }
};

// Get lead sources
export const getLeadSources = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null);
    
    if (error) throw error;
    
    // استخراج المصادر الفريدة
    const sources = data
      .map(item => item.source as string)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return sources;
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    // قائمة مصادر افتراضية
    return [
      "معرض تجاري",
      "توصية",
      "بحث إلكتروني",
      "وسائل التواصل الاجتماعي",
      "إعلان",
      "مكالمة هاتفية",
      "موقع إلكتروني",
      "شريك أعمال"
    ];
  }
};

// Get industries
export const getIndustries = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('industry')
      .not('industry', 'is', null);
    
    // التحقق من وجود خطأ في الاستعلام
    if (error) {
      console.error("Error fetching industries:", error);
      // Return default industries when there's an error
      return getDefaultIndustries();
    }
    
    // استخراج القطاعات الفريدة
    if (data && data.length > 0) {
      const industries = data
        .map(item => item.industry as string)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      return industries.length > 0 ? industries : getDefaultIndustries();
    }
    
    return getDefaultIndustries();
  } catch (error) {
    console.error("Error fetching industries:", error);
    return getDefaultIndustries();
  }
};

// Helper function to return default industries
const getDefaultIndustries = (): string[] => {
  return [
    "تكنولوجيا المعلومات",
    "الرعاية الصحية",
    "التعليم",
    "التجارة الإلكترونية",
    "المالية والمصرفية",
    "العقارات",
    "الإعلام والترفيه",
    "التصنيع",
    "الخدمات المهنية",
    "البيع بالتجزئة"
  ];
};

// Add alias for backward compatibility
export const fetchLeadById = getLeadById;
