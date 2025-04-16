
import React from 'react';
import { useForm } from 'react-hook-form';
import { Task } from '@/services/tasks/types';
import { createTask, updateTask } from '@/services/tasks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TaskFormProps {
  leadId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  task?: Task; // Add the task prop for editing
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose,
  task // The task to edit, if provided
}) => {
  // Initialize form with the task data if it exists
  const { register, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      const dueDate = data.due_date ? new Date(data.due_date).toISOString() : undefined;
      
      const taskData = {
        ...data,
        due_date: dueDate,
        lead_id: leadId
      };

      if (task) {
        // Editing existing task
        await updateTask(task.id, taskData);
        toast.success("تم تحديث المهمة بنجاح");
      } else {
        // Creating a new task
        await createTask(taskData);
        toast.success("تم إنشاء المهمة بنجاح");
      }
      
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error creating/updating task:", error);
      toast.error("فشل في إنشاء/تحديث المهمة");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <Label htmlFor="title">عنوان المهمة</Label>
        <Input 
          id="title" 
          type="text" 
          placeholder="أدخل عنوان المهمة" 
          {...register("title", { required: 'العنوان مطلوب' })} 
        />
        {formState.errors.title && <p className="text-red-500 text-sm">{formState.errors.title.message?.toString()}</p>}
      </div>
      
      <div>
        <Label htmlFor="description">وصف المهمة</Label>
        <Textarea 
          id="description" 
          placeholder="أدخل وصف المهمة" 
          {...register("description")} 
        />
      </div>
      
      <div>
        <Label htmlFor="priority">الأولوية</Label>
        <Select 
          defaultValue={watch("priority") || "medium"}
          onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">منخفضة</SelectItem>
            <SelectItem value="medium">متوسطة</SelectItem>
            <SelectItem value="high">عالية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
        <Input
          id="due_date"
          type="datetime-local"
          {...register("due_date")}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>إلغاء</Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
