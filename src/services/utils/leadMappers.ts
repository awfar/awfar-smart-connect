
import { LeadRow, Lead } from "../types/leadTypes";

// Helper function to map database row to Lead interface
export const mapRowToLead = (row: LeadRow): Lead => {
  const ownerFirstName = row.profiles?.first_name || '';
  const ownerLastName = row.profiles?.last_name || '';
  const ownerName = `${ownerFirstName} ${ownerLastName}`.trim();
  const ownerInitials = 
    (ownerFirstName ? ownerFirstName[0] : '') + 
    (ownerLastName ? ownerLastName[0] : '');
  
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    country: row.country || '',
    industry: row.industry || '',
    stage: row.status, // Map status to stage
    source: row.source,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    assigned_to: row.assigned_to || undefined,
    position: row.position,
    owner: ownerName ? {
      name: ownerName,
      avatar: '/placeholder.svg',
      initials: ownerInitials || 'مس'
    } : undefined
  };
};
