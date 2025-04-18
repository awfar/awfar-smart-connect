
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskCreateInput } from '@/services/tasks/types';
import { toast } from 'sonner';

export interface TaskFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  task?: Task;
  leadId?: string;
  isSubmitting?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onCancel, 
  task, 
  leadId,
  isSubmitting = false 
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'pending',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      lead_id: leadId || task?.lead_id || '',
      assigned_to: task?.assigned_to || ''
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("حدث خطأ في حفظ المهمة");
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setValue(field, value);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">عنوان المهمة</label>
        <Input 
          placeholder="أدخل عنوان المهمة"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="text-sm text-red-500">العنوان مطلوب</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">الوصف</label>
        <Textarea 
          placeholder="أدخل وصف المهمة"
          className="resize-none"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">الأولوية</label>
          <Select 
            value={watch('priority')} 
            onValueChange={(value) => handleSelectChange('priority', value)}
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

        <div className="space-y-2">
          <label className="text-sm font-medium">الحالة</label>
          <Select 
            value={watch('status')} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
              <SelectItem value="completed">مكتملة</SelectItem>
              <SelectItem value="cancelled">ملغاة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">تاريخ الاستحقاق</label>
        <Input 
          type="datetime-local"
          {...register('due_date')}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : task ? 'تحديث المهمة' : 'إضافة مهمة'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
