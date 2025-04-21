
// Export all appointment-related functions and types
export { 
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  fetchAppointments,
  fetchAppointmentsByLeadId
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput, AppointmentStatus } from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId,
} from './api';
