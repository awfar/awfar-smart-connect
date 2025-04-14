
// Export all functions from leads services
export {
  // Query functions
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadSources,
  getLeadStages,
  getSalesOwners,
  // getCompanies, // This was removed since it doesn't exist
  getLeadActivities,
  getCountries,
  getIndustries,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
  completeLeadActivity,
} from './leads';

// Export types
export type { Lead, LeadActivity } from './types/leadTypes';
