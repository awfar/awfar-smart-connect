
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceFormValues } from "./InvoiceForm";

interface InvoiceTotalsProps {
  totalAmount: number;
}

export function InvoiceTotals({ totalAmount }: InvoiceTotalsProps) {
  const form = useFormContext<InvoiceFormValues>();

  return (
    <>
      <div className="flex justify-end pt-4 border-t">
        <div className="w-1/3 flex justify-between items-center p-2 bg-muted rounded-md">
          <span className="font-medium">الإجمالي:</span>
          <span className="font-bold">{totalAmount} ر.س</span>
        </div>
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملاحظات</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="أضف ملاحظات للفاتورة..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
