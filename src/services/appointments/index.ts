
// Export all appointment-related functions and types
export { 
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  fetchAppointments,
  fetchAppointmentsByLeadId,
  fetchAppointmentsByUserId,
  fetchAppointmentsByTeam,
  fetchUpcomingAppointments,
  markAppointmentAsCompleted,
  fetchUserAvailability,
  updateUserAvailability,
  fetchBookingSettings,
  updateBookingSettings,
  createBookingFromPublic
} from './appointmentsService';

export type { 
  Appointment, 
  AppointmentCreateInput, 
  AppointmentStatus,
  AppointmentType,
  AppointmentLocation,
  UserAvailability,
  BookingSettings
} from './types';

// Export functions from api.ts
export { 
  getAppointmentsByLeadId,
} from './api';
