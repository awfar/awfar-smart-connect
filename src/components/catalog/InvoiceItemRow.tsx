
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { InvoiceFormValues } from "./InvoiceForm";

interface InvoiceItemRowProps {
  index: number;
  removeItem: (index: number) => void;
  updateItemPrice: (index: number) => void;
  canDelete: boolean;
}

export function InvoiceItemRow({ index, removeItem, updateItemPrice, canDelete }: InvoiceItemRowProps) {
  const form = useFormContext<InvoiceFormValues>();

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
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
          disabled={!canDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
