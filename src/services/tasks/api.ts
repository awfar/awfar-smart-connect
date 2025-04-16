
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCreateInput, TaskRecord } from './types';
import { castToTask } from './utils';
import { getMockTasks } from './mockData';

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
export async function createTask(taskData: TaskCreateInput): Promise<Task> {
  try {
    console.log("Creating task with data:", taskData);
    const now = new Date().toISOString();
    const taskId = taskData.id || uuidv4();
    
    // Create a new task object
    const newTask: Task = {
      id: taskId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || undefined,
      created_at: now,
      updated_at: now,
      assigned_to: taskData.assigned_to,
      assigned_to_name: taskData.assigned_to_name,
      lead_id: taskData.lead_id
    };
    
    // Only add related_to if it exists in the input
    if (taskData.related_to) {
      newTask.related_to = {
        type: taskData.related_to.type,
        id: taskData.related_to.id,
        name: taskData.related_to.name
      };
    }
    
    // في بيئة الإنتاج، استخدم Supabase
    if (typeof supabase !== 'undefined') {
      // Create a database record
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
        assigned_to_name: newTask.assigned_to_name,
        lead_id: taskData.lead_id || (taskData.related_to?.type === 'lead' ? taskData.related_to.id : null),
        related_to: newTask.related_to ? JSON.stringify(newTask.related_to) : null
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
