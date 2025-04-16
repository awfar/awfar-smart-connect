
import { Task } from './types';

// بيانات تجريبية للمهام
export function getMockTasks(leadId?: string): Task[] {
  const allMockTasks: Task[] = [
    {
      id: '1',
      title: 'الاتصال بالعميل الجديد',
      description: 'متابعة العميل المحتمل الذي تم إضافته بالأمس',
      status: 'pending',
      priority: 'high',
      due_date: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: 'user1',
      assigned_to_name: 'أحمد محمد',
      related_to: {
        type: 'lead',
        id: 'lead1',
        name: 'شركة التقنية الحديثة'
      }
    },
    {
      id: '2',
      title: 'إعداد عرض أسعار',
      description: 'إعداد عرض أسعار للعميل بناءً على احتياجاته',
      status: 'in-progress',
      priority: 'medium',
      due_date: new Date(Date.now() + 172800000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: 'user2',
      assigned_to_name: 'سارة خالد',
      related_to: {
        type: 'deal',
        id: 'deal1',
        name: 'صفقة برنامج المحاسبة'
      }
    },
    {
      id: '3',
      title: 'متابعة الدفعة المستحقة',
      description: 'التواصل مع العميل لتذكيره بالدفعة المستحقة',
      status: 'completed',
      priority: 'low',
      due_date: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: 'user1',
      assigned_to_name: 'أحمد محمد',
      related_to: {
        type: 'customer',
        id: 'customer1',
        name: 'مؤسسة المستقبل'
      }
    }
  ];
  
  // If a lead ID is provided, filter tasks by that lead
  if (leadId) {
    return allMockTasks.filter(task => 
      task.related_to?.type === 'lead' && task.related_to?.id === leadId
    );
  }
  
  return allMockTasks;
}
