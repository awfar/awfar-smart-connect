
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Product, ProductType, createProduct } from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, { message: 'اسم المنتج يجب أن يكون على الأقل 3 أحرف' }),
  description: z.string().min(10, { message: 'وصف المنتج يجب أن يكون على الأقل 10 أحرف' }),
  price: z.coerce.number().min(0, { message: 'يجب أن يكون السعر 0 أو أكثر' }),
  type: z.enum(['physical', 'digital', 'service', 'subscription']),
  sku: z.string().min(3, { message: 'رمز المنتج يجب أن يكون على الأقل 3 أحرف' }),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
  inventory: z.coerce.number().min(0).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      type: 'physical',
      sku: '',
      isActive: true,
      imageUrl: '',
    },
  });

  const showInventory = form.watch('type') === 'physical';

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have all required fields before submission
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type as ProductType,
        sku: data.sku,
        isActive: data.isActive,
      };
      
      // Add optional fields if they exist
      if (data.imageUrl) productData.imageUrl = data.imageUrl;
      if (showInventory && data.inventory !== undefined) productData.inventory = data.inventory;
      
      await createProduct(productData);
      
      toast.success('تم إنشاء المنتج بنجاح');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('حدث خطأ أثناء إنشاء المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Textarea placeholder="أدخل وصفاً للمنتج" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر (ر.س)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
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
                  <Input placeholder="PRD-001" {...field} />
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
              <FormControl>
                <RadioGroup 
                  className="grid grid-cols-2 gap-4"
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="physical" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">منتج مادي</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="digital" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">منتج رقمي</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="service" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">خدمة</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="subscription" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">اشتراك</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
                    min="0" 
                    step="1" 
                    {...field} 
                    value={field.value || 0}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  عدد الوحدات المتوفرة في المخزون
                </FormDescription>
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
                <FormLabel className="text-base">تفعيل المنتج</FormLabel>
                <FormDescription>
                  سيظهر المنتج في الكتالوج إذا كان مفعلاً
                </FormDescription>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء المنتج'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
