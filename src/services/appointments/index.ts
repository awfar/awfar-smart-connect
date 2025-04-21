
// Export all appointment-related functions and types
export { 
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchAppointments,
  fetchAppointmentsByLeadId as getAppointmentsByLeadId,
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput, AppointmentStatus } from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId as fetchAppointmentsByLeadId,
} from './api';
