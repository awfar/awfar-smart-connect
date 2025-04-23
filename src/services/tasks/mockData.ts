
import { Task } from './types';

// Mock data for tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "اتصال متابعة مع العميل",
    description: "متابعة العميل بخصوص العرض المقدم",
    status: "pending",
    priority: "high",
    due_date: "2025-04-20T10:00:00",
    lead_id: "lead-1",
    assigned_to: "user-1",
    created_by: "user-2",
    created_at: "2025-04-15T08:30:00",
    updated_at: "2025-04-15T08:30:00",
    assigned_to_name: "أحمد محمد",
    related_to: [{
      type: "lead",
      id: "lead-1",
      name: "شركة التقنية العربية"
    }]
  },
  {
    id: "2",
    title: "إرسال عرض سعر",
    description: "إعداد وإرسال عرض سعر للخدمات المطلوبة",
    status: "completed",
    priority: "medium",
    due_date: "2025-04-17T14:00:00",
    lead_id: "lead-2",
    assigned_to: "user-1",
    created_by: "user-1",
    created_at: "2025-04-14T09:15:00",
    updated_at: "2025-04-16T11:30:00",
    assigned_to_name: "أحمد محمد",
    related_to: [{
      type: "lead",
      id: "lead-2",
      name: "مؤسسة النور للتجارة"
    }]
  },
  {
    id: "3",
    title: "اجتماع تقديمي",
    description: "تقديم عرض تفصيلي عن الخدمات",
    status: "in_progress",
    priority: "high",
    due_date: "2025-04-22T15:30:00",
    lead_id: "lead-3",
    assigned_to: "user-2",
    created_by: "user-3",
    created_at: "2025-04-16T13:45:00",
    updated_at: "2025-04-16T13:45:00",
    assigned_to_name: "سارة خالد",
    related_to: [{
      type: "lead",
      id: "lead-3",
      name: "شركة الأفق للتكنولوجيا"
    }]
  }
];

// Function to get tasks by related entity
export const getTasksByRelatedEntity = (entityType: string, entityId: string): Task[] => {
  return mockTasks.filter(task => 
    task.related_to && task.related_to.some(related => 
      related.type === entityType && related.id === entityId
    )
  );
};
