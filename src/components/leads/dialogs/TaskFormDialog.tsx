
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onClose,
  leadId,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Mock API call - in production this would call a real API
      console.log('Creating task:', {
        lead_id: leadId,
        title: data.title,
        description: data.description,
        due_date: dueDate ? dueDate.toISOString() : undefined,
        status: 'pending'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setDueDate(date);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة مهمة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">عنوان المهمة</label>
            <Input
              placeholder="أدخل عنوان المهمة"
              {...register('title', { required: 'العنوان مطلوب' })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">التفاصيل</label>
            <Textarea
              placeholder="أدخل تفاصيل المهمة"
              {...register('description')}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">تاريخ الاستحقاق</label>
            <DatePicker date={dueDate} onSelect={handleDateChange} />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جار الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
