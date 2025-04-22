
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyContactFormProps {
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CompanyContactForm = ({ companyId, onSuccess, onCancel }: CompanyContactFormProps) => {
  const form = useForm({
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('company_contacts')
        .insert({
          company_id: companyId,
          ...data
        });

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_company_action', {
        p_company_id: companyId,
        p_action: 'add_contact',
        p_details: `تمت إضافة جهة اتصال: ${data.name}`,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('حدث خطأ أثناء إضافة جهة الاتصال');
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
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} placeholder="أدخل الاسم" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المنصب</FormLabel>
              <FormControl>
                <Input {...field} placeholder="أدخل المنصب" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="أدخل البريد الإلكتروني" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input {...field} placeholder="أدخل رقم الهاتف" />
              </FormControl>
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
