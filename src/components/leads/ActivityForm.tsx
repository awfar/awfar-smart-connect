
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const activityFormSchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'note'], {
    required_error: 'الرجاء اختيار نوع النشاط',
  }),
  description: z.string().min(5, {
    message: 'يجب أن يكون الوصف 5 أحرف على الأقل',
  }),
  date: z.date({
    required_error: 'الرجاء اختيار تاريخ',
  }),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  leadId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ActivityForm({ leadId, onSuccess, onCancel }: ActivityFormProps) {
  const [date, setDate] = useState<Date>(new Date());

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: 'note',
      description: '',
      date: new Date(),
    },
  });

  const onSubmit = async (values: ActivityFormValues) => {
    try {
      console.log('Submitting activity:', { ...values, leadId });
      
      // Here you would call your API to save the activity
      // const response = await createLeadActivity({...values, leadId});
      
      onSuccess();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
                  <SelectItem value="call">مكالمة هاتفية</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="note">ملاحظة</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>التفاصيل</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل تفاصيل النشاط هنا" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>التاريخ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
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
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          )}
          <Button type="submit">
            إضافة النشاط
          </Button>
        </div>
      </form>
    </Form>
  );
}
