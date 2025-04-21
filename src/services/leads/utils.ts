
import { LeadDBRow, Lead } from './types';

// Colors for lead stages
export const getStageColorClass = (stage: string): string => {
  switch (stage) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'مؤهل':
    case 'qualified':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'تم التواصل':
    case 'contacted':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'مهتم':
    case 'interested':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'مفاوضات':
    case 'negotiation':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'مغلق/مربح':
    case 'won':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'مغلق/خاسر':
    case 'lost':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Transform lead data from Supabase format to our app format
export const transformLeadFromSupabase = (data: LeadDBRow | null): Lead | null => {
  if (!data) return null;
  
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || undefined,
    company: data.company || undefined,
    position: data.position || undefined,
    country: data.country || undefined,
    industry: data.industry || undefined,
    status: data.status || 'new',
    stage: data.stage || data.status || 'new',
    source: data.source || undefined,
    notes: data.notes || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    assigned_to: data.assigned_to || undefined,
    avatar_url: data.avatar_url || undefined,
    owner: data.profiles ? {
      first_name: data.profiles.first_name || undefined,
      last_name: data.profiles.last_name || undefined,
      initials: data.profiles.first_name?.charAt(0) || '?'
    } : undefined
  };
};

// Options for lead forms and filters
export const getLeadSources = () => {
  return [
    { value: 'website', label: 'الموقع الإلكتروني' },
    { value: 'referral', label: 'إحالة' },
    { value: 'social_media', label: 'وسائل التواصل الاجتماعي' },
    { value: 'email_campaign', label: 'حملة بريدية' },
    { value: 'conference', label: 'مؤتمر' },
    { value: 'cold_call', label: 'اتصال مباشر' },
    { value: 'other', label: 'أخرى' },
  ];
};

export const getLeadStages = () => {
  return [
    { value: 'new', label: 'جديد' },
    { value: 'contacted', label: 'تم التواصل' },
    { value: 'qualified', label: 'مؤهل' },
    { value: 'interested', label: 'مهتم' },
    { value: 'negotiation', label: 'مفاوضات' },
    { value: 'won', label: 'مغلق/مربح' },
    { value: 'lost', label: 'مغلق/خاسر' },
  ];
};

export const getSalesOwners = async () => {
  // In a real implementation, this would fetch users from the database
  // For now, returning mock data
  return [
    { value: 'user1', label: 'محمد علي' },
    { value: 'user2', label: 'أحمد خالد' },
    { value: 'user3', label: 'سارة محمد' },
    { value: 'user4', label: 'فاطمة أحمد' },
  ];
};

export const getCountries = () => {
  return [
    { value: 'sa', label: 'المملكة العربية السعودية' },
    { value: 'ae', label: 'الإمارات العربية المتحدة' },
    { value: 'kw', label: 'الكويت' },
    { value: 'qa', label: 'قطر' },
    { value: 'bh', label: 'البحرين' },
    { value: 'om', label: 'عمان' },
    { value: 'eg', label: 'مصر' },
    { value: 'jo', label: 'الأردن' },
    { value: 'other', label: 'دولة أخرى' },
  ];
};

export const getIndustries = () => {
  return [
    { value: 'technology', label: 'تكنولوجيا المعلومات' },
    { value: 'healthcare', label: 'الرعاية الصحية' },
    { value: 'finance', label: 'الخدمات المالية' },
    { value: 'education', label: 'التعليم' },
    { value: 'retail', label: 'التجزئة' },
    { value: 'manufacturing', label: 'التصنيع' },
    { value: 'real_estate', label: 'العقارات' },
    { value: 'hospitality', label: 'الضيافة' },
    { value: 'consulting', label: 'الاستشارات' },
    { value: 'other', label: 'أخرى' },
  ];
};

// Statistical utilities for leads
export const getLeadCountByStatus = async () => {
  // In a real implementation, this would query the database
  // For now, returning mock data
  return {
    new: 45,
    contacted: 25,
    qualified: 15,
    interested: 10,
    negotiation: 8,
    won: 12,
    lost: 7,
  };
};

export const getTotalLeadCount = async () => {
  // In a real implementation, this would query the database
  // For now, returning mock data
  return 122;
};
