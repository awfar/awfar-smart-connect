
import { Lead, LeadDBRow } from "../types/leadTypes";
import { Owner } from "../types/commonTypes";

// Transform a lead from Supabase format to our application format
export function transformLeadFromSupabase(lead: LeadDBRow): Lead {
  // Create the owner object if profile data exists
  let owner: Owner | undefined = undefined;
  
  if (lead.profiles) {
    const firstName = lead.profiles.first_name || '';
    const lastName = lead.profiles.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || "غير معروف";
    
    owner = {
      name: fullName,
      avatar: "/placeholder.svg",
      initials: firstName ? firstName.charAt(0).toUpperCase() : "؟"
    };
  }
  
  // Return transformed lead
  return {
    ...lead,
    owner
  };
}

// Generate a display name for a lead
export function getLeadDisplayName(lead: Lead): string {
  return `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
}

// Map stage names to colors for UI display
export function getStageColorClass(stage: string): string {
  const stageLower = stage.toLowerCase();
  
  switch (stageLower) {
    case 'جديد':
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'مؤهل':
    case 'qualified':
      return 'bg-green-100 text-green-800';
    case 'فرصة':
    case 'opportunity':
      return 'bg-purple-100 text-purple-800';
    case 'عرض سعر':
    case 'quotation':
      return 'bg-yellow-100 text-yellow-800';
    case 'تفاوض':
    case 'negotiation':
      return 'bg-orange-100 text-orange-800';
    case 'مغلق':
    case 'closed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
