
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentType = 'meeting' | 'call' | 'virtual' | 'in-person' | 'other';
export type AppointmentLocation = 'zoom' | 'google-meet' | 'microsoft-teams' | 'office' | 'other' | string;

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: AppointmentLocation;
  location_details?: string;
  status: AppointmentStatus;
  lead_id?: string | null;
  company_id?: string | null;
  client_id?: string;
  owner_id?: string;
  participants?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  type?: AppointmentType;
  related_deal_id?: string | null;
  related_ticket_id?: string | null;
  notes?: string;
  is_all_day?: boolean;
  color?: string;
  notification_sent?: boolean;
  reminder_time?: number; // Minutes before appointment
}

export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: AppointmentLocation;
  location_details?: string;
  status?: AppointmentStatus;
  lead_id?: string;
  company_id?: string | null;
  client_id?: string;
  owner_id?: string;
  participants?: string[];
  created_by?: string;
  type?: AppointmentType;
  related_deal_id?: string | null;
  related_ticket_id?: string | null;
  notes?: string;
  is_all_day?: boolean;
  color?: string;
  reminder_time?: number;
}

export interface UserAvailability {
  id: string;
  user_id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingSettings {
  id: string;
  user_id: string;
  default_meeting_duration: number; // in minutes
  buffer_time: number; // in minutes
  default_location: AppointmentLocation;
  booking_link_enabled: boolean;
  booking_link_slug?: string;
  allow_public_booking: boolean;
  created_at: string;
  updated_at: string;
}

