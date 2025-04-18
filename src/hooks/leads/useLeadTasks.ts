
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { createTask, updateTask, deleteTask } from '@/services/tasks/api';
import { toast } from 'sonner';

// Add the missing getTasks function
const getTasks = async (filters?: { lead_id?: string; status?: string; assigned_to?: string }): Promise<Task[]> => {
  try {
    // This is a temporary implementation until we fix the API
    console.log("Fetching tasks with filters:", filters);
    // In a real implementation, this would call the API
    return [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("خطأ في جلب المهام");
    return [];
  }
};

export const useLeadTasks = (leadId?: string) => {
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Query for fetching tasks associated with a lead
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['leadTasks', leadId],
    queryFn: () => leadId ? getTasks({ lead_id: leadId }) : Promise.resolve([]),
    enabled: !!leadId,
  });

  // Mutation for adding a new task
  const { mutate: addTask, isPending: isAddingTask } = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      toast.success('تم إضافة المهمة بنجاح');
      setIsAddTaskOpen(false);
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast.error('فشل في إضافة المهمة');
    }
  });

  // Mutation for updating a task
  const { mutate: updateTaskMutation, isPending: isUpdatingTask } = useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) => 
      updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      toast.success('تم تحديث المهمة بنجاح');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('فشل في تحديث المهمة');
    }
  });

  // Mutation for deleting a task
  const { mutate: deleteTaskMutation, isPending: isDeletingTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      toast.success('تم حذف المهمة بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('فشل في حذف المهمة');
    }
  });

  // Function to handle adding a new task
  const handleAddTask = (taskData: Partial<TaskCreateInput>) => {
    if (!leadId) {
      toast.error('معرف العميل المحتمل غير موجود');
      return;
    }
    
    // Create task data with lead_id and required title field
    const taskCreateData = {
      title: taskData.title || 'مهمة جديدة',
      ...taskData,
      lead_id: leadId,
    };
    
    addTask(taskCreateData as TaskCreateInput);
  };

  // Function to handle updating a task
  const handleUpdateTask = (taskId: string, taskData: Partial<Task>) => {
    updateTaskMutation({ taskId, taskData });
  };

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation(taskId);
  };

  return {
    tasks,
    isLoading,
    isError,
    isAddTaskOpen,
    setIsAddTaskOpen,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    isAddingTask,
    isUpdatingTask,
    isDeletingTask,
    refetch
  };
};
