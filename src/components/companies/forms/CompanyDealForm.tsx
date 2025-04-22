
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
      const { error } = await supabase
        .from('deals')
        .insert({
          company_id: companyId,
          ...data,
          value: parseFloat(data.value)
        });

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_company_action', {
        p_company_id: companyId,
        p_action: 'add_deal',
        p_details: `تمت إضافة صفقة جديدة: ${data.name}`,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('حدث خطأ أثناء إضافة الصفقة');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit">
            حفظ
          </Button>
        </div>
      </form>
    </Form>
  );
};
