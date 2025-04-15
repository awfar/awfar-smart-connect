
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  lead_id?: string | null;
}

// Validate task status
function validateTaskStatus(status: string): 'pending' | 'in-progress' | 'completed' | 'cancelled' {
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  return validStatuses.includes(status) 
    ? status as 'pending' | 'in-progress' | 'completed' | 'cancelled'
    : 'pending'; // Default to pending if invalid
}

// Validate task priority
function validateTaskPriority(priority: string): 'low' | 'medium' | 'high' {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority) 
    ? priority as 'low' | 'medium' | 'high'
    : 'medium'; // Default to medium if invalid
}

// Simplified function to avoid excessive type instantiation
function castToTask(data: unknown): Task {
  const d = data as Record<string, unknown>;
  
  return {
    id: typeof d.id === 'string' ? d.id : String(d.id || ''),
    title: typeof d.title === 'string' ? d.title : String(d.title || ''),
    status: validateTaskStatus(typeof d.status === 'string' ? d.status : String(d.status || 'pending')),
    priority: validateTaskPriority(typeof d.priority === 'string' ? d.priority : String(d.priority || 'medium')),
    created_at: typeof d.created_at === 'string' ? d.created_at : String(d.created_at || new Date().toISOString()),
    updated_at: typeof d.updated_at === 'string' ? d.updated_at : String(d.updated_at || new Date().toISOString()),
    description: d.description ? String(d.description) : undefined,
    due_date: d.due_date ? String(d.due_date) : null,
    assigned_to: d.assigned_to ? String(d.assigned_to) : null,
    created_by: d.created_by ? String(d.created_by) : null,
    lead_id: d.lead_id ? String(d.lead_id) : null
  };
}

// Get all tasks
export const getTasks = async (filters: Record<string, any> = {}): Promise<Task[]> => {
  try {
    let query = supabase.from('tasks').select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.lead_id) {
      query = query.eq('lead_id', filters.lead_id);
    }
    
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }

    // Get data
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tasks:", error);
      toast.error("فشل في تحميل المهام");
      throw error;
    }
    
    // Transform data to tasks
    const tasks: Task[] = [];
    if (data) {
      for (const item of data) {
        tasks.push(castToTask(item));
      }
    }
    
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("فشل في تحميل المهام");
    return [];
  }
};

// Get task by ID
export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching task:", error);
      return null;
    }
    
    return data ? castToTask(data) : null;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

// Create a new task
export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    const newTask = {
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority),
      created_by: userId || task.created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating task:", error);
      toast.error("فشل في إنشاء المهمة");
      throw error;
    }
    
    toast.success("تم إنشاء المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("فشل في إنشاء المهمة");
    return null;
  }
};

// Update an existing task
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const taskUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Validate status and priority if they are being updated
    if (updates.status) {
      taskUpdates.status = validateTaskStatus(updates.status);
    }
    
    if (updates.priority) {
      taskUpdates.priority = validateTaskPriority(updates.priority);
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(taskUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating task:", error);
      toast.error("فشل في تحديث المهمة");
      throw error;
    }
    
    toast.success("تم تحديث المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("فشل في تحديث المهمة");
    return null;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting task:", error);
      toast.error("فشل في حذف المهمة");
      throw error;
    }
    
    toast.success("تم حذف المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("فشل في حذف المهمة");
    return false;
  }
};
