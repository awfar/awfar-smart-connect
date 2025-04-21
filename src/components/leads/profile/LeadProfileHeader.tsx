
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Lead } from '@/types/leads';
import { Badge } from '@/components/ui/badge';

interface LeadProfileHeaderProps {
  lead: Lead;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LeadProfileHeader: React.FC<LeadProfileHeaderProps> = ({
  lead,
  onBack,
  onEdit,
  onDelete,
}) => {
  // Function to get appropriate badge color based on lead status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'جديد':
      case 'new':
        return <Badge className="bg-blue-500">جديد</Badge>;
      case 'مؤهل':
      case 'qualified':
        return <Badge className="bg-green-500">مؤهل</Badge>;
      case 'اتصال أولي':
      case 'contacted':
        return <Badge className="bg-indigo-500">اتصال أولي</Badge>;
      case 'تفاوض':
      case 'negotiation':
        return <Badge className="bg-amber-500">تفاوض</Badge>;
      case 'عرض سعر':
      case 'proposal':
        return <Badge className="bg-purple-500">عرض سعر</Badge>;
      case 'عميل':
      case 'customer':
        return <Badge className="bg-emerald-500">عميل</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold">
            {lead.first_name} {lead.last_name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <div>{lead.company || 'بدون شركة'}</div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div>{lead.email}</div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div>{lead.phone || 'بدون رقم هاتف'}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 self-end md:self-auto">
        {getStatusBadge(lead.status)}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 ml-1.5" />
          تعديل
        </Button>
        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 className="h-4 w-4 ml-1.5" />
          حذف
        </Button>
      </div>
    </div>
  );
};

export default LeadProfileHeader;
