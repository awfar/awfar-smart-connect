
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
