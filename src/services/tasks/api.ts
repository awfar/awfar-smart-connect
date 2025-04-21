
import { supabase } from '@/integrations/supabase/client';

// Task entity type definition
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  lead_id?: string | null;
  related_to?: any;
}

// Task filtering options
export interface TaskQueryOptions {
  status?: string;
  priority?: string;
  lead_id?: string;
  assigned_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

// Get all tasks with optional filtering
export const getTasks = async (options?: TaskQueryOptions): Promise<Task[]> => {
  try {
    let query = supabase.from('tasks').select('*');
    
    // Apply filters if provided
    if (options) {
      if (options.status) query = query.eq('status', options.status);
      if (options.priority) query = query.eq('priority', options.priority);
      if (options.lead_id) query = query.eq('lead_id', options.lead_id);
      if (options.assigned_to) query = query.eq('assigned_to', options.assigned_to);
      
      if (options.due_date_from) {
        query = query.gte('due_date', options.due_date_from);
      }
      
      if (options.due_date_to) {
        query = query.lte('due_date', options.due_date_to);
      }
      
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }
    }
    
    // Order by due date
    query = query.order('due_date', { ascending: true, nullsLast: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Get a single task by ID
export const getTask = async (id: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
};

// Create a new task
export const createTask = async (task: Partial<Task>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

// Update an existing task
export const updateTask = async (task: Partial<Task> & { id: string }): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', task.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating task ${task.id}:`, error);
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
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    return false;
  }
};

// Mark a task as completed
export const completeTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error completing task ${id}:`, error);
    return false;
  }
};

// Get counts for dashboard stats
export const getTaskCounts = async (): Promise<{
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}> => {
  try {
    // Get total and status counts
    const { data: statusData, error: statusError } = await supabase
      .from('tasks')
      .select('status', { count: 'exact', head: false })
      .eq('status', 'completed');
    
    const { data: totalData, error: totalError } = await supabase
      .from('tasks')
      .select('status', { count: 'exact', head: true });
    
    const { data: pendingData, error: pendingError } = await supabase
      .from('tasks')
      .select('status', { count: 'exact', head: false })
      .in('status', ['pending', 'in_progress']);
    
    // Get overdue tasks (due date in the past and not completed)
    const { data: overdueData, error: overdueError } = await supabase
      .from('tasks')
      .select('status', { count: 'exact', head: false })
      .lt('due_date', new Date().toISOString())
      .neq('status', 'completed');
    
    if (statusError || totalError || pendingError || overdueError) {
      throw new Error('Error fetching task counts');
    }
    
    return {
      total: totalData?.length || 0,
      completed: statusData?.length || 0,
      pending: pendingData?.length || 0,
      overdue: overdueData?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching task counts:', error);
    return { total: 0, completed: 0, pending: 0, overdue: 0 };
  }
};
