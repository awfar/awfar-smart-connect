import { Task, TaskCreateInput, RelatedEntity } from './types';
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

// Parse related_to JSON from database to proper typed structure
const parseRelatedTo = (relatedTo: any): RelatedEntity[] | undefined => {
  if (!relatedTo) return undefined;
  
  try {
    // If it's already an array of the correct type, return it
    if (Array.isArray(relatedTo) && 
        relatedTo.every(item => 
          typeof item === 'object' && 
          'type' in item && 
          'id' in item && 
          'name' in item)) {
      return relatedTo as RelatedEntity[];
    }
    
    // If it's a JSON string, parse it
    if (typeof relatedTo === 'string') {
      const parsed = JSON.parse(relatedTo);
      return Array.isArray(parsed) ? parsed as RelatedEntity[] : undefined;
    }
    
    // Otherwise, try to convert it if it has the right shape
    return undefined;
  } catch (error) {
    console.error('Error parsing related_to:', error);
    return undefined;
  }
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
    
    // Convert the DB response to our Task type with proper parsing
    const typedTasks = data.map(item => ({
      ...item,
      status: validateTaskStatus(item.status),
      priority: validateTaskPriority(item.priority),
      related_to: parseRelatedTo(item.related_to)
    })) as Task[];
    
    return typedTasks;
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
    
    // Convert the DB response to our Task type with proper parsing
    const typedTasks = data.map(item => ({
      ...item,
      status: validateTaskStatus(item.status),
      priority: validateTaskPriority(item.priority),
      related_to: parseRelatedTo(item.related_to)
    })) as Task[];
    
    return typedTasks;
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
    
    console.log("Creating task with data:", task);
    
    // Get current user for created_by field if not provided
    if (!task.created_by) {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        task.created_by = authData.session.user.id;
      }
    }
    
    // Create a typed object with required fields
    const taskData: {
      title: string;
      status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      priority: 'low' | 'medium' | 'high';
      description?: string;
      created_by?: string;
      due_date?: string;
      start_time?: string;
      assigned_to?: string;
      type?: string;
      lead_id?: string;
      deal_id?: string;
      company_id?: string;
      contact_id?: string;
      appointment_id?: string;
      related_to?: any;
    } = {
      title: task.title,
      status: validateTaskStatus(task.status || 'pending'),
      priority: validateTaskPriority(task.priority || 'medium'),
    };
    
    // Add optional fields only if they exist
    if (task.description !== undefined) taskData.description = task.description;
    if (task.created_by !== undefined) taskData.created_by = task.created_by;
    if (task.due_date !== undefined) taskData.due_date = task.due_date;
    if (task.start_time !== undefined) taskData.start_time = task.start_time;
    if (task.assigned_to !== undefined) taskData.assigned_to = task.assigned_to;
    if (task.type !== undefined) taskData.type = task.type;
    if (task.lead_id !== undefined) taskData.lead_id = task.lead_id;
    if (task.deal_id !== undefined) taskData.deal_id = task.deal_id;
    if (task.company_id !== undefined) taskData.company_id = task.company_id;
    if (task.contact_id !== undefined) taskData.contact_id = task.contact_id;
    if (task.appointment_id !== undefined) taskData.appointment_id = task.appointment_id;
    
    // Ensure related_to is properly serialized if it exists
    if (task.related_to) {
      taskData.related_to = JSON.stringify(task.related_to);
    }
    
    console.log("Inserting task with processed data:", taskData);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      toast.error("فشل في إنشاء المهمة");
      throw error;
    }
    
    console.log("Task created successfully:", data);
    
    // Log activity if lead_id is provided
    if (task.lead_id) {
      try {
        await logTaskActivity(data.id, 'created', task.lead_id);
      } catch (logError) {
        console.error('Error logging task activity:', logError);
      }
    }
    
    toast.success("تم إنشاء المهمة بنجاح");
    
    // Convert the response to our Task type
    const result: Task = {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority),
      related_to: parseRelatedTo(data.related_to)
    };
    
    return result;
  } catch (error) {
    console.error('Error in createTask:', error);
    toast.error("لم يتم حفظ المهمة");
    return null;
  }
};

// Update a task
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
    
    // Prepare the task data for update
    const updateData: Record<string, any> = {};
    
    // Copy over fields that don't need transformation
    if (task.title !== undefined) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.due_date !== undefined) updateData.due_date = task.due_date;
    if (task.start_time !== undefined) updateData.start_time = task.start_time;
    if (task.assigned_to !== undefined) updateData.assigned_to = task.assigned_to;
    if (task.lead_id !== undefined) updateData.lead_id = task.lead_id;
    if (task.deal_id !== undefined) updateData.deal_id = task.deal_id;
    if (task.company_id !== undefined) updateData.company_id = task.company_id;
    if (task.contact_id !== undefined) updateData.contact_id = task.contact_id;
    if (task.type !== undefined) updateData.type = task.type;
    
    // Special handling for status
    if (task.status !== undefined) {
      updateData.status = validateTaskStatus(task.status);
    }
    
    // Special handling for priority
    if (task.priority !== undefined) {
      updateData.priority = validateTaskPriority(task.priority);
    }
    
    // Special handling for related_to - convert to JSON string
    if (task.related_to !== undefined) {
      updateData.related_to = JSON.stringify(task.related_to);
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
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
    
    // Convert the response to our Task type
    const result: Task = {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority),
      related_to: parseRelatedTo(data.related_to)
    };
    
    return result;
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
    
    // Convert the response to our Task type
    const result: Task = {
      ...data,
      status: validateTaskStatus(data.status),
      priority: validateTaskPriority(data.priority),
      related_to: parseRelatedTo(data.related_to)
    };
    
    return result;
  } catch (error) {
    console.error('Error in completeTask:', error);
    throw error;
  }
};
