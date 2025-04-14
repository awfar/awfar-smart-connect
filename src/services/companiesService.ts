
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
  industry: string;
  type: string;
  country: string;
  phone: string;
  website: string;
  address: string;
  contacts: Contact[];
  createdAt?: string;
  status: string;
}

export interface Contact {
  name: string;
  position: string;
  email: string;
  phone?: string;
}

// Mock company data for fallback only
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "شركة الخليج للتقنية",
    industry: "tech",
    type: "customer",
    country: "sa",
    phone: "+966501234567",
    website: "www.gulftech.com",
    address: "الرياض، المملكة العربية السعودية",
    contacts: [
      {
        name: "أحمد محمد",
        position: "المدير التنفيذي",
        email: "ahmed@gulftech.com",
        phone: "+966501234567"
      }
    ],
    createdAt: "2023-01-15",
    status: "نشط"
  },
  {
    id: "2",
    name: "مستشفى النور",
    industry: "healthcare",
    type: "customer",
    country: "ae",
    phone: "+971551234567",
    website: "www.alnoor-hospital.com",
    address: "دبي، الإمارات العربية المتحدة",
    contacts: [
      {
        name: "سارة الخالد",
        position: "مدير العلاقات",
        email: "sarah@alnoor-hospital.com"
      }
    ],
    createdAt: "2023-02-20",
    status: "نشط"
  },
  {
    id: "3",
    name: "ألفا للبرمجيات",
    industry: "tech",
    type: "vendor",
    country: "sa",
    phone: "+966551234567",
    website: "www.alpha-soft.com",
    address: "جدة، المملكة العربية السعودية",
    contacts: [
      {
        name: "خالد العمري",
        position: "مدير المبيعات",
        email: "khalid@alpha-soft.com"
      }
    ],
    createdAt: "2023-03-05",
    status: "نشط"
  }
];

// Get all companies - Always try Supabase first
export const getCompanies = async (): Promise<Company[]> => {
  try {
    // Always try to fetch from Supabase first
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching companies from Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Falling back to mock company data");
        return mockCompanies;
      }
      throw error;
    }
    
    if (data && data.length > 0) {
      // Transform the Supabase data to match our Company interface
      return data.map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        contacts: [], // We'll handle contacts separately if needed
        status: company.status || "active",
        createdAt: company.created_at
      }));
    }
    
    // If no data in Supabase, use mock data only in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ No companies found in Supabase, using mock data");
      return mockCompanies;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    // Fall back to mock data only in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ Falling back to mock company data due to error");
      return mockCompanies;
    }
    return [];
  }
};

// Get company by ID - Always try Supabase first
export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    // Always try to fetch from Supabase first
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching company from Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Falling back to mock company data");
        return mockCompanies.find((company) => company.id === id) || null;
      }
      throw error;
    }
    
    if (data) {
      // Transform the Supabase data to match our Company interface
      return {
        id: data.id,
        name: data.name,
        industry: data.industry || "",
        type: data.type || "customer",
        country: data.country || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
        contacts: [], // We'll handle contacts separately if needed
        status: data.status || "active",
        createdAt: data.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    // Fall back to mock data only in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ Falling back to mock company data due to error");
      const company = mockCompanies.find((company) => company.id === id);
      return company || null;
    }
    return null;
  }
};

// Create new company - Always try to save to Supabase first
export const createCompany = async (company: Omit<Company, "id">): Promise<Company> => {
  try {
    // Always try to create in Supabase first
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        status: company.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating company in Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Falling back to mock company creation");
        const newCompany: Company = {
          id: `company-${Date.now()}`,
          ...company,
          createdAt: new Date().toISOString().split('T')[0]
        };
        mockCompanies.push(newCompany);
        toast.success("تم إضافة الشركة بنجاح (وضع تجريبي)");
        return newCompany;
      }
      throw error;
    }
    
    if (data) {
      toast.success("تم إضافة الشركة بنجاح");
      // Transform the Supabase data to match our Company interface
      return {
        id: data.id,
        name: data.name,
        industry: data.industry || "",
        type: data.type || "customer",
        country: data.country || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
        contacts: [], // We'll handle contacts separately if needed
        status: data.status || "active",
        createdAt: data.created_at
      };
    }
    
    throw new Error("Failed to create company");
  } catch (error) {
    console.error("Error creating company:", error);
    toast.error("فشل في إضافة الشركة");
    throw error;
  }
};

