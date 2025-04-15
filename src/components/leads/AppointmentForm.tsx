
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createAppointment, Appointment } from '@/services/appointments';
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { TimePickerDemo } from '@/components/ui/time-picker-demo';

export interface AppointmentFormProps {
  leadId: string;
  onSuccess: (appointment?: Appointment) => void;
  onClose?: () => void; 
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: null as Date | null,
    startTime: "",
    endTime: "",
    status: "scheduled" as Appointment['status'],
    client_id: leadId,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert date and time to ISO string format
      const startDate = new Date(formData.date);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      const endDate = new Date(formData.date);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes);
      
      // Create the new appointment
      const newAppointment = await createAppointment({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        status: formData.status,
        client_id: formData.client_id,
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        date: null,
        startTime: "",
        endTime: "",
        status: "scheduled",
        client_id: leadId,
      });
      
      // Call the success callback with the new appointment
      onSuccess(newAppointment || undefined);
      
    } catch (error) {
      console.error("Error adding appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">عنوان الموعد</Label>
        <Input 
          id="title" 
          value={formData.title} 
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="أدخل عنوان الموعد"
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="description">التفاصيل</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="أدخل تفاصيل الموعد"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="location">المكان</Label>
        <Input 
          id="location" 
          value={formData.location} 
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="أدخل مكان الموعد"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label>التاريخ</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-right font-normal",
                !formData.date && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {formData.date ? (
                format(formData.date, "PPP", { locale: ar })
              ) : (
                "اختر تاريخ"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date || undefined}
              onSelect={(date) => handleChange('date', date)}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">وقت البدء</Label>
          <Input 
            id="startTime"
            type="time"
            value={formData.startTime} 
            onChange={(e) => handleChange('startTime', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="endTime">وقت الانتهاء</Label>
          <Input 
            id="endTime"
            type="time"
            value={formData.endTime} 
            onChange={(e) => handleChange('endTime', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="status">الحالة</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleChange('status', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">مجدول</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
            <SelectItem value="rescheduled">معاد جدولته</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        {onClose && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.title.trim() || !formData.date || !formData.startTime || !formData.endTime}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الإضافة...
            </>
          ) : "إضافة الموعد"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
