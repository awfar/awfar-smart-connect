
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">نوع النشاط</label>
        <Select 
          defaultValue={watch?.('type') || 'note'} 
          onValueChange={(value) => setValue?.('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع النشاط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">ملاحظة</SelectItem>
            <SelectItem value="call">مكالمة</SelectItem>
            <SelectItem value="email">بريد إلكتروني</SelectItem>
            <SelectItem value="meeting">اجتماع</SelectItem>
            <SelectItem value="task">مهمة</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">الوصف</label>
        <Textarea
          placeholder="أدخل وصف النشاط"
          className="resize-none"
          {...register('description')}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">تاريخ ووقت الجدولة</label>
        <Input 
          type="datetime-local"
          {...register('scheduled_at')}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={onClose}>
          إلغاء
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'جاري الحفظ...' : 'إضافة النشاط'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
