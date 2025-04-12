
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
  createdAt: string;
  status: string;
}

export interface Contact {
  name: string;
  position: string;
  email: string;
  phone?: string;
}

// Mock company data
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

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  return Promise.resolve(mockCompanies);
};

// Get company by ID
export const getCompanyById = async (id: string): Promise<Company | null> => {
  const company = mockCompanies.find((company) => company.id === id);
  return Promise.resolve(company || null);
};

// Create new company
export const createCompany = async (company: Omit<Company, "id" | "createdAt">): Promise<Company> => {
  const newCompany: Company = {
    id: `company-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    ...company
  };
  mockCompanies.push(newCompany);
  return Promise.resolve(newCompany);
};

// Update company
export const updateCompany = async (company: Company): Promise<Company> => {
  const index = mockCompanies.findIndex((c) => c.id === company.id);
  if (index >= 0) {
    mockCompanies[index] = company;
  }
  return Promise.resolve(company);
};

// Delete company
export const deleteCompany = async (id: string): Promise<boolean> => {
  const index = mockCompanies.findIndex((c) => c.id === id);
  if (index >= 0) {
    mockCompanies.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// Filter companies
export const filterCompanies = async (filters: {
  industry?: string;
  country?: string;
  type?: string;
}): Promise<Company[]> => {
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

  return Promise.resolve(filteredCompanies);
};
