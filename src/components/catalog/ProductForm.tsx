
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  fetchCategories,
  productTypeLabels,
  Product,
  createProduct,
  updateProduct
} from '@/services/catalogService';
import type { ProductType } from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, { message: 'اسم المنتج مطلوب' }),
  description: z.string().min(10, { message: 'وصف المنتج مطلوب ويجب أن يكون 10 أحرف على الأقل' }),
  price: z.coerce.number().min(0, { message: 'السعر مطلوب ويجب أن يكون أكبر من أو يساوي 0' }),
  type: z.enum(['physical', 'digital', 'service', 'subscription'], {
    required_error: 'يرجى اختيار نوع المنتج',
  }),
  sku: z.string().optional(),
  is_active: z.boolean().default(true),
  image_url: z.string().optional(),
  inventory: z.coerce.number().optional(),
  category_id: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("فشل في تحميل التصنيفات");
      }
    };
    
    loadCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          type: product.type as ProductType,
          sku: product.sku,
          is_active: product.is_active,
          image_url: product.image_url,
          inventory: product.inventory,
          category_id: product.category_id,
        }
      : {
          name: '',
          description: '',
          price: 0,
          type: 'physical' as ProductType,
          sku: '',
          is_active: true,
          image_url: '',
          inventory: 0,
          category_id: '',
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        sku: data.sku || '',
        is_active: data.is_active,
        image_url: data.image_url || '',
        inventory: data.inventory || 0,
        category_id: data.category_id || '',
      };
      
      if (product) {
        await updateProduct(product.id, productData);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await createProduct(productData);
        toast.success("تم إنشاء المنتج بنجاح");
      }
      
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
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
                  <FormLabel>وصف المنتج</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل وصف المنتج" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المنتج</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المنتج" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(productTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التصنيف</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر تصنيف المنتج" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون تصنيف</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="أدخل رمز المنتج" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('type') === 'physical' && (
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المخزون</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل رابط صورة المنتج" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">حالة المنتج</FormLabel>
                    <div className="text-sm text-gray-500">
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
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button onClick={() => onSuccess()} variant="outline" type="button">
            إلغاء
          </Button>
          <Button type="submit">
            {product ? 'تحديث المنتج' : 'إنشاء المنتج'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
