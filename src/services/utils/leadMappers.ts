
import { Lead, LeadRow } from "../types/leadTypes";

// This function maps database rows (LeadRow) to our application model (Lead)
export const mapRowToLead = (row: LeadRow): Lead => {
  const { profiles, ...leadData } = row;
  
  // Create the owner object if profile data exists
  const owner = profiles ? {
    name: `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim() || 'Unknown',
    avatar: "/placeholder.svg",
    initials: getInitials(profiles.first_name, profiles.last_name)
  } : undefined;
  
  // Return mapped lead with renamed fields
  return {
    ...leadData,
    stage: leadData.status, // Map status to stage
    country: leadData.country || '',
    industry: leadData.industry || '',
    owner
  };
};

// Helper function to get initials from name parts
function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last) || 'UN';
}
