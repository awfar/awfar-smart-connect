
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLead,
  getLeadSources,
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries,
  getLeadCountByStatus,
  getTotalLeadCount,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
  completeLeadActivity,
  getLeadActivities,
} from './leads';

// Export types
export type { Lead, LeadActivity } from '@/types/leads';
