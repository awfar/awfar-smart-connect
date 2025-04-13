
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Package, createPackage, updatePackage } from "@/services/catalog/packageService";
import { getProducts } from "@/services/catalog/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { packageSchema, PackageFormValues } from "./PackageFormFields";
import PackageFormFields from "./PackageFormFields";
import ProductSelectionList from "./ProductSelectionList";

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
            <PackageFormFields form={form} suggestedPrice={calculateSuggestedPrice()} />
            <ProductSelectionList products={products} form={form} />
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
