
// This file should reference LeadDBRow instead of LeadRow
import { Lead } from "../types/leadTypes";
import { LeadDBRow } from "../types/leadTypes";

export function mapLeadFromDatabase(leadRow: LeadDBRow): Lead {
  // Implement mapping logic here
  return {
    id: leadRow.id,
    first_name: leadRow.first_name,
    last_name: leadRow.last_name,
    email: leadRow.email,
    phone: leadRow.phone,
    company: leadRow.company,
    position: leadRow.position,
    country: leadRow.country,
    industry: leadRow.industry,
    stage: leadRow.stage,
    status: leadRow.status,
    source: leadRow.source,
    notes: leadRow.notes,
    created_at: leadRow.created_at,
    updated_at: leadRow.updated_at,
    assigned_to: leadRow.assigned_to,
  };
}
