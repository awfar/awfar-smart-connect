
// Main entry point for lead services - exports all functionality
import { Lead, LeadActivity } from "../types/leadTypes";
import { 
  getLeads, 
  getLeadById, 
  fetchLeadById, 
  getLeadSources, 
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries
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

// Re-export all functions
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
  getLeadActivities
};

// Re-export all types
export type { Lead, LeadActivity };
