
// Re-export all deal-related services
import { Deal, DealActivity } from "../types/dealTypes";
import { getDealStages, getDeals, getDealById } from "./dealQueries";
import { createDeal, updateDeal, deleteDeal } from "./dealMutations";
import { getDealActivities, addDealActivity, completeDealActivity } from "./dealActivities";

export {
  // Query functions
  getDeals,
  getDealById,
  getDealStages,
  
  // Mutation functions
  createDeal,
  updateDeal,
  deleteDeal,
  
  // Activities
  getDealActivities,
  addDealActivity,
  completeDealActivity
};

// Re-export all types
export type { Deal, DealActivity };
