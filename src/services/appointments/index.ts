
// Export all appointment-related functions and types
export { 
  getAppointments, 
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput } from './types';
