
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyActivityFormProps {
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CompanyActivityForm = ({ companyId, onSuccess, onCancel }: CompanyActivityFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      type: 'meeting',
      description: '',
      scheduled_at: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('company_activities')
        .insert({
          company_id: companyId,
          ...data,
          scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null
        });

      if (error) throw error;

      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'company',
          entity_id: companyId,
          action: 'add_activity',
          details: `تمت إضافة نشاط جديد: ${data.type}`,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
        });

      if (logError) console.error('Error logging activity:', logError);

      toast.success('تم إضافة النشاط بنجاح');
      onSuccess();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('حدث خطأ أثناء إضافة النشاط');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="call">مكالمة</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="task">مهمة</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "الوصف مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="أدخل وصف النشاط" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduled_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>موعد النشاط</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
