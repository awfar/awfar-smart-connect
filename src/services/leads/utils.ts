
// Utility functions for lead-related operations
import { Lead } from "./types";

// Transform lead data from Supabase
export const transformLeadFromSupabase = (lead: any): Lead => {
  if (!lead) return lead;
  
  return {
    ...lead,
    // معالجة حالة وجود assigned_to بدلاً من assignedTo
    assignedTo: lead.assignedTo || lead.assigned_to,
    // ضمان وجود بيانات المالك (owner)
    owner: lead.owner || {
      name: lead.assigned_to_name || "غير مخصص",
      avatar: "/placeholder.svg",
      initials: lead.assigned_to_name ? lead.assigned_to_name.charAt(0) : "؟"
    }
  };
};
