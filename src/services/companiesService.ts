
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  city: string;
  website: string;
  status: string;
  subscription: string;
  contacts: number;
  account_manager?: {
    name: string;
    avatar: string;
    initials: string;
  };
  created_at: string;
}

export interface CompanyFilters {
  status?: string;
  industry?: string;
  country?: string;
  subscription?: string;
  manager?: string;
}

// In a real implementation, this would be connected to actual database tables
// Since we don't have a companies table in Supabase yet, we'll use mock data
export const fetchCompanies = async (filters?: CompanyFilters): Promise<Company[]> => {
  // This is a placeholder that would connect to Supabase
  // For now, returning mock data
  const mockCompanies = [
    {
      id: "comp-001",
      name: "شركة التقنية الحديثة",
      industry: "تكنولوجيا المعلومات",
      size: "متوسطة (50-200 موظف)",
      country: "مصر",
      city: "القاهرة",
      website: "tech-modern.com",
      status: "عميل",
      subscription: "متقدمة",
      contacts: 4,
      account_manager: {
        name: "أحمد محمد",
        avatar: "/placeholder.svg",
        initials: "أم"
      },
      created_at: "2023-01-15"
    },
    {
      id: "comp-002",
      name: "كافيه الأصدقاء",
      industry: "مطاعم ومقاهي",
      size: "صغيرة (>50 موظف)",
      country: "السعودية",
      city: "الرياض",
      website: "friends-cafe.com",
      status: "فرصة",
      subscription: "أساسية",
      contacts: 2,
      account_manager: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        initials: "سأ"
      },
      created_at: "2023-02-03"
    },
    {
      id: "comp-003",
      name: "صيدليات الشفاء",
      industry: "الرعاية الصحية",
      size: "كبيرة (>200 موظف)",
      country: "الإمارات",
      city: "دبي",
      website: "alshifa-pharm.com",
      status: "عميل",
      subscription: "احترافية",
      contacts: 5,
      account_manager: {
        name: "محمود عبد الله",
        avatar: "/placeholder.svg",
        initials: "مع"
      },
      created_at: "2023-03-20"
    },
    {
      id: "comp-004",
      name: "متاجر الأناقة",
      industry: "تجزئة",
      size: "متوسطة (50-200 موظف)",
      country: "مصر",
      city: "الإسكندرية",
      website: "elegance-stores.com",
      status: "محتمل",
      subscription: "تجريبية",
      contacts: 3,
      account_manager: {
        name: "نورا سعيد",
        avatar: "/placeholder.svg",
        initials: "نس"
      },
      created_at: "2023-04-12"
    },
    {
      id: "comp-005",
      name: "مطاعم الذواقة",
      industry: "مطاعم ومقاهي",
      size: "كبيرة (>200 موظف)",
      country: "السعودية",
      city: "جدة",
      website: "gourmet-restaurants.com",
      status: "عميل",
      subscription: "متقدمة",
      contacts: 6,
      account_manager: {
        name: "خالد محمود",
        avatar: "/placeholder.svg",
        initials: "خم"
      },
      created_at: "2023-05-07"
    },
  ];
  
  // Apply mock filters
  let filteredCompanies = [...mockCompanies];
  
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => c.status === filters.status);
    }
    
    if (filters.industry && filters.industry !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => c.industry === filters.industry);
    }
    
    if (filters.country && filters.country !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => c.country === filters.country);
    }
    
    if (filters.subscription && filters.subscription !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => c.subscription === filters.subscription);
    }
    
    if (filters.manager && filters.manager !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => c.account_manager?.name === filters.manager);
    }
  }
  
  return Promise.resolve(filteredCompanies);
};

export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  const companies = await fetchCompanies();
  const company = companies.find(c => c.id === id);
  return company || null;
};
