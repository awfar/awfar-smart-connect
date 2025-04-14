
import { Lead, LeadDBRow } from "../types/leadTypes";

// Transform a lead record from Supabase to our Lead model
export const transformLeadFromSupabase = (dbLead: LeadDBRow): Lead => {
  const transformedLead: Lead = {
    id: dbLead.id,
    first_name: dbLead.first_name,
    last_name: dbLead.last_name,
    email: dbLead.email,
    phone: dbLead.phone,
    company: dbLead.company,
    position: dbLead.position,
    country: dbLead.country || '',
    industry: dbLead.industry || '',
    status: dbLead.status,
    stage: dbLead.status, // Use status as stage for UI consistency
    source: dbLead.source,
    notes: dbLead.notes,
    created_at: dbLead.created_at,
    updated_at: dbLead.updated_at,
    assigned_to: dbLead.assigned_to || '',
  };

  // Add owner information if available from the profiles join
  if (dbLead.profiles) {
    const firstName = dbLead.profiles.first_name || '';
    const lastName = dbLead.profiles.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    transformedLead.owner = {
      name: fullName || 'غير معروف',
      avatar: '/placeholder.svg',
      initials: getInitials(fullName),
    };
  }

  return transformedLead;
};

// Get color class for lead stage badges
export const getStageColorClass = (stage: string): string => {
  switch (stage?.toLowerCase()) {
    case 'جديد':
    case 'new':
    case 'تم استلامه':
      return 'bg-blue-100 text-blue-800';
      
    case 'مؤهل':
    case 'qualified':
      return 'bg-cyan-100 text-cyan-800';
      
    case 'عرض سعر':
    case 'proposal':
    case 'quote':
      return 'bg-purple-100 text-purple-800';
      
    case 'تفاوض':
    case 'negotiation':
      return 'bg-amber-100 text-amber-800';
      
    case 'مغلق مكسب':
    case 'won':
    case 'closed won':
      return 'bg-green-100 text-green-800';
      
    case 'مغلق خسارة':
    case 'lost':
    case 'closed lost':
      return 'bg-red-100 text-red-800';
      
    case 'مؤجل':
    case 'postponed':
      return 'bg-gray-100 text-gray-800';
      
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get initials from a full name
export const getInitials = (name: string): string => {
  if (!name || name === 'غير معروف' || name === 'غير مخصص') return 'ع.م';
  
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase() || 'ع.م';
};
