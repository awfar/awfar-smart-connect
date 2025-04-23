
import { Appointment } from "./types";
import { fetchAppointmentsByLeadId } from "./appointmentsService";

// This file serves as an intermediate layer for appointment-related API calls
// Allows for easier mocking in tests and additional processing if needed

export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  // This is currently a simple pass-through, but we could add caching, 
  // additional transformations, or error handling here
  return fetchAppointmentsByLeadId(leadId);
};
