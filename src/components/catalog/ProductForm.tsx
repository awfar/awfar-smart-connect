
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import { createProduct, ProductType } from '@/services/catalogService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'اسم المنتج يجب أن يتكون من حرفين على الأقل',
  }),
  description: z.string().min(10, {
    message: 'وصف المنتج يجب أن يتكون من 10 أحرف على الأقل',
  }),
  price: z.number().min(0, {
    message: 'السعر لا يمكن أن يكون سالباً',
  }),
  type: z.enum(['physical', 'digital', 'service', 'subscription']),
  sku: z.string().min(3, {
    message: 'رمز المنتج يجب أن يتكون من 3 أحرف على الأقل',
  }),
  isActive: z.boolean().default(true),
  inventory: z.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      type: 'physical',
      sku: '',
      isActive: true,
      inventory: 0,
      imageUrl: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم إنشاء المنتج بنجاح');
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء المنتج');
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    mutation.mutate(values);
  };

  const productType = form.watch('type');
  const showInventory = productType === 'physical';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rtl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المنتج</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم المنتج" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المنتج</FormLabel>
              <FormControl>
                <Textarea placeholder="أدخل وصفاً للمنتج" {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر (ر.س)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز المنتج (SKU)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: PRD-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع المنتج</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المنتج" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="physical">منتج مادي</SelectItem>
                  <SelectItem value="digital">منتج رقمي</SelectItem>
                  <SelectItem value="service">خدمة</SelectItem>
                  <SelectItem value="subscription">اشتراك</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {showInventory && (
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المخزون</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة (اختياري)</FormLabel>
              <FormControl>
                <Input placeholder="أدخل رابط صورة المنتج" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">حالة المنتج</FormLabel>
                <div className="text-sm text-muted-foreground">
                  هل المنتج متاح للبيع؟
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المنتج'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
