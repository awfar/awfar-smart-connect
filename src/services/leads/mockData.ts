
import { Lead, LeadActivity } from "../types/leadTypes";

// Mock data for leads when Supabase is not available
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    first_name: "محمد",
    last_name: "العمري",
    email: "mohammed@example.com",
    phone: "+966501234567",
    company: "شركة التقنية المتقدمة",
    position: "مدير تقنية المعلومات",
    country: "المملكة العربية السعودية",
    industry: "تكنولوجيا المعلومات",
    stage: "مؤهل",
    source: "موقع إلكتروني",
    notes: "عميل مهتم بباقات إدارة العملاء",
    created_at: "2025-03-10T10:20:30Z",
    updated_at: "2025-03-12T14:25:00Z",
    owner: {
      name: "أحمد الشمري",
      avatar: "/placeholder.svg",
      initials: "أ"
    }
  },
  {
    id: "lead-2",
    first_name: "سارة",
    last_name: "القحطاني",
    email: "sara@example.com",
    phone: "+966512345678",
    company: "مؤسسة النجاح للتجارة",
    position: "مديرة تسويق",
    country: "الإمارات العربية المتحدة",
    industry: "التجارة الإلكترونية",
    stage: "جديد",
    source: "وسائل التواصل الاجتماعي",
    notes: "تبحث عن حلول إدارة علاقات العملاء للمتاجر الإلكترونية",
    created_at: "2025-04-01T09:15:00Z",
    updated_at: "2025-04-01T09:15:00Z",
    owner: {
      name: "نورة المطيري",
      avatar: "/placeholder.svg",
      initials: "ن"
    }
  },
  {
    id: "lead-3",
    first_name: "خالد",
    last_name: "السالم",
    email: "khalid@example.com",
    phone: "+966523456789",
    company: "مستشفى الرعاية الطبية",
    position: "المدير التنفيذي",
    country: "المملكة العربية السعودية",
    industry: "الرعاية الصحية",
    stage: "عرض سعر",
    source: "معرض تجاري",
    notes: "يحتاج إلى نظام إدارة المرضى والعملاء",
    created_at: "2025-03-20T13:40:00Z",
    updated_at: "2025-04-05T10:30:00Z",
    owner: {
      name: "بدر العتيبي",
      avatar: "/placeholder.svg",
      initials: "ب"
    }
  }
];

// Mock data for lead activities when Supabase is not available
export const mockActivities: Record<string, LeadActivity[]> = {
  "lead-1": [
    {
      id: "act-1",
      lead_id: "lead-1",
      type: "call",
      description: "تم التواصل هاتفياً وإرسال تفاصيل الباقات",
      created_at: "2025-03-12T14:25:00Z",
      created_by: "user-1",
      scheduled_at: "2025-03-12T14:00:00Z",
      completed_at: "2025-03-12T14:25:00Z"
    },
    {
      id: "act-2",
      lead_id: "lead-1",
      type: "email",
      description: "تم إرسال عرض سعر مخصص",
      created_at: "2025-03-13T09:30:00Z",
      created_by: "user-1",
      scheduled_at: "2025-03-13T09:00:00Z",
      completed_at: "2025-03-13T09:30:00Z"
    },
    {
      id: "act-3",
      lead_id: "lead-1",
      type: "meeting",
      description: "اجتماع متابعة لمناقشة العرض المقدم",
      created_at: "2025-03-15T10:00:00Z",
      created_by: "user-1",
      scheduled_at: "2025-03-20T14:00:00Z",
      completed_at: null
    }
  ],
  "lead-2": [
    {
      id: "act-4",
      lead_id: "lead-2",
      type: "call",
      description: "مكالمة ترحيبية وتعريف بالخدمات",
      created_at: "2025-04-01T10:00:00Z",
      created_by: "user-2",
      scheduled_at: "2025-04-01T10:00:00Z",
      completed_at: "2025-04-01T10:15:00Z"
    },
    {
      id: "act-5",
      lead_id: "lead-2",
      type: "email",
      description: "إرسال كتيب تعريفي بالخدمات",
      created_at: "2025-04-02T09:00:00Z",
      created_by: "user-2",
      scheduled_at: "2025-04-02T09:00:00Z",
      completed_at: "2025-04-02T09:05:00Z"
    }
  ],
  "lead-3": [
    {
      id: "act-6",
      lead_id: "lead-3",
      type: "meeting",
      description: "اجتماع استعراض متطلبات العميل",
      created_at: "2025-03-25T11:00:00Z",
      created_by: "user-3",
      scheduled_at: "2025-03-25T11:00:00Z",
      completed_at: "2025-03-25T12:30:00Z"
    },
    {
      id: "act-7",
      lead_id: "lead-3",
      type: "email",
      description: "إرسال عرض سعر مفصل",
      created_at: "2025-04-02T15:00:00Z",
      created_by: "user-3",
      scheduled_at: "2025-04-02T15:00:00Z",
      completed_at: "2025-04-02T15:10:00Z"
    },
    {
      id: "act-8",
      lead_id: "lead-3",
      type: "call",
      description: "متابعة العرض المقدم",
      created_at: "2025-04-05T10:30:00Z",
      created_by: "user-3",
      scheduled_at: "2025-04-05T10:30:00Z",
      completed_at: "2025-04-05T10:45:00Z"
    }
  ]
};
