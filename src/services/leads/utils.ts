
import { supabase } from "@/integrations/supabase/client";

// Function to get lead stages for filtering
export const getLeadStages = async (): Promise<string[]> => {
  try {
    // Get unique statuses from the leads table
    const { data, error } = await supabase
      .from("leads")
      .select("status")
      .not("status", "is", null);

    if (error) throw error;

    // Extract unique statuses
    const stages = Array.from(new Set(data.map(item => item.status)));
    return stages.length ? stages : ["جديد", "اتصال أولي", "مؤهل", "عرض سعر", "تفاوض", "فاز", "خسر"];
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    return ["جديد", "اتصال أولي", "مؤهل", "عرض سعر", "تفاوض", "فاز", "خسر"];
  }
};

// Function to get lead sources for filtering
export const getLeadSources = async (): Promise<string[]> => {
  try {
    // Get unique sources from the leads table
    const { data, error } = await supabase
      .from("leads")
      .select("source")
      .not("source", "is", null);

    if (error) throw error;

    // Extract unique sources
    const sources = Array.from(new Set(data.map(item => item.source)));
    return sources.length ? sources : ["إعلان", "موقع الويب", "توصية", "معرض", "وسائل التواصل الاجتماعي"];
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    return ["إعلان", "موقع الويب", "توصية", "معرض", "وسائل التواصل الاجتماعي"];
  }
};

// Function to get countries for filtering
export const getCountries = async (): Promise<string[]> => {
  try {
    // Get unique countries from the leads table
    const { data, error } = await supabase
      .from("leads")
      .select("country")
      .not("country", "is", null);

    if (error) throw error;

    // Extract unique countries
    const countries = Array.from(new Set(data.map(item => item.country)));
    return countries.length ? countries : ["السعودية", "الإمارات", "قطر", "الكويت", "البحرين", "عمان"];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return ["السعودية", "الإمارات", "قطر", "الكويت", "البحرين", "عمان"];
  }
};

// Function to get industries for filtering
export const getIndustries = async (): Promise<string[]> => {
  try {
    // Get unique industries from the leads table
    const { data, error } = await supabase
      .from("leads")
      .select("industry")
      .not("industry", "is", null);

    if (error) throw error;

    // Extract unique industries
    const industries = Array.from(new Set(data.map(item => item.industry)));
    return industries.length ? industries : ["تكنولوجيا المعلومات", "الصحة", "التعليم", "التجزئة", "الخدمات المالية"];
  } catch (error) {
    console.error("Error fetching industries:", error);
    return ["تكنولوجيا المعلومات", "الصحة", "التعليم", "التجزئة", "الخدمات المالية"];
  }
};

// Function to get sales owners for filtering
export const getSalesOwners = async (): Promise<{id: string, name: string}[]> => {
  try {
    // Get users who are assigned to leads
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("is_active", true);

    if (error) throw error;

    return data.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.id
    }));
  } catch (error) {
    console.error("Error fetching sales owners:", error);
    return [
      { id: "1", name: "أحمد محمد" },
      { id: "2", name: "سارة أحمد" },
      { id: "3", name: "محمد علي" }
    ];
  }
};

// Function to get lead count by status
export const getLeadCountByStatus = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("status");

    if (error) throw error;

    // Count leads by status
    const counts: Record<string, number> = {};
    data.forEach(lead => {
      const status = lead.status || "غير معروف";
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error("Error fetching lead counts by status:", error);
    return {};
  }
};

// Function to get total lead count
export const getTotalLeadCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error("Error fetching total lead count:", error);
    return 0;
  }
};

// Function to get color class based on lead stage
export const getStageColorClass = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'مؤهل':
    case 'qualified':
      return 'bg-green-100 text-green-800';
    case 'تفاوض':
    case 'negotiation':
      return 'bg-purple-100 text-purple-800';
    case 'عرض سعر':
    case 'proposal':
      return 'bg-indigo-100 text-indigo-800';
    case 'فاز':
    case 'won':
      return 'bg-emerald-100 text-emerald-800';
    case 'خسر':
    case 'lost':
      return 'bg-red-100 text-red-800';
    case 'مؤجل':
    case 'deferred':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to transform lead data from Supabase
export const transformLeadFromSupabase = (leadData: any): any => {
  // Add any necessary transformations here
  return {
    ...leadData,
    // Ensure stage is always available (fall back to status)
    stage: leadData.stage || leadData.status || 'جديد'
  };
};
