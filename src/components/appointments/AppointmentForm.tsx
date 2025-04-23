
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Appointment, AppointmentLocation, AppointmentStatus, AppointmentType } from '@/services/appointments/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from '@/components/ui/checkbox';

export interface AppointmentFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  onClose?: () => void;
  appointment?: Appointment;
  leadId?: string;
  isSubmitting?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  onSubmit, 
  onCancel,
  onClose,
  appointment, 
  leadId,
  isSubmitting = false 
}) => {
  const [isAllDay, setIsAllDay] = useState(appointment?.is_all_day || false);
  
  // Parse start and end dates for initialization
  const startDate = appointment?.start_time ? new Date(appointment.start_time) : new Date();
  const endDate = appointment?.end_time ? new Date(appointment.end_time) : new Date(new Date().setHours(startDate.getHours() + 1));
  
  // Format time for input fields
  const formatTimeForInput = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const form = useForm({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      startDate: startDate,
      startTime: formatTimeForInput(startDate),
      endDate: endDate,
      endTime: formatTimeForInput(endDate),
      location: appointment?.location || 'office',
      location_details: appointment?.location_details || '',
      status: appointment?.status || 'scheduled',
      lead_id: leadId || appointment?.lead_id || '',
      company_id: appointment?.company_id || '',
      type: appointment?.type || 'meeting',
      related_deal_id: appointment?.related_deal_id || '',
      related_ticket_id: appointment?.related_ticket_id || '',
      notes: appointment?.notes || '',
      is_all_day: appointment?.is_all_day || false,
      reminder_time: appointment?.reminder_time || 10,
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      // Create combined date and time values
      const startDateTime = new Date(data.startDate);
      const endDateTime = new Date(data.endDate);

      if (!isAllDay) {
        const [startHours, startMinutes] = data.startTime.split(':').map(Number);
        const [endHours, endMinutes] = data.endTime.split(':').map(Number);
        
        startDateTime.setHours(startHours, startMinutes);
        endDateTime.setHours(endHours, endMinutes);
      } else {
        // For all-day events
        startDateTime.setHours(0, 0, 0, 0);
        endDateTime.setHours(23, 59, 59, 999);
      }

      // Validate dates
      if (endDateTime <= startDateTime) {
        toast.error("يجب أن يكون وقت الانتهاء بعد وقت البدء");
        return;
      }
      
      const formData = {
        ...data,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        is_all_day: isAllDay
      };
      
      // Remove fields that aren't part of our API
      delete formData.startDate;
      delete formData.startTime;
      delete formData.endDate;
      delete formData.endTime;
      
      await onSubmit(formData);
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("حدث خطأ في حفظ الموعد");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان الموعد</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل عنوان الموعد" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع الموعد</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الموعد" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="meeting">اجتماع</SelectItem>
                    <SelectItem value="call">مكالمة هاتفية</SelectItem>
                    <SelectItem value="virtual">اجتماع افتراضي</SelectItem>
                    <SelectItem value="in-person">مقابلة شخصية</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل وصف الموعد"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox 
            id="is_all_day" 
            checked={isAllDay} 
            onCheckedChange={(checked) => {
              setIsAllDay(checked === true);
              form.setValue('is_all_day', checked === true);
            }}
          />
          <label
            htmlFor="is_all_day"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            طوال اليوم
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ البداية</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>اختر التاريخ</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isAllDay && (
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وقت البداية</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <Timer className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ النهاية</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>اختر التاريخ</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isAllDay && (
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وقت النهاية</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                      />
                    </FormControl>
                    <Timer className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموقع</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الموقع" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                    <SelectItem value="office">مكتب</SelectItem>
                    <SelectItem value="other">آخر</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تفاصيل الموقع</FormLabel>
                <FormControl>
                  <Input placeholder="رابط الاجتماع أو مكان اللقاء" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">مجدول</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reminder_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وقت التذكير (بالدقائق)</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر وقت التذكير" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5 دقائق</SelectItem>
                    <SelectItem value="10">10 دقائق</SelectItem>
                    <SelectItem value="15">15 دقائق</SelectItem>
                    <SelectItem value="30">30 دقيقة</SelectItem>
                    <SelectItem value="60">ساعة</SelectItem>
                    <SelectItem value="120">ساعتين</SelectItem>
                    <SelectItem value="1440">يوم</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل ملاحظات إضافية عن الموعد"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الحفظ...' : appointment ? 'تحديث الموعد' : 'إضافة موعد'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
