
// Export main appointment CRUD
export * from './appointmentsCrud';

// Export user availability and booking settings
export * from './availabilityService';

// Export public booking logic
export * from './bookingService';

// Export types
export * from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId,
} from './api';
