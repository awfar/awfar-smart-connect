
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLead,
  
  // Utility functions
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

// Also export the utility functions directly
export {
  getLeadSources,
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries,
  getLeadCountByStatus,
  getTotalLeadCount,
} from './leads/utils';

// Export types
export type { Lead, LeadActivity } from '@/types/leads';
