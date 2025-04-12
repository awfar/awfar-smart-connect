
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  stage: string;
  source?: string;
  owner?: {
    name: string;
    avatar: string;
    initials: string;
  };
  created_at: string;
}

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

  const getStageColorClass = (stage: string): string => {
    switch (stage.toLowerCase()) {
      case 'جديد':
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'مؤهل':
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'فرصة':
      case 'opportunity':
        return 'bg-purple-100 text-purple-800';
      case 'عرض سعر':
      case 'quotation':
        return 'bg-yellow-100 text-yellow-800';
      case 'تفاوض':
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'مغلق':
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          {leads.map((lead) => {
            const fullName = lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
            
            return (
              <tr 
                key={lead.id} 
                className={`border-b hover:bg-muted/50 cursor-pointer ${lead.id === selectedLead ? 'bg-muted/50' : ''}`}
                onClick={() => handleRowClick(lead.id)}
                onDoubleClick={() => handleRowDoubleClick(lead.id)}
              >
                <td className="p-4">
                  <div className="font-medium">{fullName}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </td>
                <td className="p-4">{lead.company || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStageColorClass(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="p-4">{lead.source || '-'}</td>
                <td className="p-4">
                  {lead.owner ? (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        {lead.owner.initials}
                      </div>
                      <span>{lead.owner.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            );
          })}
          
          {leads.length === 0 && (
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
