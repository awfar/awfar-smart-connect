
import { Appointment } from "./types";
import { fetchAppointmentsByLeadId } from "./appointmentsCrud";

// This file serves as an intermediate layer for appointment-related API calls
// Allows for easier mocking in tests and additional processing if needed

export const getAppointmentsByLeadId = async (leadId: string): Promise<Appointment[]> => {
  try {
    if (!leadId || leadId === 'none') {
      console.log("No valid lead ID provided for getAppointmentsByLeadId");
      return [];
    }
    
    // Pass through to the implementation in appointmentsCrud
    const appointments = await fetchAppointmentsByLeadId(leadId);
    return Array.isArray(appointments) ? appointments : [];
  } catch (error) {
    console.error("Error in getAppointmentsByLeadId:", error);
    return [];
  }
};
