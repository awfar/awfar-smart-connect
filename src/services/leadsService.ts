
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadSources,
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
  completeLeadActivity,
  getLeadActivities,
} from './leads';

// Export types
export type { Lead, LeadActivity } from './types/leadTypes';
