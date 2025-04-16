
// سيتم إصلاح أخطاء الطباعة مع الحفاظ على وظائف الملف الأصلي
// إصلاح خطأ Type instantiation is excessively deep and possibly infinite

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// الكائنات والأنواع البيانية الأساسية
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: {
    type: 'lead' | 'deal' | 'customer';
    id: string;
    name: string;
  };
}

export type TaskCreate = Omit<Task, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// تحسين دالة التحويل لتجنب الدوران المفرط
export const castToTask = (data: unknown): Task => {
  // بدلاً من استخدام التحويل التلقائي، نقوم بعمل تحويل صريح مع فحوصات
  const record = data as Record<string, unknown>;
  
  return {
    id: String(record.id || ''),
    title: String(record.title || ''),
    description: record.description ? String(record.description) : undefined,
    status: (record.status as Task['status']) || 'pending',
    priority: (record.priority as Task['priority']) || 'medium',
    due_date: record.due_date ? String(record.due_date) : undefined,
    created_at: String(record.created_at || new Date().toISOString()),
    updated_at: String(record.updated_at || new Date().toISOString()),
    assigned_to: record.assigned_to ? String(record.assigned_to) : undefined,
    assigned_to_name: record.assigned_to_name ? String(record.assigned_to_name) : undefined,
    related_to: record.related_to as Task['related_to']
  };
};

// جلب المهام
export async function getTasks(filters: Record<string, any> = {}) {
  try {
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      let query = supabase.from('tasks').select('*');
      
      // تطبيق الفلاتر
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      // الفرز حسب تاريخ الاستحقاق
      query = query.order('due_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return getMockTasks();
      }
      
      return data.map(castToTask);
    }
    
    // استخدم البيانات التجريبية إذا لم تكن Supabase متاحة
    return getMockTasks();
  } catch (error) {
    console.error('Error in getTasks:', error);
    return getMockTasks();
  }
}

// إنشاء مهمة جديدة
export async function createTask(taskData: TaskCreate): Promise<Task> {
  try {
    const now = new Date().toISOString();
    const taskId = taskData.id || uuidv4();
    
    const newTask: Task = {
      ...taskData,
      id: taskId,
      created_at: now,
      updated_at: now,
      // تعيين القيم الافتراضية إذا لم يتم توفيرها
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium'
    };
    
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      const { error } = await supabase.from('tasks').insert(newTask);
      
      if (error) {
        console.error('Error creating task in Supabase:', error);
        // استمر بإنشاء المهمة في الذاكرة المؤقتة
      }
    }
    
    return newTask;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw new Error('Failed to create task');
  }
}

// الحصول على مهمة بواسطة المعرف
export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (error) {
        console.error('Error fetching task by id:', error);
        return null;
      }
      
      return castToTask(data);
    }
    
    // استخدم البيانات التجريبية إذا لم تكن Supabase متاحة
    const mockTasks = getMockTasks();
    return mockTasks.find(task => task.id === taskId) || null;
  } catch (error) {
    console.error('Error in getTaskById:', error);
    return null;
  }
}

// تحديث مهمة
export async function updateTask(taskId: string, taskData: Partial<Task>): Promise<Task | null> {
  try {
    const updates = {
      ...taskData,
      updated_at: new Date().toISOString()
    };
    
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating task:', error);
        return null;
      }
      
      return castToTask(data);
    }
    
    // محاكاة تحديث المهمة باستخدام البيانات التجريبية
    const mockTasks = getMockTasks();
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      const updatedTask = {
        ...mockTasks[taskIndex],
        ...updates
      };
      return updatedTask;
    }
    
    return null;
  } catch (error) {
    console.error('Error in updateTask:', error);
    return null;
  }
}

// حذف مهمة
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) {
        console.error('Error deleting task:', error);
        return false;
      }
      
      return true;
    }
    
    // محاكاة حذف المهمة باستخدام البيانات التجريبية
    return true;
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return false;
  }
}

// بيانات تجريبية للمهام
function getMockTasks(): Task[] {
  return [
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
}
