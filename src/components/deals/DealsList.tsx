
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  Building
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Deal, deleteDeal } from "@/services/dealsService";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { 
  getDealStageName, 
  getDealStageBadgeColor,
  getDealStatusName
} from "@/services/deals/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DealsListProps {
  deals: Deal[];
  onRefresh: () => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
}

const DealsList = ({ deals, onRefresh, onSort, isLoading = false }: DealsListProps) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ column, direction });
    
    if (onSort) {
      onSort(column, direction);
    }
  };
  
  const getSortIcon = (column: string) => {
    if (sortConfig?.column !== column) {
      return null;
    }
    
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: ar });
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
  };

  const handleDeleteDeal = async (dealId: string) => {
    setDeletingId(dealId);
    
    try {
      const isDeleted = await deleteDeal(dealId);
      if (isDeleted) {
        toast.success("تم حذف الصفقة بنجاح");
        onRefresh(); // إعادة تحميل البيانات بعد الحذف
      }
    } catch (error) {
      console.error("خطأ في حذف الصفقة:", error);
      toast.error("فشل في حذف الصفقة");
    } finally {
      setDeletingId(null);
    }
  };

  const navigateToDeal = (dealId: string) => {
    navigate(`/dashboard/deals/${dealId}`);
  };

  const navigateToCompany = (companyId: string | undefined) => {
    if (companyId) {
      navigate(`/dashboard/companies/${companyId}`);
    }
  };

  const navigateToLead = (leadId: string | undefined) => {
    if (leadId) {
      navigate(`/dashboard/leads/${leadId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="mr-3">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">لا توجد صفقات متاحة</p>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  الصفقة {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead>الشركة</TableHead>
              <TableHead>جهة الاتصال</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 ml-1" /> القيمة {getSortIcon('value')}
                </div>
              </TableHead>
              <TableHead>المرحلة</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('expected_close_date')}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-1" /> تاريخ الإغلاق {getSortIcon('expected_close_date')}
                </div>
              </TableHead>
              <TableHead>المسؤول</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  تاريخ الإنشاء {getSortIcon('created_at')}
                </div>
              </TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <button 
                    className="font-medium text-primary hover:underline"
                    onClick={() => navigateToDeal(deal.id)}
                  >
                    {deal.name}
                  </button>
                </TableCell>
                <TableCell>
                  {deal.company_id ? (
                    <button
                      className="flex items-center text-sm hover:underline"
                      onClick={() => navigateToCompany(deal.company_id)}
                    >
                      <Building className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                      {deal.company_name || "-"}
                    </button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {deal.lead_id && deal.lead ? (
                    <button
                      className="flex items-center text-sm hover:underline"
                      onClick={() => navigateToLead(deal.lead_id)}
                    >
                      <User className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                      {deal.lead.name}
                    </button>
                  ) : deal.contact_name ? (
                    <span className="flex items-center text-sm">
                      <User className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                      {deal.contact_name}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell dir="ltr" className="text-right">
                  {formatCurrency(deal.value)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getDealStageBadgeColor(deal.stage)}`}>
                    {getDealStageName(deal.stage)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(deal.expected_close_date)}
                </TableCell>
                <TableCell>
                  {deal.owner ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 text-xs">
                              {deal.owner.initials}
                            </Avatar>
                            <span className="mr-2 text-sm hidden sm:inline-block">
                              {deal.owner.name}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{deal.owner.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground text-sm">غير معين</span>
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(deal.created_at)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      deal.status === 'active' ? 'default' :
                      deal.status === 'won' ? 'success' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {getDealStatusName(deal.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => navigateToDeal(deal.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteDeal(deal.id)}
                      disabled={deletingId === deal.id}
                    >
                      {deletingId === deal.id ? (
                        <span className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin block"></span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigateToDeal(deal.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DealsList;
