
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import DatePicker from "@/components/ui/date-picker";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, addHours } from 'date-fns';

interface AppointmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess?: () => void;
}

interface AppointmentFormData {
  title: string;
  description?: string;
  start_date?: Date;
  start_time?: string;
  end_time?: string;
  location?: string;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  isOpen,
  onOpenChange,
  leadId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<AppointmentFormData>({
    defaultValues: {
      title: '',
      description: '',
      start_time: '09:00',
      end_time: '10:00',
      location: ''
    }
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!selectedDate) {
        toast.error('يجب تحديد تاريخ الموعد');
        setIsSubmitting(false);
        return;
      }

      // Parse start time
      const [startHour, startMinute] = data.start_time?.split(':') || ['9', '0'];
      const startDate = new Date(selectedDate);
      startDate.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));

      // Parse end time
      const [endHour, endMinute] = data.end_time?.split(':') || ['10', '0'];
      const endDate = new Date(selectedDate);
      endDate.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));

      // Ensure end time is after start time
      if (endDate <= startDate) {
        toast.error('وقت الانتهاء يجب أن يكون بعد وقت البدء');
        setIsSubmitting(false);
        return;
      }

      const appointmentData = {
        title: data.title,
        description: data.description || null,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location: data.location || null,
        status: 'scheduled',
        client_id: leadId,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase.from('appointments').insert(appointmentData);
      
      if (error) {
        throw error;
      }

      toast.success('تم إضافة الموعد بنجاح');
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('فشل في إضافة الموعد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>جدولة موعد جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الموعد<span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              placeholder="أدخل عنوان الموعد" 
              {...register('title', { required: true })} 
            />
            {errors.title && (
              <p className="text-red-500 text-sm">عنوان الموعد مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الموعد</Label>
            <Textarea 
              id="description" 
              placeholder="أدخل وصف الموعد" 
              {...register('description')} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">تاريخ الموعد<span className="text-red-500">*</span></Label>
            <DatePicker 
              value={selectedDate} 
              onChange={(date) => setSelectedDate(date)} 
              placeholder="اختر تاريخ الموعد"
            />
            {!selectedDate && errors.start_date && (
              <p className="text-red-500 text-sm">تاريخ الموعد مطلوب</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">وقت البدء<span className="text-red-500">*</span></Label>
              <Input 
                id="start_time" 
                type="time"
                {...register('start_time', { required: true })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">وقت الانتهاء<span className="text-red-500">*</span></Label>
              <Input 
                id="end_time" 
                type="time"
                {...register('end_time', { required: true })} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">المكان</Label>
            <Input 
              id="location" 
              placeholder="أدخل مكان الموعد" 
              {...register('location')} 
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              إضافة الموعد
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
