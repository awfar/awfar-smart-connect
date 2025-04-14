
// تصدير كل الوظائف من وحدات العملاء المحتملين بشكل صريح
import {
  getLeads,
  getLeadById,
  getLeadSources,
  getIndustries,
  fetchLeadById
} from './leads/leadQueries';

import {
  createLead,
  updateLead,
  deleteLead
} from './leads/leadMutations';

import {
  getLeadActivities,
  addLeadActivity
} from './leads/leadActivities';

import { Lead, LeadActivity } from './leads/types';

// تصدير الأنواع والوظائف
export type { Lead, LeadActivity };

export {
  // وظائف الاستعلام
  getLeads,
  getLeadById,
  fetchLeadById,
  getLeadSources,
  getIndustries,
  getLeadActivities,
  
  // وظائف التعديل
  updateLead,
  createLead,
  deleteLead,
  addLeadActivity,
};
