
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  createdBy: string;
  createdAt: string;
}
