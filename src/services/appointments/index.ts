
// Export all appointment-related functions and types
export { 
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput } from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId,
} from './api';

// Add a consistent naming for fetching appointments by lead ID
export const fetchAppointmentsByLeadId = async (leadId: string) => {
  const { getAppointmentsByLeadId } = await import('./api');
  return getAppointmentsByLeadId(leadId);
};
