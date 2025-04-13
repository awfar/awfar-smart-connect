
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Invoice, InvoiceItem, createInvoice } from "@/services/catalog/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { InvoiceTotals } from "./InvoiceTotals";

// Define schema for invoice item validation
const invoiceItemSchema = z.object({
  productId: z.string().min(1, { message: "معرف المنتج مطلوب" }),
  productName: z.string().min(1, { message: "اسم المنتج مطلوب" }),
  quantity: z.coerce.number().positive({ message: "الكمية يجب أن تكون رقماً موجباً" }),
  unitPrice: z.coerce.number().positive({ message: "سعر الوحدة يجب أن يكون رقماً موجباً" }),
  totalPrice: z.coerce.number().positive({ message: "السعر الإجمالي يجب أن يكون رقماً موجباً" }),
});

// Define schema for invoice validation
const invoiceSchema = z.object({
  customerId: z.string().min(1, { message: "معرف العميل مطلوب" }),
  customerName: z.string().min(1, { message: "اسم العميل مطلوب" }),
  items: z.array(invoiceItemSchema).min(1, { message: "يجب إضافة عنصر واحد على الأقل" }),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"], {
    required_error: "الرجاء تحديد حالة الفاتورة",
  }),
  issueDate: z.date(),
  dueDate: z.date(),
  notes: z.string().optional(),
  subscriptionId: z.string().optional(),
  packageId: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  invoice?: Omit<Invoice, "id">;
  onSuccess: () => void;
}

export default function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  // Initialize form with default values or provided invoice data
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice
      ? {
          ...invoice,
          issueDate: new Date(invoice.issueDate),
          dueDate: new Date(invoice.dueDate),
        }
      : {
          customerId: "",
          customerName: "",
          items: [
            {
              productId: "",  
              productName: "", 
              quantity: 1,    
              unitPrice: 0,   
              totalPrice: 0   
            }
          ] as InvoiceItem[],  // Explicitly cast the entire array as InvoiceItem[]
          status: "draft",
          issueDate: new Date(),
          dueDate: addDays(new Date(), 30),
          notes: "",
        },
  });

  // Calculate total amount of the invoice
  const calculateTotal = () => {
    const items = form.getValues("items");
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return totalAmount;
  };

  // Handle form submission
  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      const invoiceData: Omit<Invoice, 'id'> = {
        customerId: data.customerId,
        customerName: data.customerName,
        items: data.items,
        totalAmount: calculateTotal(),
        status: data.status,
        dueDate: format(data.dueDate, 'yyyy-MM-dd'),
        issueDate: format(data.issueDate, 'yyyy-MM-dd'),
        notes: data.notes,
        subscriptionId: data.subscriptionId,
        packageId: data.packageId,
      };
      
      await createInvoice(invoiceData);
      toast.success("تم إنشاء الفاتورة بنجاح");
      onSuccess();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("حدث خطأ أثناء حفظ الفاتورة");
    }
  };

  const statusOptions = [
    { value: "draft", label: "مسودة" },
    { value: "sent", label: "مرسلة" },
    { value: "paid", label: "مدفوعة" },
    { value: "overdue", label: "متأخرة" },
    { value: "cancelled", label: "ملغاة" },
  ];

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <InvoiceHeader statusOptions={statusOptions} />
                
                <InvoiceItemForm calculateTotal={calculateTotal} />
                
                <InvoiceTotals totalAmount={calculateTotal()} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onSuccess}>
              إلغاء
            </Button>
            <Button type="submit">إنشاء الفاتورة</Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
