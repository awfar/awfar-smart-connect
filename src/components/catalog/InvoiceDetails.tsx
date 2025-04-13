
import React from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Invoice, updateInvoiceStatus } from "@/services/catalog/invoiceService";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileDown, Send, CreditCard, FileX, Clock } from "lucide-react";

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onStatusChange: () => void;
}

const statusColors: Record<Invoice['status'], { color: string, icon: React.ReactNode, label: string }> = {
  'draft': { color: 'bg-gray-200 text-gray-800', icon: <Clock className="h-4 w-4" />, label: 'مسودة' },
  'sent': { color: 'bg-blue-100 text-blue-800', icon: <Send className="h-4 w-4" />, label: 'مرسلة' },
  'paid': { color: 'bg-green-100 text-green-800', icon: <CreditCard className="h-4 w-4" />, label: 'مدفوعة' },
  'overdue': { color: 'bg-red-100 text-red-800', icon: <Clock className="h-4 w-4" />, label: 'متأخرة' },
  'cancelled': { color: 'bg-gray-100 text-gray-800', icon: <FileX className="h-4 w-4" />, label: 'ملغاة' },
};

export default function InvoiceDetails({ invoice, onClose, onStatusChange }: InvoiceDetailsProps) {
  const handleStatusChange = async (newStatus: Invoice['status']) => {
    try {
      let paidDate = undefined;
      if (newStatus === 'paid') {
        paidDate = new Date().toISOString().split('T')[0];
      }
      
      await updateInvoiceStatus(invoice.id, newStatus, paidDate);
      toast.success(`تم تغيير حالة الفاتورة إلى ${statusColors[newStatus].label}`);
      onStatusChange();
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الفاتورة");
    }
  };

  const getAvailableStatusActions = (currentStatus: Invoice['status']) => {
    switch (currentStatus) {
      case 'draft':
        return (
          <>
            <Button variant="default" className="gap-2" onClick={() => handleStatusChange('sent')}>
              <Send className="h-4 w-4" />
              إرسال الفاتورة
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => handleStatusChange('cancelled')}>
              <FileX className="h-4 w-4" />
              إلغاء
            </Button>
          </>
        );
      case 'sent':
        return (
          <>
            <Button variant="default" className="gap-2" onClick={() => handleStatusChange('paid')}>
              <CreditCard className="h-4 w-4" />
              تسجيل كمدفوعة
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => handleStatusChange('overdue')}>
              <Clock className="h-4 w-4" />
              تأخير الدفع
            </Button>
          </>
        );
      case 'overdue':
        return (
          <Button variant="default" className="gap-2" onClick={() => handleStatusChange('paid')}>
            <CreditCard className="h-4 w-4" />
            تسجيل كمدفوعة
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">فاتورة #{invoice.id}</h2>
          <p className="text-muted-foreground">
            {format(new Date(invoice.issueDate), "PPPP", { locale: ar })}
          </p>
        </div>
        <Badge className={`${statusColors[invoice.status].color} gap-1 px-3 py-1 text-sm`}>
          {statusColors[invoice.status].icon}
          {statusColors[invoice.status].label}
        </Badge>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">تفاصيل العميل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">اسم العميل</p>
              <p className="font-medium">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">معرف العميل</p>
              <p className="font-medium">{invoice.customerId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">بنود الفاتورة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-left">سعر الوحدة</TableHead>
                <TableHead className="text-left">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-left">{item.unitPrice} ر.س</TableCell>
                  <TableCell className="text-left">{item.totalPrice} ر.س</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-left font-bold">
                  الإجمالي
                </TableCell>
                <TableCell className="text-left font-bold">
                  {invoice.totalAmount} ر.س
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">معلومات إضافية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">تاريخ الإصدار</p>
              <p className="font-medium">
                {format(new Date(invoice.issueDate), "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">تاريخ الاستحقاق</p>
              <p className="font-medium">
                {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
              </p>
            </div>
            {invoice.paidDate && (
              <div>
                <p className="text-muted-foreground text-sm">تاريخ الدفع</p>
                <p className="font-medium">
                  {format(new Date(invoice.paidDate), "dd/MM/yyyy")}
                </p>
              </div>
            )}
          </div>

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-sm mb-1">ملاحظات</p>
                <p>{invoice.notes}</p>
              </div>
            </>
          )}

          {(invoice.subscriptionId || invoice.packageId) && (
            <>
              <Separator />
              <div className="space-y-2">
                {invoice.subscriptionId && (
                  <div>
                    <p className="text-muted-foreground text-sm">مرتبطة بالاشتراك</p>
                    <p className="font-medium">{invoice.subscriptionId}</p>
                  </div>
                )}
                {invoice.packageId && (
                  <div>
                    <p className="text-muted-foreground text-sm">مرتبطة بالباقة</p>
                    <p className="font-medium">{invoice.packageId}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" className="gap-2" onClick={onClose}>
            رجوع
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              تحميل الفاتورة
            </Button>
            {getAvailableStatusActions(invoice.status)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
