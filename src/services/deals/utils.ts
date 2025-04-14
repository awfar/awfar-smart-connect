
import { Deal, DealDBRow } from "../types/dealTypes";

export const transformDealFromSupabase = (deal: DealDBRow): Deal => {
  // Handle profiles safely
  let fullName = '';
  
  if (deal.profiles && 
      !('error' in deal.profiles) && 
      typeof deal.profiles === 'object' && 
      'first_name' in deal.profiles) {
    fullName = `${deal.profiles.first_name || ''} ${deal.profiles.last_name || ''}`.trim();
  }
  
  return {
    id: deal.id,
    name: deal.name,
    description: deal.description,
    value: deal.value,
    stage: deal.stage,
    status: deal.status,
    expected_close_date: deal.expected_close_date,
    owner_id: deal.owner_id,
    owner: deal.owner_id ? {
      id: deal.owner_id,
      name: fullName || 'غير معين',
      initials: getInitials(fullName || 'غير معين'),
    } : undefined,
    company_id: deal.company_id,
    company_name: deal.companies && !('error' in deal.companies) ? deal.companies.name : undefined,
    contact_id: deal.contact_id,
    contact_name: deal.company_contacts && !('error' in deal.company_contacts) ? deal.company_contacts.name : undefined,
    created_at: deal.created_at,
    updated_at: deal.updated_at,
    lead_id: deal.lead_id
  };
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const getStageColorClass = (stage: string): string => {
  switch (stage.toLowerCase()) {
    case 'جديد':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'مؤهل':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'عرض سعر':
      return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
    case 'تفاوض':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'مغلق مكسب':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'مغلق خسارة':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'مؤجل':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};
