
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from "@/services/leads";
import { getStageColorClass, getInitials } from "@/services/leads/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Building, Calendar } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string) => void;
  isLoading?: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({ 
  leads, 
  selectedLead, 
  onLeadSelect,
  isLoading = false
}) => {
  const navigate = useNavigate();

  const handleRowClick = (leadId: string) => {
    onLeadSelect(leadId);
  };

  const handleRowDoubleClick = (leadId: string) => {
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
                          <AvatarFallback>{fullName.charAt(0) || "؟"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{fullName}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
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
                      {lead.created_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(lead.created_at), "yyyy/MM/dd", { locale: ar })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
