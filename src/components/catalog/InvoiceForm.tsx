import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Invoice, InvoiceItem, createInvoice } from "@/services/catalog/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { format, addDays } from "date-fns";

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

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

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
          items: [{ 
            productId: "", 
            productName: "", 
            quantity: 1, 
            unitPrice: 0, 
            totalPrice: 0 
          }] as InvoiceItem[],
          status: "draft",
          issueDate: new Date(),
          dueDate: addDays(new Date(), 30),
          notes: "",
        },
  });

  // Add a new item to the invoice
  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems, 
      { 
        productId: "", 
        productName: "", 
        quantity: 1, 
        unitPrice: 0, 
        totalPrice: 0 
      } as InvoiceItem
    ]);
  };

  // Remove an item from the invoice
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العميل</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل اسم العميل" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معرف العميل</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل معرف العميل" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>حالة الفاتورة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حالة الفاتورة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ الإصدار</FormLabel>
                      <DatePicker
                        date={field.value}
                        onSelect={(date) => field.onChange(date)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ الاستحقاق</FormLabel>
                      <DatePicker
                        date={field.value}
                        onSelect={(date) => field.onChange(date)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

                {form.watch("items").map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
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
                        disabled={form.watch("items").length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4 border-t">
                  <div className="w-1/3 flex justify-between items-center p-2 bg-muted rounded-md">
                    <span className="font-medium">الإجمالي:</span>
                    <span className="font-bold">{calculateTotal()} ر.س</span>
                  </div>
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
  );
}
