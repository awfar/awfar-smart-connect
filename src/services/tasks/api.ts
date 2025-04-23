
import { Task, TaskCreateInput } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper function to ensure task status is valid
const validateTaskStatus = (status: string): 'pending' | 'in_progress' | 'completed' | 'cancelled' => {
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  return validStatuses.includes(status) 
    ? status as 'pending' | 'in_progress' | 'completed' | 'cancelled'
    : 'pending';
};

// Helper function to ensure task priority is valid
const validateTaskPriority = (priority: string): 'low' | 'medium' | 'high' => {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority)
    ? priority as 'low' | 'medium' | 'high'
    : 'medium';
};

// Get all tasks
export const getTasks = async (filters?: Record<string, any>): Promise<Task[]> => {
  try {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        profiles:assigned_to(first_name, last_name),
        leads:lead_id(first_name, last_name, email)
      `);
    
    // Apply filters if provided
    if (filters) {
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.lead_id) query = query.eq('lead_id', filters.lead_id);
      if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    // Ensure each task has valid status and priority
    const typedTasks = (data || []).map(item => ({
      ...item,
      status: validateTaskStatus(item.status),
      priority: validateTaskPriority(item.priority)
    }));
    
    return typedTasks as Task[];
  } catch (error) {
    console.error('Error in getTasks:', error);
    return [];
  }
};

// Get tasks by lead ID
export const getTasksByLeadId = async (leadId: string): Promise<Task[]> => {
  try {
    if (!leadId) {
      console.warn('No lead ID provided to getTasksByLeadId');
      return [];
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks for lead:', error);
      throw error;
    }
    
    // Ensure each task has valid status and priority
    const typedTasks = (data || []).map(item => ({
      ...item,
      status: validateTaskStatus(item.status),
      priority: validateTaskPriority(item.priority)
    }));
    
    return typedTasks as Task[];
  } catch (error) {
    console.error('Error in getTasksByLeadId:', error);
    return [];
  }
};

// Create a new task
export const createTask = async (task: TaskCreateInput): Promise<Task | null> => {
  try {
    if (!task.title) {
      throw new Error('Task title is required');
    }
    
    // Get current user for created_by field if not provided
    if (!task.created_by) {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        task.created_by = authData.session.user.id;
      }
    }
    
    // Ensure status is valid
    const validatedTask = {
      ...task,
      status: validateTaskStatus(task.status || 'pending'),
      priority: validateTaskPriority(task.priority || 'medium')
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(validatedTask)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    
    // Log activity if lead_id is provided
    if (task.lead_id) {
      try {
        await logTaskActivity(data.id, 'created', task.lead_id);
      } catch (logError) {
        console.error('Error logging task activity:', logError);
      }
    }
    
    return {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority)
    } as Task;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (id: string, task: Partial<Task>): Promise<Task | null> => {
  try {
    if (!id) {
      throw new Error('Task ID is required for update');
    }
    
    // Get the current task data to log the activity properly
    const { data: currentTask } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    // Ensure task status is valid if provided
    if (task.status) {
      task.status = validateTaskStatus(task.status);
    }
    
    // Ensure task priority is valid if provided
    if (task.priority) {
      task.priority = validateTaskPriority(task.priority);
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    // Log activity if lead_id is available
    if (currentTask?.lead_id) {
      try {
        await logTaskActivity(id, 'updated', currentTask.lead_id);
      } catch (logError) {
        console.error('Error logging task activity:', logError);
      }
    }
    
    return {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority)
    } as Task;
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    // Get task data before deletion to use in activity log
    const { data: taskData } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
    
    // Log activity if lead_id was available
    if (taskData?.lead_id) {
      try {
        await logTaskActivity(id, 'deleted', taskData.lead_id);
      } catch (logError) {
        console.error('Error logging task activity:', logError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
};

// Helper function to log task activities
const logTaskActivity = async (taskId: string, action: 'created' | 'updated' | 'deleted', leadId: string) => {
  try {
    // Get current user
    const { data: authData } = await supabase.auth.getSession();
    if (!authData?.session?.user) return;
    
    const userId = authData.session.user.id;
    
    // Create activity record
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      type: 'task',
      description: `تم ${action === 'created' ? 'إنشاء' : action === 'updated' ? 'تحديث' : 'حذف'} مهمة`,
      created_by: userId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging task activity:', error);
  }
};

// Mark a task as complete
export const completeTask = async (id: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }
    
    // Log the completion activity
    if (data.lead_id) {
      try {
        await supabase.from('lead_activities').insert({
          lead_id: data.lead_id,
          type: 'task',
          description: 'تم إكمال المهمة',
          created_by: data.assigned_to || data.created_by,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });
      } catch (logError) {
        console.error('Error logging task completion:', logError);
      }
    }
    
    return {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority)
    } as Task;
  } catch (error) {
    console.error('Error in completeTask:', error);
    throw error;
  }
};
