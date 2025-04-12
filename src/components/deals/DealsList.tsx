
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Deal, deleteDeal } from "@/services/dealsService";
import { useState } from "react";
import { toast } from "sonner";

interface DealsListProps {
  view: "all" | "active" | "won" | "lost";
  filterStage: string;
  filterValue: string;
  deals: Deal[];
  onRefresh: () => void;
}

const DealsList = ({ view, filterStage, filterValue, deals, onRefresh }: DealsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // فلترة الصفقات بناءً على العرض والفلاتر
  const filteredDeals = deals.filter(deal => {
    // فلترة حسب العرض (الكل، النشطة، المربوحة، المفقودة)
    if (view !== "all" && deal.status !== view) return false;
    
    // فلترة حسب المرحلة
    if (filterStage !== "all" && deal.stage !== filterStage) return false;
    
    // فلترة حسب القيمة
    if (filterValue !== "all") {
      const value = deal.value || 0;
      if (filterValue === "low" && value >= 10000) return false;
      if (filterValue === "medium" && (value < 10000 || value > 50000)) return false;
      if (filterValue === "high" && value <= 50000) return false;
    }
    
    return true;
  });

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "qualified": 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">مؤهل</Badge>;
      case "proposal": 
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">تم تقديم عرض</Badge>;
      case "negotiation": 
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">تفاوض</Badge>;
      case "closed_won": 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مربوح</Badge>;
      case "closed_lost": 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">خسارة</Badge>;
      default: 
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: ar });
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
  };

  const handleEdit = (dealId: string) => {
    console.log("تعديل الصفقة", dealId);
    // هنا سيتم تنفيذ منطق تعديل الصفقة
  };

  const handleDelete = async (dealId: string) => {
    setDeletingId(dealId);
    
    try {
      const isDeleted = await deleteDeal(dealId);
      if (isDeleted) {
        onRefresh(); // إعادة تحميل البيانات بعد الحذف
      }
    } catch (error) {
      console.error("خطأ في حذف الصفقة:", error);
      toast.error("فشل في حذف الصفقة");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" /> تحديث
        </Button>
      </div>
      
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصفقة</TableHead>
              <TableHead>الشركة</TableHead>
              <TableHead>المرحلة</TableHead>
              <TableHead>القيمة</TableHead>
              <TableHead>تاريخ الإغلاق المتوقع</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  لا توجد صفقات تطابق المعايير المحددة
                </TableCell>
              </TableRow>
            ) : (
              filteredDeals.map((deal) => (
                <TableRow key={deal.id} className={deal.stage === "closed_lost" ? "bg-muted/40" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {deal.name}
                      {deal.stage === "closed_won" && (
                        <span className="mr-2 bg-green-500 h-2 w-2 rounded-full" title="مربوح"></span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{deal.company_name || "-"}</TableCell>
                  <TableCell>
                    {getStageBadge(deal.stage)}
                  </TableCell>
                  <TableCell dir="ltr" className="text-right">
                    {formatCurrency(deal.value)}
                  </TableCell>
                  <TableCell>
                    {formatDate(deal.expected_close_date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(deal.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(deal.id)}
                        disabled={deletingId === deal.id}
                      >
                        {deletingId === deal.id ? (
                          <span className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin block"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/dashboard/deals/${deal.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DealsList;
