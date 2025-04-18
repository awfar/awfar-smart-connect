
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./types";
import { toast } from "sonner";
import { castToTask } from "./utils";

export const getTasks = async (filters?: { lead_id?: string; status?: string }): Promise<Task[]> => {
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
    
    // Cast each task through our safety function
    return (data || []).map(castToTask);
  } catch (error) {
    console.error("Error in getTasks:", error);
    return [];
  }
};

export const createTask = async (task: Partial<Task>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("تم إنشاء المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("حدث خطأ أثناء إنشاء المهمة");
    return null;
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("تم تحديث المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("حدث خطأ أثناء تحديث المهمة");
    return null;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    toast.success("تم حذف المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("حدث خطأ أثناء حذف المهمة");
    return false;
  }
};

export const completeTask = async (id: string): Promise<Task | null> => {
  return updateTask(id, {
    status: 'completed'
  });
};
