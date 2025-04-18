
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "./types";
import { toast } from "sonner";

// Transform Supabase lead data to our Lead type
export const transformLeadFromSupabase = (data: any): Lead => {
  return {
    id: data.id || "",
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    phone: data.phone || "",
    company: data.company || "",
    position: data.position || "",
    industry: data.industry || "",
    country: data.country || "",
    status: data.status || data.stage || "جديد",
    stage: data.stage || data.status || "جديد",
    source: data.source || "",
    notes: data.notes || "",
    assigned_to: data.assigned_to || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    avatar_url: data.avatar_url || null,
    owner: data.owner ? {
      id: data.owner.id || "",
      first_name: data.owner.first_name || "",
      last_name: data.owner.last_name || "",
      name: data.owner.name || (data.owner.first_name && data.owner.last_name ? `${data.owner.first_name} ${data.owner.last_name}` : ''),
      avatar: data.owner.avatar || null,
      initials: data.owner.initials || `${data.owner.first_name?.[0] || ''}${data.owner.last_name?.[0] || ''}`
    } : undefined
  };
};

// Get color class based on lead stage
export const getStageColorClass = (stage: string): string => {
  switch(stage.toLowerCase()) {
    case 'new':
    case 'جديد':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'qualified':
    case 'مؤهل':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'negotiation':
    case 'تفاوض':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'proposal':
    case 'عرض سعر':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'won':
    case 'مغلق - فائز':
      return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
    case 'lost':
    case 'مغلق - خاسر':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Create utility functions that were missing according to the error messages
export const getLeadStages = async (): Promise<string[]> => {
  try {
    // In a real app, this would fetch from a database table
    return ["جديد", "اتصال أولي", "تفاوض", "عرض سعر", "مؤهل", "فاز", "خسر", "مؤجل"];
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    toast.error("حدث خطأ أثناء تحميل مراحل العملاء");
    return [];
  }
};

export const getLeadSources = async (): Promise<string[]> => {
  try {
    // In a real app, this would fetch from a database table
    return ["إعلان", "مواقع التواصل الاجتماعي", "التسويق الإلكتروني", "توصية من عميل", "معرض", "اتصال مباشر", "موقع الويب"];
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    toast.error("حدث خطأ أثناء تحميل مصادر العملاء");
    return [];
  }
};

export const getIndustries = async (): Promise<string[]> => {
  try {
    // In a real app, this would fetch from a database table
    return ["التكنولوجيا والاتصالات", "الرعاية الصحية", "التعليم", "العقارات", "المالية والتأمين", "التجزئة"];
  } catch (error) {
    console.error("Error fetching industries:", error);
    toast.error("حدث خطأ أثناء تحميل القطاعات");
    return [];
  }
};

export const getCountries = async (): Promise<string[]> => {
  try {
    // In a real app, this would fetch from a database table
    return ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "قطر", "الكويت", "البحرين", "عمان", "لبنان"];
  } catch (error) {
    console.error("Error fetching countries:", error);
    toast.error("حدث خطأ أثناء تحميل الدول");
    return [];
  }
};

export const getSalesOwners = async (): Promise<{id: string, name: string}[]> => {
  try {
    // In a real app, this would fetch from a database table or users table
    return [
      { id: "not-assigned", name: "غير مخصص" },
      { id: "user-1", name: "أحمد محمد" },
      { id: "user-2", name: "سارة خالد" },
      { id: "user-3", name: "محمد علي" },
    ];
  } catch (error) {
    console.error("Error fetching sales owners:", error);
    toast.error("حدث خطأ أثناء تحميل مسؤولي المبيعات");
    return [];
  }
};

export const getLeadCountByStatus = async (): Promise<Record<string, number>> => {
  try {
    // In a real app, this would query the database for counts by status
    return {
      "جديد": 12,
      "اتصال أولي": 8,
      "تفاوض": 5,
      "عرض سعر": 3,
      "مؤهل": 7,
      "فاز": 4,
      "خسر": 6,
      "مؤجل": 2
    };
  } catch (error) {
    console.error("Error fetching lead counts by status:", error);
    toast.error("حدث خطأ أثناء تحميل إحصائيات العملاء");
    return {};
  }
};

export const getTotalLeadCount = async (): Promise<number> => {
  try {
    // In a real app, this would query the database for the total count
    return 47; // Sample count
  } catch (error) {
    console.error("Error fetching total lead count:", error);
    toast.error("حدث خطأ أثناء تحميل إجمالي العملاء");
    return 0;
  }
};
