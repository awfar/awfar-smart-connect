
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCreateInput, castToTask } from "./types";
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
    
    if (filterOptions) {
      if (filterOptions.status && filterOptions.status !== 'all') {
        query = query.eq('status', filterOptions.status);
      }
      if (filterOptions.assigned_to && filterOptions.assigned_to !== 'none') {
        query = query.eq('assigned_to', filterOptions.assigned_to);
      }
      if (filterOptions.lead_id && filterOptions.lead_id !== 'none') {
        query = query.eq('lead_id', filterOptions.lead_id);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
    
    return Array.isArray(data) ? data.map(castToTask) : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("حدث خطأ أثناء تحميل المهام");
    return [];
  }
};

export const getTasksByLeadId = async (leadId: string): Promise<Task[]> => {
  if (!leadId || leadId === 'none') {
    return [];
  }
  return getTasks({ lead_id: leadId });
};

export const createTask = async (taskData: TaskCreateInput): Promise<Task | null> => {
  try {
    // Filter out any 'none' values to prevent foreign key errors
    const cleanedData = Object.fromEntries(
      Object.entries(taskData).filter(([_, value]) => value !== 'none')
    );

    // Get current user for activity logging
    const { data: { user } } = await supabase.auth.getUser();

    // Ensure required fields are present
    if (!cleanedData.title) {
      toast.error("عنوان المهمة مطلوب");
      throw new Error("Task title is required");
    }

    // Add created_by if available 
    const dataToInsert = {
      ...cleanedData,
      title: cleanedData.title,
      status: cleanedData.status || 'pending',
      created_by: user?.id || null
    };

    // Log what we're about to insert for debugging
    console.log("Creating task with data:", dataToInsert);

    const { data, error } = await supabase
      .from('tasks')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      toast.error("حدث خطأ أثناء إنشاء المهمة");
      throw error;
    }

    console.log("Task created successfully:", data);
    toast.success("تم إنشاء المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("حدث خطأ أثناء إنشاء المهمة");
    return null;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task | null> => {
  try {
    // Filter out any 'none' values to prevent foreign key errors
    const cleanedData = Object.fromEntries(
      Object.entries(taskData).filter(([_, value]) => value !== 'none')
    );

    console.log("Updating task with ID:", taskId, "Data:", cleanedData);

    const { data, error } = await supabase
      .from('tasks')
      .update(cleanedData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      toast.error("حدث خطأ أثناء تحديث المهمة");
      throw error;
    }

    console.log("Task updated successfully:", data);
    toast.success("تم تحديث المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("حدث خطأ أثناء تحديث المهمة");
    return null;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("حدث خطأ أثناء حذف المهمة");
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

export const completeTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId);

    if (error) {
      console.error("Error completing task:", error);
      toast.error("حدث خطأ أثناء إكمال المهمة");
      throw error;
    }

    toast.success("تم إكمال المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    toast.error("حدث خطأ أثناء إكمال المهمة");
    return false;
  }
};
