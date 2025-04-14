
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
export {
  // Types
  Lead,
  LeadActivity,
  
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
