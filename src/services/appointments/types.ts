
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
