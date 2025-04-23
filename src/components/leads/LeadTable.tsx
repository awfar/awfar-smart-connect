
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types/leads";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStageColorClass } from "@/services/leads/utils";
import { Edit, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string | null) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onViewProfile: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedLead,
  onLeadSelect,
  onEdit,
  onDelete,
  onViewProfile,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy/MM/dd", { locale: ar });
    } catch (e) {
      return "-";
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لا يوجد عملاء محتملين</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">الاسم</TableHead>
            <TableHead>المرحلة</TableHead>
            <TableHead>المصدر</TableHead>
            <TableHead>الشركة</TableHead>
            <TableHead>المسؤول</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const isSelected = selectedLead === lead.id;
            const fullName = `${lead.first_name} ${lead.last_name}`;
            
            return (
              <TableRow 
                key={lead.id}
                className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted' : ''}`}
                onClick={() => onLeadSelect(isSelected ? null : lead.id)}
              >
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={lead.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{lead.first_name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{fullName}</div>
                      <div className="text-sm text-muted-foreground">{lead.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStageColorClass(lead.status || '')}>
                    {lead.status || 'جديد'}
                  </Badge>
                </TableCell>
                <TableCell>{lead.source || '-'}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>
                  {lead.owner ? (
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-1">
                        <AvatarFallback>{lead.owner.initials || '?'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{lead.owner.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">غير مخصص</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(lead.created_at)}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewProfile(lead.id)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>عرض الصفحة الكاملة</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(lead)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(lead.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>حذف</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
