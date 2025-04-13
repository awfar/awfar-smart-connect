
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Product } from "@/services/catalogService";
import { PackageFormValues } from "./PackageFormFields";

interface ProductSelectionListProps {
  products: Product[];
  form: UseFormReturn<PackageFormValues>;
}

const ProductSelectionList: React.FC<ProductSelectionListProps> = ({ products, form }) => {
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

  return (
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
  );
};

export default ProductSelectionList;
