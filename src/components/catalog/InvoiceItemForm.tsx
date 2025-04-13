
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceFormValues } from "./InvoiceForm";

interface InvoiceItemFormProps {
  calculateTotal: () => number;
}

export function InvoiceItemForm({ calculateTotal }: InvoiceItemFormProps) {
  const form = useFormContext<InvoiceFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Add a new item to the invoice
  const addItem = () => {
    append({ 
      productId: "", 
      productName: "", 
      quantity: 1, 
      unitPrice: 0, 
      totalPrice: 0 
    });
  };

  // Remove an item from the invoice
  const removeItem = (index: number) => {
    remove(index);
    calculateTotal();
  };

  // Update item price when quantity or unit price changes
  const updateItemPrice = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    const totalPrice = item.quantity * item.unitPrice;
    items[index].totalPrice = totalPrice;
    form.setValue("items", [...items]);
    calculateTotal();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">عناصر الفاتورة</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> إضافة عنصر
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-2 bg-muted p-2 rounded-md">
        <div className="col-span-4 text-sm font-medium">المنتج</div>
        <div className="col-span-2 text-sm font-medium">الكمية</div>
        <div className="col-span-2 text-sm font-medium">سعر الوحدة</div>
        <div className="col-span-3 text-sm font-medium">الإجمالي</div>
        <div className="col-span-1"></div>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name={`items.${index}.productName`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="اسم المنتج" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.productId`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="معرف المنتج" className="mt-1 text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                        updateItemPrice(index);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name={`items.${index}.unitPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step={0.01}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                        updateItemPrice(index);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name={`items.${index}.totalPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={fields.length <= 1}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
