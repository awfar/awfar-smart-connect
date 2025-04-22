
import { Deal, DealDBRow } from "../types/dealTypes";

export const transformDealFromSupabase = (dealData: DealDBRow): Deal => {
  // Safely extract owner info - Handle multiple potential formats
  let ownerName = "غير محدد";
  let ownerInitials = "";
  
  if (dealData.profiles) {
    if ('first_name' in dealData.profiles && dealData.profiles.first_name) {
      const firstName = dealData.profiles.first_name || "";
      const lastName = dealData.profiles.last_name || "";
      ownerName = `${firstName} ${lastName}`.trim() || "غير محدد";
      ownerInitials = `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`.toUpperCase();
    }
  }

  // Extract company name
  let companyName = undefined;
  if (dealData.companies && 'name' in dealData.companies && dealData.companies.name) {
    companyName = dealData.companies.name;
  }

  // Extract contact name
  let contactName = undefined;
  if (dealData.company_contacts && 'name' in dealData.company_contacts && dealData.company_contacts.name) {
    contactName = dealData.company_contacts.name;
  }

  // Extract lead info
  let lead = undefined;
  if (dealData.leads && 'first_name' in dealData.leads) {
    const firstName = dealData.leads.first_name || "";
    const lastName = dealData.leads.last_name || "";
    const name = `${firstName} ${lastName}`.trim();
    if (name) {
      lead = {
        id: dealData.lead_id || "",
        name,
        email: dealData.leads.email
      };
    }
  }

  return {
    id: dealData.id,
    name: dealData.name,
    description: dealData.description,
    value: dealData.value,
    stage: dealData.stage,
    status: dealData.status,
    expected_close_date: dealData.expected_close_date,
    owner_id: dealData.owner_id,
    owner: dealData.owner_id ? {
      id: dealData.owner_id,
      name: ownerName,
      initials: ownerInitials || "NA",
    } : undefined,
    company_id: dealData.company_id,
    company_name: companyName,
    lead_id: dealData.lead_id,
    lead,
    contact_id: dealData.contact_id,
    contact_name: contactName,
    created_at: dealData.created_at,
    updated_at: dealData.updated_at,
  };
};

export const getDealStageName = (stage: string): string => {
  const stageMap: Record<string, string> = {
    'discovery': 'مرحلة الاكتشاف',
    'proposal': 'تقديم العرض',
    'negotiation': 'مرحلة التفاوض',
    'closed_won': 'صفقة مربوحة',
    'closed_lost': 'صفقة خاسرة'
  };
  
  return stageMap[stage] || stage;
};

export const getDealStageBadgeColor = (stage: string): string => {
  switch (stage) {
    case 'discovery': 
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'proposal': 
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'negotiation': 
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'closed_won': 
      return 'bg-green-50 text-green-700 border-green-200';
    case 'closed_lost': 
      return 'bg-red-50 text-red-700 border-red-200';
    default: 
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getDealStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'نشط',
    'won': 'مربوح',
    'lost': 'خسارة'
  };
  
  return statusMap[status] || status;
};

export const calculateDealProgress = (stage: string): number => {
  const stageProgressMap: Record<string, number> = {
    'discovery': 20,
    'proposal': 40,
    'negotiation': 70,
    'closed_won': 100,
    'closed_lost': 0
  };
  
  return stageProgressMap[stage] || 0;
};
