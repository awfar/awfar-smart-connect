
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./types";
import { toast } from "sonner";

export const getTasks = async (filterOptions?: {
  status?: string;
  assigned_to?: string;
  lead_id?: string;
}): Promise<Task[]> => {
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    
    // Apply filters if provided
    if (filterOptions) {
      if (filterOptions.status) {
        query = query.eq('status', filterOptions.status);
      }
      if (filterOptions.assigned_to) {
        query = query.eq('assigned_to', filterOptions.assigned_to);
      }
      if (filterOptions.lead_id) {
        query = query.eq('lead_id', filterOptions.lead_id);
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Ensure we're returning a properly typed array by explicitly casting
    return (data || []) as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("حدث خطأ أثناء تحميل المهام");
    return [];
  }
};

export const getTasksByLeadId = async (leadId: string): Promise<Task[]> => {
  return getTasks({ lead_id: leadId });
};

export const createTask = async (taskData: any): Promise<Task> => {
  try {
    // Ensure status is one of the allowed values
    if (taskData.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(taskData.status)) {
      taskData.status = 'pending';
    }
    
    // Set default status if not provided
    if (!taskData.status) {
      taskData.status = 'pending';
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم إنشاء المهمة بنجاح");
    return data as Task;
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("حدث خطأ أثناء إنشاء المهمة");
    throw error;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
  try {
    // Ensure status is one of the allowed values
    if (taskData.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(taskData.status)) {
      taskData.status = 'pending';
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم تحديث المهمة بنجاح");
    return data as Task;
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("حدث خطأ أثناء تحديث المهمة");
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    toast.success("تم حذف المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("حدث خطأ أثناء حذف المهمة");
    return false;
  }
};

export const completeTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed' as const })
      .eq('id', taskId);

    if (error) throw error;

    toast.success("تم إكمال المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    toast.error("حدث خطأ أثناء إكمال المهمة");
    return false;
  }
};
