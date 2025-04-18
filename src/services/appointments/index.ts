
// Export all appointment-related functions and types
export { 
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  fetchAppointments
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput } from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId,
} from './api';

// We don't need the duplicate fetchAppointmentsByLeadId since we have getAppointmentsByLeadId
