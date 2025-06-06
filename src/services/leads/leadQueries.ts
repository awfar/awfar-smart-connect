import { Lead } from "../types/leadTypes";
import { mockLeads } from "./mockData";
import { supabase } from "@/integrations/supabase/client";
import { transformLeadFromSupabase } from "./utils";
import { toast } from "sonner";

// Get all leads or filter by criteria - Improved to focus on real DB data
export const getLeads = async (filters: Record<string, any> = {}): Promise<Lead[]> => {
  try {
    console.log("Fetching leads with filters:", filters);
    
    // Build query for Supabase
    let query = supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .order('created_at', { ascending: false });
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    // Fix type instantiation issue by completely restructuring the filter application
    // Create a temporary variable to hold our query and modify it step by step
    let tempQuery = query;
    
    // Apply other filters manually without extensive chaining
    if (filters.status) {
      tempQuery = tempQuery.eq('status', filters.status);
    }
    
    if (filters.source) {
      tempQuery = tempQuery.eq('source', filters.source);
    }
    
    if (filters.industry) {
      tempQuery = tempQuery.eq('industry', filters.industry);
    }
    
    if (filters.country) {
      tempQuery = tempQuery.eq('country', filters.country);
    }
    
    // Special handling for assigned_to with current-user-id
    if (filters.assigned_to) {
      if (filters.assigned_to === 'current-user-id') {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id) {
          tempQuery = tempQuery.eq('assigned_to', authData.user.id);
        }
      } else {
        tempQuery = tempQuery.eq('assigned_to', filters.assigned_to);
      }
    }
    
    // Execute the final query with detailed error handling
    console.log("Executing Supabase query for leads...");
    const { data, error } = await tempQuery;
    
    if (error) {
      console.error("Error fetching leads from Supabase:", error);
      toast.error(`خطأ في استرداد البيانات: ${error.message}`);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`✅ Successfully fetched ${data.length} leads from Supabase database`);
      return data.map(lead => transformLeadFromSupabase(lead));
    } else {
      console.log("ℹ️ No leads found in database matching filters");
      toast.info("لم يتم العثور على أي بيانات في قاعدة البيانات");
      return [];
    }
  } catch (error) {
    console.error("Error fetching leads:", error);
    toast.error("فشل في استرداد البيانات من قاعدة البيانات");
    throw error;
  }
};

// Get a single lead by ID - Don't fall back to mock data
export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    // Always try to fetch from Supabase first, regardless of ID format
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        profiles:assigned_to (first_name, last_name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching lead from Supabase:", error);
      throw error;
    }
    
    if (data) {
      return transformLeadFromSupabase(data);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching lead with ID ${id}:`, error);
    toast.error("فشل في استرداد بيانات العميل المحتمل");
    throw error;
  }
};

// Get lead sources (to populate dropdowns, etc.)
export const getLeadSources = async (): Promise<string[]> => {
  try {
    // Default lead sources
    const defaultSources = [
      "إعلان",
      "مواقع التواصل الاجتماعي",
      "التسويق الإلكتروني",
      "توصية من عميل",
      "معرض",
      "اتصال مباشر",
      "موقع الويب"
    ];
    
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      console.log("Using default sources");
      return defaultSources;
    }
    
    // Get unique sources from database
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null)
      .not('source', 'eq', '');
    
    if (error) {
      console.error("Error fetching lead sources:", error);
      return defaultSources;
    }
    
    if (data && data.length > 0) {
      // Extract unique values
      const uniqueSources = [...new Set(data.map(item => item.source))].filter(Boolean) as string[];
      // Merge with default sources and remove duplicates
      return [...new Set([...defaultSources, ...uniqueSources])];
    }
    
    return defaultSources;
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    return [
      "إعلان",
      "مواقع التواصل الاجتماعي",
      "التسويق الإلكتروني",
      "توصية من عميل",
      "معرض",
      "اتصال مباشر",
      "موقع الويب"
    ];
  }
};

// Get lead stages (to populate dropdowns, etc.)
export const getLeadStages = async (): Promise<string[]> => {
  try {
    // Default lead stages
    const defaultStages = [
      "جديد",
      "اتصال أولي",
      "تفاوض",
      "عرض سعر",
      "مؤهل",
      "فاز",
      "خسر",
      "مؤجل"
    ];
    
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      console.log("Using default stages");
      return defaultStages;
    }
    
    // Get unique stages from database
    const { data, error } = await supabase
      .from('leads')
      .select('status')
      .not('status', 'is', null)
      .not('status', 'eq', '');
    
    if (error) {
      console.error("Error fetching lead stages:", error);
      return defaultStages;
    }
    
    if (data && data.length > 0) {
      // Extract unique values
      const uniqueStages = [...new Set(data.map(item => item.status))].filter(Boolean) as string[];
      // Merge with default stages and remove duplicates
      return [...new Set([...defaultStages, ...uniqueStages])];
    }
    
    return defaultStages;
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    return [
      "جديد",
      "اتصال أولي",
      "تفاوض",
      "عرض سعر",
      "مؤهل",
      "فاز",
      "خسر",
      "مؤجل"
    ];
  }
};

// Get sales owners (users who can be assigned to leads)
export const getSalesOwners = async (): Promise<{id: string, name: string}[]> => {
  try {
    // Default owner - unassigned option
    const defaultOwners = [
      { id: "unassigned", name: "غير مخصص" }
    ];
    
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      console.log("Using default owners");
      return [
        ...defaultOwners,
        { id: "user-1", name: "أحمد محمد" },
        { id: "user-2", name: "سارة خالد" },
        { id: "user-3", name: "محمد علي" }
      ];
    }
    
    // Get users from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');
    
    if (error) {
      console.error("Error fetching sales owners:", error);
      return defaultOwners;
    }
    
    if (data && data.length > 0) {
      // Map to the expected format
      const ownersList = data.map(profile => ({
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`.trim() || profile.id
      }));
      
      return [...defaultOwners, ...ownersList];
    }
    
    return defaultOwners;
  } catch (error) {
    console.error("Error fetching sales owners:", error);
    return [
      { id: "unassigned", name: "غير مخصص" }
    ];
  }
};

