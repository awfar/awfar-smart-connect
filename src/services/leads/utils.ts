
// Utility function to get the color class for a lead stage
export const getStageColorClass = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'مؤهل':
    case 'qualified':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'جاري التواصل':
    case 'in progress':
    case 'in contact':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'تم التحويل':
    case 'converted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'غير مؤهل':
    case 'disqualified':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Mock data utility functions that are referenced in the codebase
export const getLeadSources = async (): Promise<string[]> => {
  return ["إعلان", "مواقع التواصل الاجتماعي", "التسويق الإلكتروني", "توصية من عميل", "معرض", "اتصال مباشر", "موقع الويب"];
};

export const getLeadStages = async (): Promise<string[]> => {
  return ["جديد", "اتصال أولي", "تفاوض", "عرض سعر", "مؤهل", "فاز", "خسر", "مؤجل"];
};

export const getSalesOwners = async (): Promise<{id: string, name: string}[]> => {
  return [
    { id: "not-assigned", name: "غير مخصص" },
    { id: "user-1", name: "أحمد محمد" },
    { id: "user-2", name: "سارة خالد" },
    { id: "user-3", name: "محمد علي" },
  ];
};

export const getCountries = async (): Promise<string[]> => {
  return ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "قطر", "الكويت", "البحرين", "عمان", "لبنان"];
};

export const getIndustries = async (): Promise<string[]> => {
  return ["التكنولوجيا والاتصالات", "الرعاية الصحية", "التعليم", "العقارات", "المالية والتأمين", "التجزئة"];
};

export const getLeadCountByStatus = async (): Promise<Record<string, number>> => {
  return {
    "جديد": 10,
    "مؤهل": 5,
    "تفاوض": 3,
    "فاز": 2,
    "خسر": 1
  };
};

export const getTotalLeadCount = async (): Promise<number> => {
  return 21;
};

// Transform function for Supabase lead data
export const transformLeadFromSupabase = (data: any): any => {
  if (!data) return null;
  
  return {
    id: data.id,
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || '',
    position: data.position || '',
    country: data.country || '',
    industry: data.industry || '',
    status: data.status || 'new',
    stage: data.stage || data.status || 'new',
    source: data.source || '',
    notes: data.notes || '',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    assigned_to: data.assigned_to || '',
    owner: data.profiles ? {
      id: data.assigned_to || '',
      name: data.profiles.first_name && data.profiles.last_name ? 
        `${data.profiles.first_name} ${data.profiles.last_name}`.trim() : 'غير مخصص',
      avatar: data.profiles.avatar_url || '',
      initials: data.profiles.first_name ? 
        (data.profiles.first_name.charAt(0) || '') + (data.profiles.last_name?.charAt(0) || '') : '؟',
      first_name: data.profiles.first_name || '',
      last_name: data.profiles.last_name || ''
    } : undefined
  };
};
