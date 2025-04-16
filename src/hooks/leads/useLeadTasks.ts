
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/tasks/api';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { toast } from 'sonner';

export const useLeadTasks = (leadId?: string) => {
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  // Query for fetching lead tasks
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
  
  // Mutation for creating a new task
  const { mutate: addTask, isPending: isAddingTask } = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Also invalidate global tasks
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
    mutationFn: ({ id, data }: { id: string, data: Partial<Task> }) => updateTask(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Also invalidate global tasks
      toast.success('تم تحديث المهمة بنجاح');
      setTaskToEdit(null);
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
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['leadTasks', leadId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Also invalidate global tasks
      toast.success('تم حذف المهمة بنجاح');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('فشل في حذف المهمة');
    }
  });
  
  // Function to handle adding a new task
  const handleAddTask = (taskData: TaskCreateInput) => {
    if (!leadId) {
      toast.error('معرف العميل المحتمل غير موجود');
      return;
    }
    
    addTask({
      ...taskData,
      lead_id: leadId,
      related_to_type: 'lead',
      related_to_id: leadId,
      related_to_name: taskData.related_to_name || ''
    });
  };
  
  // Function to handle updating a task
  const handleUpdateTask = (id: string, data: Partial<Task>) => {
    updateTaskMutation({ id, data });
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
    taskToEdit,
    setTaskToEdit,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    isAddingTask,
    isUpdatingTask,
    isDeletingTask,
    refetch
  };
};
