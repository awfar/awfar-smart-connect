
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: string;
  lead_id?: string;
  client_id?: string;
  participants?: string[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentCreateInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: string;
  lead_id?: string;
  client_id?: string;
  participants?: string[];
  created_by?: string; // Adding this field to fix the error
}
