
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
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// تعريف أنواع مراحل الصفقة
type DealStage = "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
type DealStatus = "active" | "won" | "lost";

// البيانات التجريبية للصفقات
const MOCK_DEALS = [
  { 
    id: 1, 
    name: "ترقية أنظمة تكنولوجيا المعلومات", 
    company: "شركة التقنية الحديثة",
    stage: "proposal" as DealStage, 
    status: "active" as DealStatus,
    value: 75000,
    owner: "محمد أحمد",
    expectedCloseDate: new Date(2025, 3, 25),
    createdAt: new Date(2025, 2, 10),
  },
  { 
    id: 2, 
    name: "تطوير نظام إدارة المستشفى", 
    company: "مستشفى النور",
    stage: "negotiation" as DealStage, 
    status: "active" as DealStatus,
    value: 120000,
    owner: "سارة خالد",
    expectedCloseDate: new Date(2025, 4, 15),
    createdAt: new Date(2025, 2, 5),
  },
  { 
    id: 3, 
    name: "توريد أجهزة حاسب آلي", 
    company: "مدارس المستقبل",
    stage: "closed_won" as DealStage, 
    status: "won" as DealStatus,
    value: 45000,
    owner: "فهد العمري",
    expectedCloseDate: new Date(2025, 3, 10),
    createdAt: new Date(2025, 1, 20),
  },
  { 
    id: 4, 
    name: "تطبيق إدارة علاقات العملاء", 
    company: "شركة البركة للتجارة",
    stage: "closed_lost" as DealStage, 
    status: "lost" as DealStatus,
    value: 60000,
    owner: "محمد أحمد",
    expectedCloseDate: new Date(2025, 3, 30),
    createdAt: new Date(2025, 2, 1),
  },
  { 
    id: 5, 
    name: "تطوير الموقع الإلكتروني", 
    company: "مجموعة الخليج",
    stage: "qualified" as DealStage, 
    status: "active" as DealStatus,
    value: 25000,
    owner: "سارة خالد",
    expectedCloseDate: new Date(2025, 5, 10),
    createdAt: new Date(2025, 3, 5),
  },
];

interface DealsListProps {
  view: "all" | "active" | "won" | "lost";
  filterStage: string;
  filterValue: string;
}

const DealsList = ({ view, filterStage, filterValue }: DealsListProps) => {
  // فلترة الصفقات بناءً على العرض والفلاتر
  const filteredDeals = MOCK_DEALS.filter(deal => {
    // فلترة حسب العرض (الكل، النشطة، المربوحة، المفقودة)
    if (view !== "all" && deal.status !== view) return false;
    
    // فلترة حسب المرحلة
    if (filterStage !== "all" && deal.stage !== filterStage) return false;
    
    // فلترة حسب القيمة
    if (filterValue !== "all") {
      if (filterValue === "low" && deal.value >= 10000) return false;
      if (filterValue === "medium" && (deal.value < 10000 || deal.value > 50000)) return false;
      if (filterValue === "high" && deal.value <= 50000) return false;
    }
    
    return true;
  });

  const getStageBadge = (stage: DealStage) => {
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

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
  };

  const handleEdit = (dealId: number) => {
    console.log("تعديل الصفقة", dealId);
  };

  const handleDelete = (dealId: number) => {
    console.log("حذف الصفقة", dealId);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الصفقة</TableHead>
            <TableHead>الشركة</TableHead>
            <TableHead>المرحلة</TableHead>
            <TableHead>القيمة</TableHead>
            <TableHead>المسؤول</TableHead>
            <TableHead>تاريخ الإغلاق المتوقع</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDeals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
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
                <TableCell>{deal.company}</TableCell>
                <TableCell>
                  {getStageBadge(deal.stage)}
                </TableCell>
                <TableCell dir="ltr" className="text-right">
                  {formatCurrency(deal.value)}
                </TableCell>
                <TableCell>{deal.owner}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span>{formatDate(deal.expectedCloseDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(deal.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(deal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/deal/${deal.id}`}>
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
  );
};

export default DealsList;
