
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Package, Product, createPackage, updatePackage, getProducts } from "@/services/catalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

const packageSchema = z.object({
  name: z.string().min(1, { message: "الإسم مطلوب" }),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً" }),
  products: z.array(z.string()),
  isActive: z.boolean().default(true),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormProps {
  package?: Package;
  onSuccess: () => void;
}

export default function PackageForm({ package: pkg, onSuccess }: PackageFormProps) {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: pkg
      ? {
          ...pkg,
        }
      : {
          name: "",
          description: "",
          price: 0,
          products: [],
          isActive: true,
        },
  });

  const toggleProductSelection = (productId: string) => {
    const currentProducts = form.getValues("products");
    if (currentProducts.includes(productId)) {
      form.setValue(
        "products",
        currentProducts.filter((id) => id !== productId)
      );
    } else {
      form.setValue("products", [...currentProducts, productId]);
    }
  };

  const onSubmit = async (data: PackageFormValues) => {
    try {
      // Ensure all required fields are present
      const packageData: Omit<Package, 'id'> = {
        name: data.name,
        description: data.description,
        price: data.price,
        products: data.products,
        isActive: data.isActive
      };
      
      if (pkg) {
        await updatePackage(pkg.id, packageData);
        toast.success("تم تحديث الباقة بنجاح");
      } else {
        await createPackage(packageData);
        toast.success("تم إنشاء الباقة بنجاح");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("حدث خطأ أثناء حفظ الباقة");
    }
  };

  // Calculate total price based on selected products
  const calculateSuggestedPrice = () => {
    const selectedProductIds = form.getValues("products");
    const selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
    return selectedProducts.reduce((total, product) => total + product.price, 0);
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
                      <Input {...field} placeholder="أدخل إسم الباقة" />
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
                      <Textarea {...field} placeholder="أدخل وصف الباقة" />
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
                      {form.watch("products").length > 0 && (
                        <div className="text-sm text-gray-500">
                          السعر المقترح: {calculateSuggestedPrice()} ر.س
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-2">
                      <FormLabel>نشط</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">المنتجات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`product-${product.id}`} 
                        checked={form.watch("products").includes(product.id)} 
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <label 
                        htmlFor={`product-${product.id}`}
                        className="flex justify-between w-full cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <span>{product.name}</span>
                        <span className="font-bold">{product.price} ر.س</span>
                      </label>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-sm text-gray-500">لا توجد منتجات متاحة</p>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="products"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            إلغاء
          </Button>
          <Button type="submit">{pkg ? "تحديث" : "إنشاء"} الباقة</Button>
        </div>
      </form>
    </Form>
  );
}
