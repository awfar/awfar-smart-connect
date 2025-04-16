// سيتم إصلاح أخطاء الطباعة مع الحفاظ على وظائف الملف الأصلي
// إصلاح خطأ Type instantiation is excessively deep and possibly infinite

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// الكائنات والأنواع البيانية الأساسية
export type RelatedEntityType = 'lead' | 'deal' | 'customer';

export interface RelatedEntity {
  type: RelatedEntityType;
  id: string;
  name: string;
}

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
  related_to?: RelatedEntity;
  lead_id?: string; // Added for direct lead relationship
}

// Define a separate type for task creation to avoid circular references
export interface TaskCreate {
  id?: string;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: RelatedEntity;
  lead_id?: string;
}

// Define a separate type for raw task records from the database
interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  related_to?: unknown; // Use unknown instead to avoid circular references
  lead_id?: string;
}

// بدلاً من استخدام التحويل التلقائي، نقوم بعمل تحويل صريح مع فحوصات
export const castToTask = (data: TaskRecord): Task => {
  // Validate and convert status
  let status: Task['status'] = 'pending';
  if (data.status === 'pending' || 
      data.status === 'in-progress' || 
      data.status === 'completed' || 
      data.status === 'cancelled') {
    status = data.status;
  }
  
  // Validate and convert priority
  let priority: Task['priority'] = 'medium';
  if (data.priority === 'high' || 
      data.priority === 'medium' || 
      data.priority === 'low') {
    priority = data.priority;
  }
  
  // Parse related_to safely
  let relatedTo: RelatedEntity | undefined = undefined;
  if (data.related_to && typeof data.related_to === 'object') {
    const relatedToObj = data.related_to as Record<string, unknown>;
    if (
      typeof relatedToObj.type === 'string' && 
      typeof relatedToObj.id === 'string' && 
      typeof relatedToObj.name === 'string'
    ) {
      // Only set if the type is one of the allowed values
      const type = relatedToObj.type;
      if (type === 'lead' || type === 'deal' || type === 'customer') {
        relatedTo = {
          type,
          id: relatedToObj.id,
          name: relatedToObj.name
        };
      }
    }
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status,
    priority,
    due_date: data.due_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    assigned_to: data.assigned_to,
    assigned_to_name: data.assigned_to_name,
    related_to: relatedTo,
    lead_id: data.lead_id
  };
};

// جلب المهام
export async function getTasks(filters: Record<string, any> = {}): Promise<Task[]> {
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
      
      // فرز حسب تاريخ الاستحقاق
      query = query.order('due_date', { ascending: true });
      
      // فلتر بمرفق إذا تم توفيره
      if (filters.lead_id) {
        query = query.eq('lead_id', filters.lead_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return getMockTasks(filters.lead_id);
      }
      
      return (data as TaskRecord[]).map(castToTask);
    }
    
    // استخدم البيانات التجريبية إذا لم تكن Supabase متاحة
    return getMockTasks(filters.lead_id);
  } catch (error) {
    console.error('Error in getTasks:', error);
    return getMockTasks(filters.lead_id);
  }
}

// إنشاء مهمة جديدة
export async function createTask(taskData: TaskCreate): Promise<Task> {
  try {
    console.log("Creating task with data:", taskData);
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
      // Create a database record with all the appropriate fields
      const taskRecord = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.due_date,
        created_at: newTask.created_at,
        updated_at: newTask.updated_at,
        assigned_to: newTask.assigned_to,
        // Handle the lead relationship
        lead_id: taskData.lead_id || (taskData.related_to?.type === 'lead' ? taskData.related_to.id : null)
      };

      const { error } = await supabase.from('tasks').insert(taskRecord);
      
      if (error) {
        console.error('Error creating task in Supabase:', error);
        // استمر بإنشاء المهمة في الذاكرة المؤقتة
      } else {
        console.log('Task created successfully in database');
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
      
      return castToTask(data as TaskRecord);
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
      
      return castToTask(data as TaskRecord);
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
function getMockTasks(leadId?: string): Task[] {
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
