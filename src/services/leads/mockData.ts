
import { Lead, LeadActivity } from '../../types/leads';
import { formatDistanceToNow } from 'date-fns';

export const mockLeads: Lead[] = [
  {
    id: '1',
    first_name: 'محمد',
    last_name: 'أحمد',
    email: 'mohamed@example.com',
    phone: '+966 50 123 4567',
    company: 'شركة التقنية المتطورة',
    position: 'مدير تنفيذي',
    country: 'السعودية',
    industry: 'تكنولوجيا المعلومات',
    status: 'جديد',
    source: 'معرض تجاري',
    notes: 'عميل محتمل مهتم بخدمات التسويق الرقمي',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    avatar_url: '',
    owner: {
      id: '101',
      name: 'سارة الخالدي',
      avatar: '/public/placeholder.svg',
      initials: 'سخ'
    }
  },
  {
    id: '2',
    first_name: 'فاطمة',
    last_name: 'المحمد',
    email: 'fatima@example.com',
    phone: '+966 55 987 6543',
    company: 'مؤسسة الإبداع',
    position: 'مديرة التسويق',
    country: 'الإمارات',
    industry: 'التجارة الإلكترونية',
    status: 'مؤهل',
    source: 'وسائل التواصل الاجتماعي',
    notes: 'مهتمة بحملات التسويق عبر وسائل التواصل الاجتماعي',
    created_at: '2023-02-20T14:15:00Z',
    updated_at: '2023-03-01T09:45:00Z',
    avatar_url: '',
    owner: {
      id: '102',
      name: 'عبدالله الحربي',
      avatar: '/public/placeholder.svg',
      initials: 'عح'
    }
  },
  {
    id: '3',
    first_name: 'أحمد',
    last_name: 'العلي',
    email: 'ahmed@example.com',
    phone: '+966 54 111 2233',
    company: 'شركة البناء الحديثة',
    position: 'مدير المشاريع',
    country: 'قطر',
    industry: 'البناء والمقاولات',
    status: 'عقد مبدئي',
    source: 'إحالة',
    notes: 'يبحث عن حلول برمجية لإدارة المشاريع',
    created_at: '2023-03-10T08:45:00Z',
    updated_at: '2023-03-15T16:30:00Z',
    avatar_url: '',
    owner: {
      id: '103',
      name: 'نوف السالم',
      avatar: '/public/placeholder.svg',
      initials: 'نس'
    }
  },
  {
    id: '4',
    first_name: 'خالد',
    last_name: 'الفهد',
    email: 'khalid@example.com',
    phone: '+966 56 444 5555',
    company: 'مطاعم الذواقة',
    position: 'مالك',
    country: 'الكويت',
    industry: 'المطاعم والضيافة',
    status: 'عميل',
    source: 'موقع الويب',
    notes: 'يبحث عن نظام إدارة مطاعم وطلبات',
    created_at: '2023-04-05T11:20:00Z',
    updated_at: '2023-04-10T13:00:00Z',
    avatar_url: '',
    owner: {
      id: '104',
      name: 'لينا الصالح',
      avatar: '/public/placeholder.svg',
      initials: 'لص'
    }
  },
  {
    id: '5',
    first_name: 'نورة',
    last_name: 'الزامل',
    email: 'noura@example.com',
    phone: '+966 59 777 8888',
    company: 'أكاديمية التعليم الذكي',
    position: 'المديرة التعليمية',
    country: 'البحرين',
    industry: 'التعليم',
    status: 'مناقشة متقدمة',
    source: 'حملة إعلانية',
    notes: 'تبحث عن منصة تعليمية متكاملة',
    created_at: '2023-05-15T09:30:00Z',
    updated_at: '2023-05-17T14:20:00Z',
    avatar_url: '',
    owner: {
      id: '105',
      name: 'فهد العمري',
      avatar: '/public/placeholder.svg',
      initials: 'فع'
    }
  },
];

export const mockLeadActivities: LeadActivity[] = [
  {
    id: '101',
    lead_id: '1',
    type: 'note',
    description: 'تم التواصل مع العميل لأول مرة وأبدى اهتمامًا كبيرًا بخدماتنا',
    created_at: '2023-01-15T10:35:00Z',
    created_by: {
      first_name: 'سارة',
      last_name: 'الخالدي'
    }
  },
  {
    id: '102',
    lead_id: '1',
    type: 'call',
    description: 'تحدثت مع العميل لمدة 15 دقيقة حول احتياجاته التسويقية',
    scheduled_at: '2023-01-17T11:00:00Z',
    completed_at: '2023-01-17T11:20:00Z',
    created_at: '2023-01-16T09:00:00Z',
    created_by: {
      first_name: 'سارة',
      last_name: 'الخالدي'
    }
  },
  {
    id: '103',
    lead_id: '1',
    type: 'email',
    description: 'أرسلت بريدًا إلكترونيًا بعرض أسعار للخدمات المطلوبة',
    created_at: '2023-01-18T14:25:00Z',
    created_by: {
      first_name: 'سارة',
      last_name: 'الخالدي'
    }
  },
  {
    id: '104',
    lead_id: '1',
    type: 'meeting',
    description: 'اجتماع تقديمي لشرح تفاصيل الخدمات والاستراتيجيات',
    scheduled_at: '2023-01-25T13:00:00Z',
    created_at: '2023-01-20T10:30:00Z',
    created_by: {
      first_name: 'عبدالله',
      last_name: 'الحربي'
    }
  },
  {
    id: '105',
    lead_id: '1',
    type: 'task',
    description: 'إعداد عرض تقديمي مخصص بناءً على احتياجات العميل',
    scheduled_at: '2023-01-22T09:00:00Z',
    completed_at: '2023-01-22T16:45:00Z',
    created_at: '2023-01-21T11:10:00Z',
    created_by: {
      first_name: 'سارة',
      last_name: 'الخالدي'
    }
  }
];

export const getTimeSince = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
