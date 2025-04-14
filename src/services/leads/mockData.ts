
import { Lead, LeadActivity } from "../types/leadTypes";

// Mock leads data for testing
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    first_name: "أحمد",
    last_name: "محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    company: "شركة الإبداع للتقنية",
    position: "مدير تقنية المعلومات",
    source: "موقع إلكتروني",
    status: "جديد",
    notes: "عميل محتمل مهتم بخدمات إدارة علاقات العملاء",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      name: "محمد علي",
      avatar: "/placeholder.svg",
      initials: "مع"
    }
  },
  {
    id: "lead-2",
    first_name: "نورة",
    last_name: "العتيبي",
    email: "norah@example.com",
    phone: "+966512345678",
    company: "مؤسسة النور للتجارة",
    position: "مديرة التسويق",
    source: "معرض تجاري",
    status: "مؤهل",
    notes: "تبحث عن حلول لإدارة الحملات التسويقية",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    owner: {
      name: "سارة القحطاني",
      avatar: "/placeholder.svg",
      initials: "سق"
    }
  },
  {
    id: "lead-3",
    first_name: "خالد",
    last_name: "الشمري",
    email: "khalid@example.com",
    phone: "+966523456789",
    company: "مجموعة الخليج للاستثمار",
    position: "مدير عام",
    source: "توصية",
    status: "عرض سعر",
    notes: "مهتم بالباقة المتكاملة لحلول الأعمال",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: {
      name: "فيصل الدوسري",
      avatar: "/placeholder.svg",
      initials: "فد"
    }
  }
];

// Mock activities for testing
export const mockActivities: Record<string, LeadActivity[]> = {
  "lead-1": [
    {
      id: "activity-1-1",
      lead_id: "lead-1",
      type: "call",
      description: "اتصال تعريفي، مهتم بمعرفة المزيد عن الخدمات",
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-1",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "activity-1-2",
      lead_id: "lead-1",
      type: "email",
      description: "إرسال عرض تقديمي عن خدماتنا وأسعارنا",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-1",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "activity-1-3",
      lead_id: "lead-1",
      type: "meeting",
      description: "اجتماع متابعة لاستعراض العرض المقدم",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-1",
      scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null
    }
  ],
  "lead-2": [
    {
      id: "activity-2-1",
      lead_id: "lead-2",
      type: "note",
      description: "العميل يبحث عن حلول متكاملة لإدارة التسويق الرقمي",
      created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-2",
      scheduled_at: null,
      completed_at: null
    },
    {
      id: "activity-2-2",
      lead_id: "lead-2",
      type: "call",
      description: "نقاش حول احتياجات التسويق الرقمي والباقات المتوفرة",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-2",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "activity-2-3",
      lead_id: "lead-2",
      type: "task",
      description: "إعداد عرض سعر مفصل للخدمات المطلوبة",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-2",
      scheduled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  "lead-3": [
    {
      id: "activity-3-1",
      lead_id: "lead-3",
      type: "email",
      description: "إرسال معلومات تفصيلية عن الباقة المتكاملة",
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-3",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "activity-3-2",
      lead_id: "lead-3",
      type: "meeting",
      description: "اجتماع مع فريق العميل لشرح ميزات النظام",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-3",
      scheduled_at: null,
      completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "activity-3-3",
      lead_id: "lead-3",
      type: "task",
      description: "إعداد وإرسال العقد النهائي",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "user-3",
      scheduled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};
