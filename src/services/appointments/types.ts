
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

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
}
