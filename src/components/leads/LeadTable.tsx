
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useBreakpoints } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Lead } from "@/types/leads";

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ 
  leads, 
  selectedLead, 
  onLeadSelect, 
  onEdit, 
  onDelete 
}) => {
  const { isMobile, isSmallMobile } = useBreakpoints();

  // Helper to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), "d MMM", { locale: ar });
    } catch (error) {
      console.error("Date parsing error:", error, dateString);
      return '';
    }
  };

  // Get stage badge variant - Updated to use only valid badge variants
  const getStageBadgeVariant = (stage?: string) => {
    if (!stage) return "outline";
    
    switch (stage.toLowerCase()) {
      case 'جديد': case 'new': return "default";
      case 'مؤهل': case 'qualified': return "secondary";
      case 'يتفاوض': case 'negotiating': return "secondary"; // Changed from "warning"
      case 'فرصة': case 'opportunity': return "secondary";   // Changed from "info"
      case 'مغلق مكسب': case 'closed won': return "success";
      case 'مغلق خسارة': case 'closed lost': return "destructive";
      default: return "outline";
    }
  };

  if (isMobile) {
    // Mobile card view
    return (
      <div className="space-y-3">
        {leads.map((lead) => (
          <div 
            key={lead.id}
            className={cn(
              "relative border rounded-md overflow-hidden",
              selectedLead === lead.id ? "border-primary bg-primary/5" : "border-border bg-card"
            )}
            onClick={() => onLeadSelect(lead.id)}
          >
            <div className="p-3 pb-2.5 flex flex-col gap-1.5">
              {/* Name and Stage/Status in header row */}
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {lead.first_name} {lead.last_name}
                </div>
                <Badge variant={getStageBadgeVariant(lead.stage)}>
                  {lead.stage || 'غير محدد'}
                </Badge>
              </div>
              
              {/* Company and email */}
              <div className="text-sm text-muted-foreground flex flex-col">
                {lead.company && (
                  <div className="mb-0.5">{lead.company}</div>
                )}
                <div className="text-xs">{lead.email}</div>
                {lead.phone && (
                  <div className="text-xs mt-0.5">{lead.phone}</div>
                )}
              </div>

              {/* Bottom row with date and actions */}
              <div className="flex justify-between items-center mt-1 pt-1.5 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {lead.created_at ? formatDate(lead.created_at) : 'N/A'}
                </div>
                
                <div className="flex items-center">
                  {lead.owner && (
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={lead.owner.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {lead.owner.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(lead); }}>
                        <Edit className="h-4 w-4 ml-2" />
                        <span>تحرير</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        <span>حذف</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">الاسم</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">الشركة</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground hidden md:table-cell">البريد الإلكتروني</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground hidden lg:table-cell">الهاتف</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground">المرحلة</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground hidden lg:table-cell">المسؤول</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground hidden xl:table-cell">تاريخ الإضافة</th>
            <th className="text-center py-2 px-3 font-medium text-muted-foreground w-[50px]">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className={cn(
                "hover:bg-muted/50",
                selectedLead === lead.id ? "bg-primary/5" : ""
              )}
            >
              <td className="py-2 px-3 text-right font-medium">
                {lead.first_name} {lead.last_name}
              </td>
              <td className="py-2 px-3 text-right">{lead.company}</td>
              <td className="py-2 px-3 text-right hidden md:table-cell">{lead.email}</td>
              <td className="py-2 px-3 text-right hidden lg:table-cell">{lead.phone || "غير محدد"}</td>
              <td className="py-2 px-3 text-right">
                <Badge variant={getStageBadgeVariant(lead.stage)}>
                  {lead.stage || "غير محدد"}
                </Badge>
              </td>
              <td className="py-2 px-3 text-right hidden lg:table-cell">
                {lead.owner ? (
                  <div className="flex items-center justify-end gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={lead.owner.avatar} alt={lead.owner.name} />
                      <AvatarFallback>{lead.owner.initials}</AvatarFallback>
                    </Avatar>
                    <span>{lead.owner.name}</span>
                  </div>
                ) : (
                  "غير معين"
                )}
              </td>
              <td className="py-2 px-3 text-right hidden xl:table-cell">
                {formatDate(lead.created_at)}
              </td>
              <td className="py-2 px-3 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(lead)}>
                      <Edit className="h-4 w-4 ml-2" />
                      <span>تحرير</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(lead.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      <span>حذف</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
