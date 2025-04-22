
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealInvoicesProps {
  dealId: string;
}

const DealInvoices = ({ dealId }: DealInvoicesProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>الفواتير</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 ml-2" />
            إنشاء فاتورة
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">لا توجد فواتير مرتبطة بهذه الصفقة.</p>
          <p className="text-muted-foreground text-sm mt-2">
            أنشئ فاتورة جديدة لإرسالها للعميل.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealInvoices;
