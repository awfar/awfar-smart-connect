
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from "@/services/leads";
import { getStageColorClass } from "@/services/leads/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeadTableProps {
  leads: Lead[];
  selectedLead: string | null;
  onLeadSelect: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, selectedLead, onLeadSelect }) => {
  const navigate = useNavigate();

  const handleRowClick = (leadId: string) => {
    onLeadSelect(leadId);
  };

  const handleRowDoubleClick = (leadId: string) => {
    navigate(`/dashboard/leads/${leadId}`);
  };

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-10 px-4 text-right font-medium">الاسم</th>
            <th className="h-10 px-4 text-right font-medium">الشركة</th>
            <th className="h-10 px-4 text-right font-medium">المرحلة</th>
            <th className="h-10 px-4 text-right font-medium">المصدر</th>
            <th className="h-10 px-4 text-right font-medium">المسؤول</th>
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
                    <div className="font-medium">{fullName}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </td>
                  <td className="p-4">{lead.company || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStageColorClass(lead.stage || 'جديد')}`}>
                      {lead.stage || 'جديد'}
                    </span>
                  </td>
                  <td className="p-4">{lead.source || '-'}</td>
                  <td className="p-4">
                    {lead.owner ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lead.owner.avatar} />
                          <AvatarFallback>{lead.owner.initials}</AvatarFallback>
                        </Avatar>
                        <span>{lead.owner.name}</span>
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
              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                لا توجد بيانات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
