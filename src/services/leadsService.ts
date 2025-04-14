
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadSources,
  getIndustries,
  getCountries,
  getLeadStages,
  getSalesOwners,
  getCompanies,
  getLeadActivities,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
  completeLeadActivity,
} from './leads';

// Export types
export type { Lead, LeadActivity } from './types/leadTypes';
