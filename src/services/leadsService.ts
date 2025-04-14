
// Main leads service file - provides backward compatibility with existing code
// This file re-exports functionality from the refactored services

import { 
  Lead,
  LeadActivity,
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadActivities,
  addLeadActivity,
  updateLead,
  createLead,
  deleteLead,
  getLeadSources,
  getIndustries
} from "./leads";

// Re-export all types and functions for backward compatibility
export {
  // Types
  Lead,
  LeadActivity,
  
  // Query functions
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadActivities,
  getLeadSources,
  getIndustries,
  
  // Mutation functions
  addLeadActivity,
  updateLead,
  createLead,
  deleteLead,
};

// Export type definitions for use in other modules
export type { Lead, LeadActivity };
