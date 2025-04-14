
// Export all functions from deals services
export {
  // Query functions
  getDeals,
  getDealById,
  getDealStages,
  
  // Mutation functions
  createDeal,
  updateDeal,
  deleteDeal,
  
  // Activity functions
  getDealActivities,
  addDealActivity,
  completeDealActivity
} from './deals';

// Export types
export type { Deal, DealActivity } from './types/dealTypes';
