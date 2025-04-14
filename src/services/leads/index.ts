
// Main entry point for lead services - exports all functionality
import { Lead, LeadActivity } from "./types";
import { 
  getLeads, 
  getLeadById, 
  fetchLeadById, 
  getLeadSources, 
  getIndustries 
} from "./leadQueries";

import { 
  updateLead, 
  createLead, 
  deleteLead 
} from "./leadMutations";

import { 
  getLeadActivities, 
  addLeadActivity 
} from "./leadActivities";

// Re-export all types and functions
// Using export type for type re-exports when isolatedModules is enabled
export type { Lead, LeadActivity };

export {
  // Query functions
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadSources,
  getIndustries,
  getLeadActivities,
  
  // Mutation functions
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
};
