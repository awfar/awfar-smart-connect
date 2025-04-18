
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCreateInput } from "./types";
import { toast } from "sonner";
import { castToTask } from "./utils";

// Fetch tasks
export const getTasks = async (filterOptions?: {
  status?: string;
  assigned_to?: string;
  lead_id?: string;
}): Promise<Task[]> => {
  try {
    let query = supabase
      .from("tasks")
      .select(`
        *,
        assigned_profiles:assigned_to (
          id, first_name, last_name
        ),
        creator_profiles:created_by (
          id, first_name, last_name
        )
      `)
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (filterOptions) {
      if (filterOptions.status) {
        query = query.eq("status", filterOptions.status);
      }
      if (filterOptions.assigned_to) {
        query = query.eq("assigned_to", filterOptions.assigned_to);
      }
      if (filterOptions.lead_id) {
        query = query.eq("lead_id", filterOptions.lead_id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return (data || []).map(castToTask);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("حدث خطأ أثناء تحميل المهام");
    return [];
  }
};

// Create a new task
export const createTask = async (taskData: TaskCreateInput): Promise<Task> => {
  try {
    // Ensure required fields are present
    if (!taskData.title) {
      throw new Error("Task title is required");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || "pending",
        priority: taskData.priority || "medium",
        due_date: taskData.due_date,
        lead_id: taskData.lead_id,
        assigned_to: taskData.assigned_to,
        created_by: taskData.created_by,
      })
      .select()
      .single();

    if (error) throw error;

    toast.success("تم إنشاء المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("حدث خطأ أثناء إنشاء المهمة");
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date,
        assigned_to: taskData.assigned_to,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    toast.success("تم تحديث المهمة بنجاح");
    return castToTask(data);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("حدث خطأ أثناء تحديث المهمة");
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;

    toast.success("تم حذف المهمة بنجاح");
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("حدث خطأ أثناء حذف المهمة");
    return false;
  }
};

// Get tasks for a specific lead
export const getTasksByLeadId = async (leadId: string): Promise<Task[]> => {
  return getTasks({ lead_id: leadId });
};

// Complete a task
export const completeTask = async (taskId: string): Promise<Task> => {
  return updateTask(taskId, {
    status: 'completed',
    updated_at: new Date().toISOString()
  });
};
