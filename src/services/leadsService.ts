
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLead,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
  completeLeadActivity,
  getLeadActivities,
} from './leads';

// Export utility functions from the proper location
export {
  getLeadSources,
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries,
  getLeadCountByStatus,
  getTotalLeadCount,
  getStageColorClass,
} from './leads/utils';

// Export types
export type { Lead, LeadActivity } from '@/types/leads';
