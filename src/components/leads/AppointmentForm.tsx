
import React from 'react';
import { useForm } from 'react-hook-form';
import { Appointment } from '@/services/appointments/types';
import { createAppointment, updateAppointment } from '@/services/appointments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';

export interface AppointmentFormProps {
  leadId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  appointment?: Appointment;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose,
  onCancel,
  onSubmit,
  appointment
}) => {
  // Initialize form with the appointment data if it exists
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      start_time: appointment?.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : '',
      end_time: appointment?.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : '',
      location: appointment?.location || '',
    }
  });
  
  const onFormSubmit = async (data: any) => {
    const startTime = new Date(data.start_time).toISOString();
    const endTime = new Date(data.end_time).toISOString();
    
    const appointmentData = {
      ...data,
      start_time: startTime,
      end_time: endTime,
      client_id: leadId,
    };
    
    try {
      if (onSubmit) {
        // Use provided onSubmit function if available
        await onSubmit(appointmentData);
      } else {
        // Use default create/update logic if no onSubmit provided
        if (appointment) {
          // Editing existing appointment
          await updateAppointment(appointment.id, appointmentData);
        } else {
          // Creating a new appointment
          await createAppointment(appointmentData);
        }
      }
      
      onSuccess?.();
    } catch (error) {
      console.error("Error creating/updating appointment:", error);
    } finally {
      onClose?.();
    }
  };

  // Handle cancel - use either onCancel or onClose
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">عنوان الموعد</Label>
        <Input 
          id="title" 
          type="text" 
          placeholder="أدخل عنوان الموعد" 
          {...register("title", { required: true })} 
        />
      </div>
      
      <div>
        <Label htmlFor="description">وصف الموعد</Label>
        <Textarea 
          id="description" 
          placeholder="أدخل وصف الموعد" 
          {...register("description")} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">وقت البدء</Label>
          <div className="relative">
            <Input 
              id="start_time" 
              type="datetime-local" 
              {...register("start_time", { required: true })} 
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="end_time">وقت الانتهاء</Label>
          <div className="relative">
            <Input 
              id="end_time" 
              type="datetime-local" 
              {...register("end_time", { required: true })} 
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">الموقع</Label>
        <Input 
          id="location" 
          type="text" 
          placeholder="أدخل موقع الموعد" 
          {...register("location")} 
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ الموعد'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
