
// Export all appointment-related functions and types
export { 
  fetchAppointments,
  fetchAppointmentsByLeadId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments,
  getAppointment
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput } from './types';
