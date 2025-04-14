
// Mock data for leads and activities
import { Lead, LeadActivity } from "./types";

// Mock lead data for development and testing
export const mockLeads: Lead[] = [
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
];

// Separate mock activities to prevent circular references
export const mockActivities: Record<string, LeadActivity[]> = {
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
};
