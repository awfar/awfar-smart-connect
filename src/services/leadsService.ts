
import { Lead, LeadActivity } from "../types/leads";

// Re-export the Lead type
export type { Lead, LeadActivity };

// Mock lead data
const mockLeads: Lead[] = [
  {
    id: "1",
    first_name: "أحمد",
    last_name: "محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    company: "شركة الخليج للتقنية",
    status: "جديد",
    stage: "جديد",
    source: "معرض تجاري",
    assignedTo: "محمد علي",
    created_at: "2023-04-15",
    lastActivity: "2023-05-01",
    country: "السعودية",
    industry: "تكنولوجيا المعلومات",
    owner: {
      name: "محمد علي",
      avatar: "/placeholder.svg",
      initials: "م.ع"
    }
  },
  // ... more mock leads
];

// Separate mock activities to prevent circular references
const mockActivities: Record<string, LeadActivity[]> = {
  "1": [
    {
      id: "a1",
      leadId: "1",
      type: "اتصال",
      description: "تم التواصل مع العميل وإبداء الاهتمام",
      createdBy: "سارة أحمد",
      createdAt: "2023-04-20",
    },
    {
      id: "a2",
      leadId: "1",
      type: "بريد إلكتروني",
      description: "تم إرسال عرض تقديمي للمنتج",
      createdBy: "محمد علي",
      createdAt: "2023-04-23",
    },
  ],
  // ... more activities for other leads
};

// Get all leads
export const getLeads = async (): Promise<Lead[]> => {
  return Promise.resolve(mockLeads);
};

// Get lead by ID
export const getLeadById = async (id: string): Promise<Lead | null> => {
  const lead = mockLeads.find((lead) => lead.id === id);
  return Promise.resolve(lead || null);
};

// Add an alias for fetchLeadById to maintain compatibility
export const fetchLeadById = getLeadById;

// Get activities for a lead
export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  return Promise.resolve(mockActivities[leadId] || []);
};

// Add new activity to a lead
export const addLeadActivity = async (activity: Omit<LeadActivity, "id">): Promise<LeadActivity> => {
  const newActivity: LeadActivity = {
    id: `a${Date.now()}`,
    ...activity,
  };
  
  if (!mockActivities[activity.leadId]) {
    mockActivities[activity.leadId] = [];
  }
  
  mockActivities[activity.leadId].push(newActivity);
  return Promise.resolve(newActivity);
};

// Update lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  const index = mockLeads.findIndex((l) => l.id === lead.id);
  if (index >= 0) {
    mockLeads[index] = lead;
  }
  return Promise.resolve(lead);
};

// Create new lead
export const createLead = async (lead: Omit<Lead, "id">): Promise<Lead> => {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    ...lead,
  };
  mockLeads.push(newLead);
  return Promise.resolve(newLead);
};

// Delete lead
export const deleteLead = async (id: string): Promise<boolean> => {
  const index = mockLeads.findIndex((l) => l.id === id);
  if (index >= 0) {
    mockLeads.splice(index, 1);
    delete mockActivities[id];
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};