// Get countries list
export const getCountries = async (): Promise<string[]> => {
  // Return a hardcoded list of Arab countries
  return [
    "المملكة العربية السعودية",
    "الإمارات العربية المتحدة",
    "قطر",
    "الكويت",
    "البحرين",
    "عمان",
    "مصر",
    "الأردن",
    "لبنان",
    "العراق",
    "المغرب",
    "تونس",
    "الجزائر",
    "ليبيا",
    "السودان",
    "سوريا",
    "فلسطين",
    "اليمن",
    "الصومال",
    "جيبوتي",
    "جزر القمر",
    "موريتانيا"
  ];
};

// Get industries list
export const getIndustries = async (): Promise<string[]> => {
  // Return a hardcoded list of industries
  return [
    "التكنولوجيا والاتصالات",
    "الرعاية الصحية",
    "التعليم",
    "العقارات",
    "البناء والمقاولات",
    "الضيافة والفنادق",
    "النقل",
    "التجزئة",
    "البنوك والخدمات المالية",
    "النفط والغاز",
    "السيارات",
    "الأزياء والتجميل",
    "الزراعة",
    "الخدمات اللوجستية",
    "الإعلام والترفيه",
    "التصنيع",
    "الأغذية والمشروبات",
    "الرياضة",
    "السياحة والسفر",
    "الخدمات الاستشارية",
    "التأمين",
    "التسويق والإعلان",
    "الطاقة المتجددة",
    "التعدين"
  ];
};

// Get lead count by status
export const getLeadCountByStatus = async (): Promise<Record<string, number>> => {
  try {
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      // Count based on mock data
      const counts: Record<string, number> = {};
      mockLeads.forEach(lead => {
        const status = lead.status || 'غير محدد';
        if (!counts[status]) counts[status] = 0;
        counts[status]++;
      });
      return counts;
    }
    
    // Fix: Removed the call to the non-existent RPC function and replaced with direct query
    const { data, error } = await supabase
      .from('leads')
      .select('status');
    
    if (error) {
      console.error("Error fetching lead counts:", error);
      throw error;
    }
    
    if (data) {
      // Count the lead status manually
      const counts: Record<string, number> = {};
      data.forEach((lead) => {
        const status = lead.status || 'غير محدد';
        if (!counts[status]) counts[status] = 0;
        counts[status]++;
      });
      return counts;
    }
    
    return {};
  } catch (error) {
    console.error("Error fetching lead count by status:", error);
    
    // Generate mock counts
    return {
      'جديد': 12,
      'اتصال أولي': 8,
      'تفاوض': 5,
      'عرض سعر': 3,
      'مؤهل': 2,
      'فاز': 7,
      'خسر': 4
    };
  }
};

// Get total count of leads
export const getTotalLeadCount = async (): Promise<number> => {
  try {
    // Check if we should use mock data
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
    const useMockData = !userData || !userData.user;
    
    if (useMockData) {
      return mockLeads.length;
    }
    
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error fetching total lead count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error fetching total lead count:", error);
    return mockLeads.length; // Fallback to mock data length
  }
};
