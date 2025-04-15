
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

// Completely redesigned castToTask function to avoid type instantiation issues
function castToTask(data: Record<string, any>): Task {
  return {
    id: String(data.id || ''),
    title: String(data.title || ''),
    status: validateTaskStatus(String(data.status || '')),
    priority: validateTaskPriority(String(data.priority || '')),
    created_at: String(data.created_at || new Date().toISOString()),
    updated_at: String(data.updated_at || new Date().toISOString()),
    description: data.description ? String(data.description) : undefined,
    due_date: data.due_date ? String(data.due_date) : null,
    assigned_to: data.assigned_to ? String(data.assigned_to) : null,
    created_by: data.created_by ? String(data.created_by) : null,
    lead_id: data.lead_id ? String(data.lead_id) : null
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
    
    return (data || []).map(item => castToTask(item));
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
