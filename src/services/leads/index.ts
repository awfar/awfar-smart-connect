
// Main entry point for lead services - exports all functionality
import { Lead, LeadActivity } from "../types/leadTypes";
import { 
  getLeads, 
  getLead,
  getLeadSources, 
  getLeadStages,
  getSalesOwners,
  getCountries,
  getIndustries,
  getLeadCountByStatus,
  getTotalLeadCount
} from "./leadQueries";

import { 
  updateLead, 
  createLead, 
  deleteLead 
} from "./leadMutations";

import { 
  getLeadActivities, 
  addLeadActivity,
  completeLeadActivity,
  deleteLeadActivity
} from "./leadActivities";

// Re-export all functions
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
  deleteLeadActivity,
  getLeadActivities
};

// Re-export all types
export type { Lead, LeadActivity };
