
// This is a convenience service that re-exports all leads-related functionality

// Re-export all from the sub-modules
export * from './leads/api';
export * from './leads/types';
export * from './leads/utils';

// Add any additional convenience methods if needed
export const isLeadQualified = (lead: any) => {
  return lead?.status === 'qualified' || lead?.stage === 'qualified';
};

export const formatLeadName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};
