
import React from 'react';
import { useForm } from 'react-hook-form';
import { Appointment } from '@/services/appointments/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AppointmentFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  appointment?: Appointment;
  leadId?: string;
  isSubmitting?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  onSubmit, 
  onCancel, 
  appointment, 
  leadId,
  isSubmitting = false 
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      start_time: appointment?.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : '',
      end_time: appointment?.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : '',
      location: appointment?.location || '',
      lead_id: leadId || appointment?.lead_id || ''
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      // Validate start and end times
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      
      if (endTime <= startTime) {
        toast.error("يجب أن يكون وقت الانتهاء بعد وقت البدء");
        return;
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("حدث خطأ في حفظ الموعد");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">عنوان الموعد</label>
        <Input 
          placeholder="أدخل عنوان الموعد"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="text-sm text-red-500">العنوان مطلوب</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">الوصف</label>
        <Textarea 
          placeholder="أدخل وصف الموعد"
          className="resize-none"
          {...register('description')}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">وقت البدء</label>
        <Input 
          type="datetime-local"
          {...register('start_time', { required: true })}
        />
        {errors.start_time && <p className="text-sm text-red-500">وقت البدء مطلوب</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">وقت الانتهاء</label>
        <Input 
          type="datetime-local"
          {...register('end_time', { required: true })}
        />
        {errors.end_time && <p className="text-sm text-red-500">وقت الانتهاء مطلوب</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">المكان</label>
        <Input 
          placeholder="أدخل مكان الموعد"
          {...register('location')}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : appointment ? 'تحديث الموعد' : 'إضافة موعد'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
