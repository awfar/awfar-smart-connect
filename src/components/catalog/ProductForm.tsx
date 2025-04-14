
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  ProductType, 
  productTypeLabels,
  fetchCategories,
  Product,
  createProduct,
  updateProduct
} from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Ensuring required fields are included in the schema
const productSchema = z.object({
  name: z.string().min(1, { message: "الإسم مطلوب" }),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  price: z.coerce.number().nonnegative({ message: "السعر يجب أن يكون رقماً غير سالب" }),
  type: z.enum(['physical', 'digital', 'service', 'subscription'], {
    required_error: "نوع المنتج مطلوب",
  }),
  sku: z.string().min(1, { message: "رمز التخزين مطلوب" }),
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
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Convert product from DB format to form values format
  const getDefaultValues = (): ProductFormValues => {
    if (product) {
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        type: product.type as ProductType,
        sku: product.sku,
        is_active: product.is_active || false,
        image_url: product.image_url || '',
        inventory: product.inventory,
        category_id: product.category_id,
      };
    }
    
    return {
      name: "",
      description: "",
      price: 0,
      type: 'physical' as ProductType,
      sku: "",
      is_active: true,
      image_url: "",
      inventory: undefined,
      category_id: undefined,
    };
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const [showInventoryField, setShowInventoryField] = useState<boolean>(
    form.getValues().type === 'physical'
  );

  const watchType = form.watch('type');

  useEffect(() => {
    setShowInventoryField(watchType === 'physical');
  }, [watchType]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Convert from form values to DB format
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        sku: data.sku,
        is_active: data.is_active,
        image_url: data.image_url,
        inventory: data.type === 'physical' ? data.inventory : undefined,
        category_id: data.category_id
      };
      
      if (product) {
        await updateProduct(product.id, productData);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await createProduct(productData);
        toast.success("تم إضافة المنتج بنجاح");
      }
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
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإسم</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل إسم المنتج" />
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
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="أدخل وصف المنتج" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          {(Object.keys(productTypeLabels) as ProductType[]).map(type => (
                            <SelectItem key={type} value={type}>
                              {productTypeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز التخزين (SKU)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل رمز التخزين الفريد" />
                      </FormControl>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر تصنيف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories && Array.isArray(categories) && categories.map(category => (
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
              </div>

              {showInventoryField && (
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المخزون</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الصورة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل رابط صورة المنتج" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-2">
                    <FormLabel>نشط</FormLabel>
                    <FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            إلغاء
          </Button>
          <Button type="submit">{product ? "تحديث" : "إضافة"} المنتج</Button>
        </div>
      </form>
    </Form>
  );
}
