
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(1, { message: "الإسم مطلوب" }),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً" }),
  products: z.array(z.string()),
  isActive: z.boolean().default(true),
});

export type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormFieldsProps {
  form: UseFormReturn<PackageFormValues>;
  suggestedPrice?: number;
}

const PackageFormFields: React.FC<PackageFormFieldsProps> = ({ form, suggestedPrice }) => {
  return (
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
              {suggestedPrice !== undefined && form.watch("products").length > 0 && (
                <div className="text-sm text-gray-500">
                  السعر المقترح: {suggestedPrice} ر.س
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
    </div>
  );
};

export default PackageFormFields;
export { packageSchema };
