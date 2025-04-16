import React from 'react';
import { useForm } from 'react-hook-form';
import { Task } from '@/services/tasks/types';
import { createTask, updateTask } from '@/services/tasks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ar } from 'date-fns/locale';

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
  const { register, handleSubmit, formState } = useForm({
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
        {formState.errors.title && <p className="text-red-500 text-sm">{formState.errors.title.message}</p>}
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
        <Select defaultValue="medium" {...register("priority")}>
          <SelectTrigger className="w-full">
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
        <Label>تاريخ الاستحقاق</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !watch("due_date") && "text-muted-foreground"
              )}
            >
              {watch("due_date") ? (
                format(new Date(watch("due_date")), "yyyy/MM/dd", { locale: ar })
              ) : (
                <span>اختر تاريخ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="single"
              locale={ar}
              selected={watch("due_date") ? new Date(watch("due_date")) : undefined}
              onSelect={(date) => {
                if (date) {
                  const isoDate = date.toISOString().slice(0, 16);
                  setValue("due_date", isoDate);
                }
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
