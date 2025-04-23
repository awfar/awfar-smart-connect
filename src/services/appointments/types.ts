
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

// Defining AppointmentDB interface to match the database structure
export interface AppointmentDB {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: string; // Raw string from DB, will be validated and converted to AppointmentStatus
  location?: string;
  lead_id?: string;
  company_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  color?: string;
  is_all_day?: boolean;
  owner_id?: string;
  client_id?: string;
  notification_sent?: boolean;
  notes?: string;
  type?: string;
  team_id?: string;
  reminder_time?: number;
  related_ticket_id?: string;
  related_deal_id?: string;
  location_details?: string;
  participants?: string[];
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  location?: string;
  lead_id?: string;
  company_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  color?: string;
  is_all_day?: boolean;
  owner_id?: string;
  client_id?: string;
  notification_sent?: boolean;
  notes?: string;
  type?: string;
  team_id?: string;
  reminder_time?: number;
  related_ticket_id?: string;
  related_deal_id?: string;
  location_details?: string;
  participants?: string[];
}

export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status?: AppointmentStatus;
  location?: string;
  lead_id?: string;
  company_id?: string;
  created_by?: string;
  color?: string;
  is_all_day?: boolean;
  client_id?: string;
  related_deal_id?: string;
  // Add missing properties to fix errors
  location_details?: string;
  owner_id?: string;
  participants?: string[];
  type?: string;
  related_ticket_id?: string;
  notes?: string;
  reminder_time?: number;
}

// Adding missing types for availability service
export interface UserAvailability {
  id?: string;
  user_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // 24-hour format
  end_time: string; // 24-hour format
  is_available: boolean;
}

export interface BookingSettings {
  id?: string;
  user_id: string;
  appointment_duration: number; // in minutes
  buffer_time: number; // in minutes
  advance_notice: number; // in hours
  max_days_in_advance: number; // in days
  is_public: boolean;
  allowed_meeting_types: string[];
}
