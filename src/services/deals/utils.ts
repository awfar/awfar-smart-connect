
import { Deal, DealDBRow } from "../types/dealTypes";

// Format deal stage names for display
export const getDealStageName = (stage: string): string => {
  const stageNames: Record<string, string> = {
    discovery: "مرحلة الاكتشاف",
    proposal: "تقديم العرض",
    negotiation: "التفاوض",
    closed_won: "مربوح",
    closed_lost: "خسارة"
  };
  
  return stageNames[stage] || stage;
};

// Get color for deal stage badges
export const getDealStageBadgeColor = (stage: string): string => {
  const stageColors: Record<string, string> = {
    discovery: "text-blue-700 border-blue-200 bg-blue-100",
    proposal: "text-purple-700 border-purple-200 bg-purple-100",
    negotiation: "text-amber-700 border-amber-200 bg-amber-100",
    closed_won: "text-green-700 border-green-200 bg-green-100",
    closed_lost: "text-red-700 border-red-200 bg-red-100"
  };
  
  return stageColors[stage] || "";
};

// Transform deal data from Supabase to frontend format with improved type safety
export const transformDealFromSupabase = (deal: DealDBRow): Deal => {
  // Safely handle contact name
  let contactName = deal.contact_id && deal.company_contacts ? deal.company_contacts.name : undefined;
  
  // Improved handling of owner initials with null safety
  const ownerInitials = deal.profiles && typeof deal.profiles === 'object' ? 
    `${(deal.profiles.first_name || '')[0] || ''}${(deal.profiles.last_name || '')[0] || ''}`.toUpperCase() 
    : '';
    
  return {
    id: deal.id,
    name: deal.name,
    description: deal.description,
    value: deal.value,
    stage: deal.stage,
    status: deal.status,
    expected_close_date: deal.expected_close_date,
    owner_id: deal.owner_id,
    owner: deal.owner_id && deal.profiles && typeof deal.profiles === 'object' ? {
      id: deal.owner_id,
      name: `${deal.profiles.first_name || ''} ${deal.profiles.last_name || ''}`.trim(),
      initials: ownerInitials || '??',
    } : undefined,
    company_id: deal.company_id,
    company_name: deal.companies?.name,
    lead_id: deal.lead_id,
    lead: deal.lead_id && deal.leads ? {
      id: deal.lead_id,
      first_name: deal.leads.first_name || '',
      last_name: deal.leads.last_name || '',
      email: deal.leads.email || '',
      status: 'active',  // Default value for required Lead properties
      created_at: deal.created_at || new Date().toISOString(),
      updated_at: deal.updated_at || new Date().toISOString()
    } : undefined,
    contact_id: deal.contact_id,
    contact_name: contactName,
    created_at: deal.created_at,
    updated_at: deal.updated_at
  };
};

// Calculate deal progress percentage based on stage
export const calculateDealProgress = (stage: string): number => {
  const stageProgress: Record<string, number> = {
    discovery: 25,
    proposal: 50,
    negotiation: 75,
    closed_won: 100,
    closed_lost: 0
  };
  
  return stageProgress[stage] || 0;
};

// Format deal status names for display
export const getDealStatusName = (status: string): string => {
  const statusNames: Record<string, string> = {
    active: "نشط",
    won: "مربوح",
    lost: "خسارة"
  };
  
  return statusNames[status] || status;
};
