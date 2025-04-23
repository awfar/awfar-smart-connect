
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: AppointmentStatus;
  is_all_day?: boolean;
  lead_id?: string;
  company_id?: string;
  client_id?: string;
  owner_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  notification_sent?: boolean;
  notes?: string;
  color?: string;
  type?: string;
  reminder_time?: number;
  location_details?: string;
  related_ticket_id?: string;
  related_deal_id?: string;
  participants?: string[];
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

// Define database specific type (represents the raw DB record)
export type AppointmentDB = Appointment;

// Define type for appointment creation
export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  location_details?: string;
  status?: AppointmentStatus;
  is_all_day?: boolean;
  lead_id?: string;
  company_id?: string;
  client_id?: string;
  owner_id?: string;
  created_by?: string;
  participants?: string[];
  type?: string;
  related_deal_id?: string;
  related_ticket_id?: string;
  notes?: string;
  color?: string;
  reminder_time?: number;
}

// Additional types needed for other appointment services
export interface UserAvailability {
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BookingSettings {
  user_id: string;
  default_meeting_duration: number;
  buffer_time_before: number;
  buffer_time_after: number;
  max_bookings_per_day: number;
}
