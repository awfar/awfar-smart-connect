
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from "@/types/leads";
import { getStageColorClass, getInitials } from "@/services/leads/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, User, Building, Calendar, Phone, Mail, PieChart, 
  MoreVertical, Eye, Pencil, Trash2
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string) => void;
  isLoading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ 
  leads, 
  selectedLead, 
  onLeadSelect,
  isLoading = false,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();

  // التعامل مع النقر على صف
  const handleRowClick = (leadId: string) => {
    onLeadSelect(leadId);
  };

  // التعامل مع النقر المزدوج للانتقال إلى صفحة التفاصيل
  const handleRowDoubleClick = (leadId: string) => {
    navigate(`/dashboard/leads/${leadId}`);
  };
  
  // التعامل مع زر التعديل
  const handleEdit = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    if (onEdit) onEdit(lead);
  };
  
  // التعامل مع زر الحذف
  const handleDelete = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    if (onDelete) onDelete(leadId);
  };
  
  // التعامل مع النقر على زر العرض
  const handleView = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    navigate(`/dashboard/leads/${leadId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-2 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // عرض البطاقات للأجهزة المحمولة
  if (isMobile) {
    return (
      <div className="space-y-4 px-1">
        {leads.length > 0 ? (
          leads.map((lead) => {
            const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
            
            return (
              <div 
                key={lead.id} 
                className={cn(
                  "border rounded-lg p-3 shadow-sm transition-all", 
                  lead.id === selectedLead ? 'bg-muted/50 border-primary' : 'bg-white hover:bg-muted/20'
                )}
                onClick={() => handleRowClick(lead.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border-2 border-muted-foreground/10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-base">{fullName}</div>
                      {lead.company && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Building className="h-3 w-3 ml-1" />
                          {lead.company}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
                    {lead.status || lead.stage || 'جديد'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-y-2 mt-3 text-sm">
                  {lead.email && (
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                  )}
                  
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span dir="ltr">{lead.phone}</span>
                    </div>
                  )}
                  
                  {lead.source && (
                    <div className="flex items-center gap-2">
                      <PieChart className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{lead.source}</span>
                    </div>
                  )}
                  
                  {(lead.created_at || lead.createdAt) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{format(new Date(lead.created_at || lead.createdAt || ''), "yyyy/MM/dd", { locale: ar })}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-3 pt-2 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">خيارات</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => handleView(e, lead.id)}>
                        <Eye className="ml-2 h-4 w-4" />
                        <span>عرض التفاصيل</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleEdit(e, lead)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        <span>تعديل</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={(e) => handleDelete(e, lead.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        <span>حذف</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 px-4 border rounded-lg bg-muted/10">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
            <p className="text-xs text-muted-foreground mt-1">قم بإضافة عملاء محتملين جدد لعرضهم هنا</p>
          </div>
        )}
      </div>
    );
  }

  // عرض جدول للحاسوب
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-right font-medium">الاسم</th>
              <th className="h-10 px-4 text-right font-medium">الشركة</th>
              <th className="h-10 px-4 text-right font-medium">المرحلة</th>
              <th className="h-10 px-4 text-right font-medium">المصدر</th>
              <th className="h-10 px-4 text-right font-medium">المسؤول</th>
              <th className="h-10 px-4 text-right font-medium">تاريخ الإنشاء</th>
              <th className="h-10 px-4 text-right font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => {
                const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
                
                return (
                  <tr 
                    key={lead.id} 
                    className={`border-b hover:bg-muted/50 cursor-pointer transition-colors ${lead.id === selectedLead ? 'bg-muted/50' : ''}`}
                    onClick={() => handleRowClick(lead.id)}
                    onDoubleClick={() => handleRowDoubleClick(lead.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{fullName}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
                          {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {lead.company ? (
                        <div className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{lead.company}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={getStageColorClass(lead.status || lead.stage || 'جديد')}>
                        {lead.status || lead.stage || 'جديد'}
                      </Badge>
                    </td>
                    <td className="p-4">{lead.source || 'غير محدد'}</td>
                    <td className="p-4">
                      {lead.owner ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={lead.owner.avatar} />
                            <AvatarFallback>{lead.owner.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{lead.owner.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>غير مخصص</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {(lead.created_at || lead.createdAt) ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(lead.created_at || lead.createdAt || ''), "yyyy/MM/dd", { locale: ar })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => handleView(e, lead.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">عرض</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => handleEdit(e, lead)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">تعديل</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={(e) => handleDelete(e, lead.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  لا توجد بيانات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
