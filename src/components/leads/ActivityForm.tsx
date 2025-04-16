import React from 'react';
import { useForm } from 'react-hook-form';
import { LeadActivity } from '@/types/leads';
import { addLeadActivity } from '@/services/leads';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ActivityFormProps {
  leadId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  activity?: LeadActivity; // Add the activity prop for editing
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  leadId, 
  onSuccess, 
  onClose,
  title = "إضافة نشاط",
  activity // The activity to edit, if provided
}) => {
  // Initialize form with the activity data if it exists
  const { register, handleSubmit, formState, watch, setValue } = useForm({
    defaultValues: {
      type: activity?.type || 'note',
      description: activity?.description || '',
      scheduled_at: activity?.scheduled_at ? new Date(activity.scheduled_at).toISOString().slice(0, 16) : '',
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      console.log("Form data:", data);
      
      // Ensure scheduled_at is either a valid date string or null
      const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null;
      
      const activityData = {
        lead_id: leadId,
        type: data.type,
        description: data.description,
        scheduled_at: scheduledAt,
      };
      
      console.log("Creating lead activity:", activityData);
      
      await addLeadActivity(activityData);
      
      toast.success("تم إضافة النشاط بنجاح");
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error creating lead activity:", error);
      toast.error("فشل في إضافة النشاط");
    }
  };
  
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'yyyy/MM/dd HH:mm', { locale: ar }) : '';
  };

  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={{ ...register('type') }}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع النشاط</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع النشاط" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="note">ملاحظة</SelectItem>
                  <SelectItem value="call">مكالمة</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="task">مهمة</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={{ ...register('description') }}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل وصف النشاط"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={{ ...register('scheduled_at') }}
          name="scheduled_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ ووقت الجدولة</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(new Date(field.value))
                      ) : (
                        <span>اختر التاريخ والوقت</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    locale={ar}
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const isoString = new Date(date).toISOString().slice(0, 16);
                        setValue('scheduled_at', isoString);
                      }
                      field.onChange(date);
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            إضافة النشاط
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ActivityForm;