// Update company - Always try to update in Supabase first
export const updateCompany = async (company: Company): Promise<Company> => {
  try {
    // Always try to update in Supabase first
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        status: company.status || "active",
        updated_at: new Date().toISOString()
      })
      .eq('id', company.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating company in Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development' || company.id.startsWith('company-')) {
        console.warn("⚠️ Falling back to mock company update");
        const index = mockCompanies.findIndex((c) => c.id === company.id);
        if (index >= 0) {
          mockCompanies[index] = company;
          toast.success("تم تحديث بيانات الشركة بنجاح (وضع تجريبي)");
          return company;
        }
        throw new Error("Company not found in mock data");
      }
      throw error;
    }
    
    if (data) {
      toast.success("تم تحديث بيانات الشركة بنجاح");
      // Transform the Supabase data to match our Company interface
      return {
        id: data.id,
        name: data.name,
        industry: data.industry || "",
        type: data.type || "customer",
        country: data.country || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
        contacts: company.contacts || [], // Preserve contacts from the input
        status: data.status || "active",
        createdAt: data.created_at
      };
    }
    
    throw new Error("Failed to update company");
  } catch (error) {
    console.error("Error updating company:", error);
    toast.error("فشل في تحديث بيانات الشركة");
    throw error;
  }
};

// Delete company - Always try to delete from Supabase first
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    // Always try to delete from Supabase first
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting company from Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development' || id.startsWith('company-')) {
        console.warn("⚠️ Falling back to mock company deletion");
        const index = mockCompanies.findIndex((c) => c.id === id);
        if (index >= 0) {
          mockCompanies.splice(index, 1);
          toast.success("تم حذف الشركة بنجاح (وضع تجريبي)");
          return true;
        }
        throw new Error("Company not found in mock data");
      }
      throw error;
    }
    
    toast.success("تم حذف الشركة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
    toast.error("فشل في حذف الشركة");
    throw error;
  }
};

// Filter companies - Always try to filter in Supabase first
export const filterCompanies = async (filters: {
  industry?: string;
  country?: string;
  type?: string;
}): Promise<Company[]> => {
  try {
    // Build the Supabase query
    let query = supabase
      .from('companies')
      .select('*');
      
    // Apply filters
    if (filters.industry && filters.industry !== 'all') {
      query = query.eq('industry', filters.industry);
    }
    
    if (filters.country && filters.country !== 'all') {
      query = query.eq('country', filters.country);
    }
    
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error filtering companies in Supabase:", error);
      // Fall back to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Falling back to mock company filtering");
        let filteredCompanies = [...mockCompanies];

        if (filters.industry && filters.industry !== 'all') {
          filteredCompanies = filteredCompanies.filter(company => company.industry === filters.industry);
        }

        if (filters.country && filters.country !== 'all') {
          filteredCompanies = filteredCompanies.filter(company => company.country === filters.country);
        }

        if (filters.type && filters.type !== 'all') {
          filteredCompanies = filteredCompanies.filter(company => company.type === filters.type);
        }

        return filteredCompanies;
      }
      throw error;
    }
    
    if (data) {
      // Transform the Supabase data to match our Company interface
      return data.map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry || "",
        type: company.type || "customer",
        country: company.country || "",
        phone: company.phone || "",
        website: company.website || "",
        address: company.address || "",
        contacts: [], // We'll handle contacts separately if needed
        status: company.status || "active",
        createdAt: company.created_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error filtering companies:", error);
    // Fall back to mock data filtering only in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ Falling back to mock company filtering due to error");
      return filterMockCompanies(filters);
    }
    return [];
  }
};

// Helper function to filter mock companies
const filterMockCompanies = (filters: {
  industry?: string;
  country?: string;
  type?: string;
}): Company[] => {
  let filteredCompanies = [...mockCompanies];

  if (filters.industry && filters.industry !== 'all') {
    filteredCompanies = filteredCompanies.filter(company => company.industry === filters.industry);
  }

  if (filters.country && filters.country !== 'all') {
    filteredCompanies = filteredCompanies.filter(company => company.country === filters.country);
  }

  if (filters.type && filters.type !== 'all') {
    filteredCompanies = filteredCompanies.filter(company => company.type === filters.type);
  }

  return filteredCompanies;
};
