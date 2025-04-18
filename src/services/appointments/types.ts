
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: string;
  client_id?: string;
  lead_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  participants?: string[];
}

export interface AppointmentCreateInput {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: string;
  client_id?: string;
  lead_id?: string;
  created_by?: string;
}
