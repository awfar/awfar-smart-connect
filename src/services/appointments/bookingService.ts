
import { supabase } from "@/integrations/supabase/client";
import { AppointmentCreateInput, Appointment } from "./types";
import { createAppointment } from "./appointmentsCrud";
import { toast } from "sonner";

// Mock data for available time slots
export const getAvailableTimeSlots = async (
  userId: string,
  date: string
): Promise<{ start: string; end: string }[]> => {
  // This is a placeholder. In a real implementation, we would:
  // 1. Get the user's working hours for the specified day
  // 2. Get all existing appointments for that day
  // 3. Calculate available slots based on appointment duration and buffer time
  
  // For now, return mock data
  return [
    { start: `${date}T09:00:00`, end: `${date}T09:30:00` },
    { start: `${date}T10:00:00`, end: `${date}T10:30:00` },
    { start: `${date}T11:00:00`, end: `${date}T11:30:00` },
    { start: `${date}T13:00:00`, end: `${date}T13:30:00` },
    { start: `${date}T14:00:00`, end: `${date}T14:30:00` },
    { start: `${date}T15:00:00`, end: `${date}T15:30:00` },
  ];
};

// Get public booking profile data for a user by their slug
export const getBookingProfile = async (userSlug: string) => {
  try {
    // In a real implementation, we would query the user profile by slug
    // For now, return mock data
    return {
      id: "mock-user-id",
      first_name: "محمد",
      last_name: "أحمد",
      title: "مستشار مبيعات",
      avatar_url: null,
      booking_settings: {
        appointment_duration: 30,
        buffer_time: 15,
        advance_notice: 1,
        max_days_in_advance: 30,
        is_public: true,
        allowed_meeting_types: ["اجتماع تعريفي", "استشارة", "عرض تقديمي"]
      }
    };
  } catch (error) {
    console.error("Error fetching booking profile:", error);
    return null;
  }
};

// Create a booking as a client
export const createPublicBooking = async (
  bookingData: {
    user_id: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    date: string;
    time: string;
    duration: number;
    meeting_type: string;
    notes?: string;
  }
): Promise<Appointment | null> => {
  try {
    const { user_id, client_name, client_email, client_phone, date, time, duration, meeting_type, notes } = bookingData;
    
    // Calculate end time based on duration
    const startTime = `${date}T${time}:00`;
    const endDate = new Date(new Date(`${date}T${time}:00`).getTime() + duration * 60000);
    const endTime = endDate.toISOString();
    
    // Create appointment data
    const appointmentData: AppointmentCreateInput = {
      title: `موعد: ${meeting_type} - ${client_name}`,
      description: `حجز موعد من ${client_name} (${client_email})${notes ? `\n\nملاحظات: ${notes}` : ''}`,
      start_time: startTime,
      end_time: endTime,
      status: "scheduled",
      created_by: user_id, // The staff member being booked
      // Use the user_id as the owner since this isn't going through normal Supabase auth
      owner_id: user_id, // Now properly added to AppointmentCreateInput type
      client_id: client_email, // We're using email as client_id for public bookings
      type: meeting_type, // Now properly added to AppointmentCreateInput type
      is_all_day: false
    };
    
    const result = await createAppointment(appointmentData);
    
    if (result) {
      // In a real-world implementation, we would send confirmation emails here
      toast.success("تم حجز الموعد بنجاح");
      return result;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating booking:", error);
    toast.error("فشل في حجز الموعد");
    return null;
  }
};
