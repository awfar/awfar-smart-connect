
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyDealFormProps {
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CompanyDealForm = ({ companyId, onSuccess, onCancel }: CompanyDealFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      name: '',
      value: '',
      stage: 'discovery',
      description: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('deals')
        .insert({
          company_id: companyId,
          ...data,
          value: parseFloat(data.value)
        });

      if (error) throw error;

      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'company',
          entity_id: companyId,
          action: 'add_deal',
          details: `تمت إضافة صفقة جديدة: ${data.name}`,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
        });

      if (logError) console.error('Error logging activity:', logError);
      
      toast.success('تم إضافة الصفقة بنجاح');
      onSuccess();
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('حدث خطأ أثناء إضافة الصفقة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "اسم الصفقة مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الصفقة</FormLabel>
              <FormControl>
                <Input {...field} placeholder="أدخل اسم الصفقة" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>القيمة</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="أدخل قيمة الصفقة" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المرحلة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المرحلة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="discovery">اكتشاف</SelectItem>
                  <SelectItem value="proposal">عرض تقديمي</SelectItem>
                  <SelectItem value="negotiation">تفاوض</SelectItem>
                  <SelectItem value="closed_won">تم الإغلاق (ربح)</SelectItem>
                  <SelectItem value="closed_lost">تم الإغلاق (خسارة)</SelectItem>
                </SelectContent>
              </Select>
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
