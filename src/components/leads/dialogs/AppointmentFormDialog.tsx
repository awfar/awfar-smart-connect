
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

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess?: () => void;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  open,
  onClose,
  leadId,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = React.useState('10:00');
  const [endTime, setEndTime] = React.useState('11:00');
  
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      if (!startDate) {
        alert('يرجى تحديد تاريخ الموعد');
        setIsSubmitting(false);
        return;
      }
      
      // Create start and end datetime objects
      const startDateTime = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
      
      const endDateTime = new Date(startDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
      
      // Mock API call - in production this would call a real API
      console.log('Creating appointment:', {
        lead_id: leadId,
        title: data.title,
        description: data.description,
        location: data.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>جدولة موعد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">عنوان الموعد</label>
            <Input
              placeholder="أدخل عنوان الموعد"
              {...register('title', { required: 'العنوان مطلوب' })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message?.toString()}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">التفاصيل</label>
            <Textarea
              placeholder="أدخل تفاصيل الموعد"
              {...register('description')}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">التاريخ</label>
              <DatePicker date={startDate} onSelect={setStartDate} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">وقت البدء</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">وقت الانتهاء</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">المكان</label>
            <Input
              placeholder="أدخل مكان الموعد"
              {...register('location')}
            />
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

export default AppointmentFormDialog;
