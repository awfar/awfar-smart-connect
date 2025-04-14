
// تعريف أنواع التذاكر
export interface Ticket {
  id?: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'عاجل';
  category?: string;
  client_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}
