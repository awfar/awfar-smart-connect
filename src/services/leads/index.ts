
// Main entry point for lead services - exports all functionality
import { Lead, LeadActivity } from "../types/leadTypes";
import { 
  getLeads, 
  getLeadById, 
  fetchLeadById, 
  getLeadSources, 
  getIndustries,
  getCountries,
  getLeadStages,
  getSalesOwners,
  getCompanies
} from "./leadQueries";

import { 
  updateLead, 
  createLead, 
  deleteLead 
} from "./leadMutations";

import { 
  getLeadActivities, 
  addLeadActivity,
  completeLeadActivity
} from "./leadActivities";

// Re-export all types and functions
export type { Lead, LeadActivity };

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
};
