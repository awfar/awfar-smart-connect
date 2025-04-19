
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: AppointmentStatus;
  lead_id?: string | null;  // Added lead_id field
  client_id?: string;
  participants?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: AppointmentStatus;
  lead_id?: string;  // Added lead_id field
  client_id?: string;
  participants?: string[];
  created_by?: string;
}
