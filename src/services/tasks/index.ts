
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

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
    
    return data || [];
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
    
    return data;
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
    return data;
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
    return data;
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
