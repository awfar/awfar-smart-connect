
import { LeadDBRow, Lead } from "../types/leadTypes";

/**
 * Transforms a lead from Supabase database format to the application format
 */
export const transformLeadFromSupabase = (data: LeadDBRow): Lead => {
  if (!data) return data;
  
  const owner = data.profiles ? {
    name: `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim() || 'غير مخصص',
    avatar: '',
    initials: data.profiles.first_name?.[0] || data.profiles.last_name?.[0] || 'غ'
  } : {
    name: 'غير مخصص',
    avatar: '',
    initials: 'غ'
  };
  
  // Use status as stage if provided
  const stage = data.stage || data.status;

  // Return complete lead object with consistent property naming
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || null,
    company: data.company || null,
    position: data.position || null,
    country: data.country || null,
    industry: data.industry || null,
    source: data.source || null,
    notes: data.notes || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    assigned_to: data.assigned_to || null,
    status: data.status || null,
    stage: stage || null,
    owner
  };
};

/**
 * Returns the appropriate Tailwind color class for a lead stage
 */
export const getStageColorClass = (stage: string): string => {
  const stageMap: Record<string, string> = {
    'جديد': 'bg-blue-500 hover:bg-blue-600',
    'اتصال أولي': 'bg-purple-500 hover:bg-purple-600',
    'تفاوض': 'bg-orange-500 hover:bg-orange-600',
    'عرض سعر': 'bg-yellow-500 hover:bg-yellow-600',
    'مؤهل': 'bg-emerald-500 hover:bg-emerald-600',
    'فاز': 'bg-green-500 hover:bg-green-600',
    'خسر': 'bg-red-500 hover:bg-red-600',
    'مؤجل': 'bg-gray-500 hover:bg-gray-600',
  };
  
  return stageMap[stage] || 'bg-blue-500 hover:bg-blue-600';
};

/**
 * Returns initials from a name string
 */
export const getInitials = (name: string): string => {
  if (!name) return 'غ';
  
  const parts = name.trim().split(' ');
  if (parts.length === 0 || parts[0] === '') return 'غ';
  
  if (parts.length === 1) return parts[0][0] || 'غ';
  
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
};

