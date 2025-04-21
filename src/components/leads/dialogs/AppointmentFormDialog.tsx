
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AppointmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess?: () => void;
}

interface AppointmentFormData {
  title: string;
  description?: string;
  date?: Date;
  time?: string;
  duration?: number;
  type: string;
  location?: string;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  isOpen,
  onOpenChange,
  leadId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { register, handleSubmit, reset, setValue, watch } = useForm<AppointmentFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'meeting',
      time: '09:00',
      duration: 30,
      location: ''
    }
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a date string with the date and time
      let appointmentDate: string | null = null;
      if (date && data.time) {
        const [hours, minutes] = data.time.split(':').map(Number);
        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes);
        appointmentDate = dateObj.toISOString();
      }

      const appointmentData = {
        title: data.title,
        description: data.description || null,
        scheduled_at: appointmentDate,
        duration_minutes: data.duration || 30,
        type: data.type,
        location: data.location || null,
        lead_id: leadId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'scheduled'
      };

      const { error } = await supabase.from('appointments').insert(appointmentData);
      
      if (error) {
        throw error;
      }

      // Also add as an activity
      const activityDescription = `${data.type} "${data.title}"${data.location ? ` at ${data.location}` : ''}`;
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        type: 'meeting',
        description: activityDescription,
        scheduled_at: appointmentDate,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>إضافة موعد جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الموعد<span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              placeholder="أدخل عنوان الموعد" 
              {...register('title', { required: true })} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الموعد</Label>
            <Textarea 
              id="description" 
              placeholder="أدخل وصف الموعد" 
              {...register('description')} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ<span className="text-red-500">*</span></Label>
              <DatePicker 
                date={date}
                onSelect={setDate}
                placeholder="اختر التاريخ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">الوقت<span className="text-red-500">*</span></Label>
              <Input 
                id="time" 
                type="time" 
                {...register('time', { required: true })} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (بالدقائق)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="15" 
                step="15" 
                {...register('duration', { valueAsNumber: true })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">نوع الموعد</Label>
              <Select 
                onValueChange={(value) => setValue('type', value)} 
                defaultValue="meeting"
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الموعد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="call">مكالمة هاتفية</SelectItem>
                  <SelectItem value="video">مكالمة فيديو</SelectItem>
                  <SelectItem value="visit">زيارة ميدانية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">المكان</Label>
            <Input 
              id="location" 
              placeholder="أدخل مكان الموعد (اختياري)" 
              {...register('location')} 
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting || !date}>
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
