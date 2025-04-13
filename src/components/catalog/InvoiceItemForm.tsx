
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceFormValues } from "./InvoiceForm";
import { InvoiceItemRow } from "./InvoiceItemRow";
import { InvoiceItem } from "@/services/catalog/invoiceService";

interface InvoiceItemFormProps {
  calculateTotal: () => number;
}

export function InvoiceItemForm({ calculateTotal }: InvoiceItemFormProps) {
  const form = useFormContext<InvoiceFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Add a new item to the invoice with all required properties explicitly assigned
  const addItem = () => {
    // Create a new item with all required properties explicitly set as non-optional values
    const newItem: InvoiceItem = { 
      productId: "", 
      productName: "", 
      quantity: 1, 
      unitPrice: 0, 
      totalPrice: 0 
    };
    
    append(newItem);
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
        <InvoiceItemRow 
          key={field.id}
          index={index}
          removeItem={removeItem}
          updateItemPrice={updateItemPrice}
          canDelete={fields.length > 1}
        />
      ))}
    </div>
  );
}
