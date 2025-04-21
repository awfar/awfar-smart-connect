
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import DatePicker from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess?: () => void;
}

interface TaskFormData {
  title: string;
  description?: string;
  due_date?: Date;
  priority: string;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  onOpenChange,
  leadId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium'
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);

      const taskData = {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date ? data.due_date.toISOString() : null,
        priority: data.priority,
        lead_id: leadId,
        status: 'pending',
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase.from('tasks').insert(taskData);
      
      if (error) {
        throw error;
      }

      toast.success('تم إضافة المهمة بنجاح');
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('فشل في إضافة المهمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة مهمة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان المهمة<span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              placeholder="أدخل عنوان المهمة" 
              {...register('title', { required: true })} 
            />
            {errors.title && (
              <p className="text-red-500 text-sm">عنوان المهمة مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المهمة</Label>
            <Textarea 
              id="description" 
              placeholder="أدخل وصف المهمة" 
              {...register('description')} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
            <DatePicker 
              value={null} 
              onChange={(date) => setValue('due_date', date)} 
              placeholder="اختر تاريخ الاستحقاق"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">الأولوية</Label>
            <Select 
              onValueChange={(value) => setValue('priority', value)} 
              defaultValue="medium"
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              إضافة المهمة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
