
import { Lead } from "./types";
import { v4 as uuidv4 } from 'uuid';

// Create mock data for development and demo purposes
export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    first_name: "أحمد",
    last_name: "المهندس",
    email: "ahmad@example.com",
    phone: "0501234567",
    company: "شركة التكنولوجيا المتقدمة",
    position: "مدير تقنية المعلومات",
    country: "المملكة العربية السعودية",
    industry: "التكنولوجيا والاتصالات",
    status: "تفاوض",
    source: "موقع الويب",
    notes: "مهتم بخدمات إدارة علاقات العملاء",
    created_at: "2025-01-15T08:30:00.000Z",
    updated_at: "2025-01-15T08:30:00.000Z",
    assigned_to: "user-1",
    owner: {
      id: uuidv4(), // Added unique id
      name: "محمد علي",
      avatar: "",
      initials: "م ع"
    }
  },
  {
    id: 'lead-2',
    first_name: "سارة",
    last_name: "الخالدي",
    email: "sarah@example.com",
    phone: "0559876543",
    company: "أوفر للتسويق",
    position: "مدير التسويق",
    country: "الإمارات العربية المتحدة",
    industry: "التسويق والإعلان",
    status: "مؤهل",
    source: "مواقع التواصل الاجتماعي",
    notes: "تبحث عن حلول للتسويق عبر وسائل التواصل الاجتماعي",
    created_at: "2025-01-20T10:15:00.000Z",
    updated_at: "2025-01-22T14:30:00.000Z",
    assigned_to: "user-2",
    owner: {
      id: uuidv4(), // Added unique id
      name: "سارة خالد",
      avatar: "",
      initials: "س خ"
    }
  },
  {
    id: 'lead-3',
    first_name: "خالد",
    last_name: "العمري",
    email: "khaled@example.com",
    phone: "0561122334",
    company: "مجموعة العمري للمقاولات",
    position: "المدير التنفيذي",
    country: "قطر",
    industry: "البناء والمقاولات",
    status: "اتصال أولي",
    source: "معرض",
    notes: "يحتاج إلى نظام لإدارة المشاريع والعملاء",
    created_at: "2025-02-01T13:45:00.000Z",
    updated_at: "2025-02-01T13:45:00.000Z",
    assigned_to: "user-3",
    owner: {
      id: uuidv4(), // Added unique id
      name: "أحمد محمد",
      avatar: "",
      initials: "أ م"
    }
  },
  {
    id: 'lead-4',
    first_name: "نورة",
    last_name: "السليم",
    email: "noura@example.com",
    phone: "0536677889",
    company: "مركز السليم الطبي",
    position: "مدير العيادة",
    country: "الكويت",
    industry: "الرعاية الصحية",
    status: "عرض سعر",
    source: "توصية من عميل",
    notes: "تبحث عن نظام لإدارة المواعيد والمرضى",
    created_at: "2025-02-10T09:20:00.000Z",
    updated_at: "2025-02-15T11:10:00.000Z",
    assigned_to: "user-2",
    owner: {
      id: uuidv4(), // Added unique id
      name: "سارة خالد",
      avatar: "",
      initials: "س خ"
    }
  },
  {
    id: 'lead-5',
    first_name: "محمد",
    last_name: "العباسي",
    email: "mohammad@example.com",
    phone: "0553344556",
    company: "مؤسسة العباسي التعليمية",
    position: "مدير المدرسة",
    country: "البحرين",
    industry: "التعليم",
    status: "جديد",
    source: "إعلان",
    notes: "يبحث عن نظام إدارة تعليمي متكامل",
    created_at: "2025-03-01T15:30:00.000Z",
    updated_at: "2025-03-01T15:30:00.000Z",
    assigned_to: "user-1",
    owner: {
      id: uuidv4(), // Added unique id
      name: "محمد علي",
      avatar: "",
      initials: "م ع"
    }
  }
];
