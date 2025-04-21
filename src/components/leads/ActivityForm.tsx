
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addLeadActivity } from '@/services/leads/api';
import { toast } from 'sonner';
import { LeadActivityType } from '@/services/leads/types';

interface ActivityFormProps {
  leadId: string;
  activityType?: LeadActivityType;
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ leadId, activityType = 'note', onSuccess, onClose, title }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      type: activityType,
      description: '',
      scheduled_at: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formActivityType = watch('type');

  // Set the activity type when the activityType prop changes
  useEffect(() => {
    if (activityType) {
      setValue('type', activityType);
    }
  }, [activityType, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const activity = {
        lead_id: leadId,
        type: data.type as LeadActivityType,
        description: data.description,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString() : undefined
      };

      await addLeadActivity(activity);
      toast.success('تمت إضافة النشاط بنجاح');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('حدث خطأ أثناء إضافة النشاط');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      <div>
        <label className="text-sm font-medium">نوع النشاط</label>
        <Select 
          defaultValue={activityType}
          onValueChange={(value) => setValue('type', value as LeadActivityType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع النشاط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">ملاحظة</SelectItem>
            <SelectItem value="call">مكالمة هاتفية</SelectItem>
            <SelectItem value="meeting">اجتماع</SelectItem>
            <SelectItem value="email">بريد إلكتروني</SelectItem>
            <SelectItem value="task">مهمة</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">التفاصيل</label>
        <Textarea
          placeholder="أدخل تفاصيل النشاط"
          {...register('description', { required: 'التفاصيل مطلوبة' })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message?.toString()}</p>
        )}
      </div>
      
      {formActivityType !== 'note' && (
        <div>
          <label className="text-sm font-medium">الموعد المجدول</label>
          <Input 
            type="datetime-local" 
            {...register('scheduled_at')}
          />
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جار الحفظ...' : 'حفظ'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
