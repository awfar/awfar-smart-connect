
// Basic appointment type definition
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  client_id?: string;
  created_by?: string;
  participants?: string[];
}

export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  client_id?: string;
  participants?: string[];
}
