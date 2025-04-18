
// Export all appointment-related functions and types
export { 
  fetchAppointments,
  fetchAppointmentsByLeadId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment
} from './appointmentsService';

export type { Appointment, AppointmentCreateInput } from './types';

// Add a shorthand to match function names expected in LeadDetailsPage
export const fetchAppointments = async (leadId: string) => {
  const { getAppointmentsByLeadId } = await import('./appointmentsService');
  return getAppointmentsByLeadId(leadId);
};
