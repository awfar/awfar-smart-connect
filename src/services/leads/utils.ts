
import { Lead, LeadDBRow } from "../types/leadTypes";

// Helper function to get CSS class based on lead stage
export const getStageColorClass = (stage: string): string => {
  switch (stage) {
    case 'جديد':
      return 'bg-blue-100 text-blue-800';
    case 'مؤهل':
      return 'bg-purple-100 text-purple-800';
    case 'عرض سعر':
      return 'bg-amber-100 text-amber-800';
    case 'تفاوض':
      return 'bg-orange-100 text-orange-800';
    case 'مغلق':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Transform a lead from Supabase format to application format
export const transformLeadFromSupabase = (lead: LeadDBRow): Lead => {
  // Get profile data if available
  const firstName = lead.profiles?.first_name || '';
  const lastName = lead.profiles?.last_name || '';
  
  // Create owner object if assigned_to is present
  const owner = lead.assigned_to ? {
    name: `${firstName} ${lastName}`.trim() || "غير معروف",
    avatar: `/placeholder.svg`,
    initials: `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || "؟"
  } : undefined;
  
  // Create and return transformed lead
  return {
    ...lead,
    stage: lead.status, // Map status to stage for UI compatibility
    owner
  };
};
