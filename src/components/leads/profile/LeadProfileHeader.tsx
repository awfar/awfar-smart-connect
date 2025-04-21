
import React from 'react';
import { ChevronRight, Edit, Calendar, FileText, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Lead } from '@/types/leads';
import { getStageColorClass } from '@/services/leads/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LeadProfileHeaderProps {
  lead: Lead;
  onEdit: () => void;
  onBackToLeads: () => void;
  onAddActivity: () => void;
  onAddTask: () => void;
  onAddAppointment: () => void;
}

const LeadProfileHeader: React.FC<LeadProfileHeaderProps> = ({ 
  lead, 
  onEdit, 
  onBackToLeads,
  onAddActivity,
  onAddTask,
  onAddAppointment
}) => {
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  const createdDate = lead.created_at ? format(new Date(lead.created_at), 'yyyy/MM/dd', { locale: ar }) : '';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        {/* Back Button and Title */}
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="ghost" size="sm" onClick={onBackToLeads}>
            <ChevronRight className="ml-1" />
            العودة
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <h1 className="text-2xl font-bold">تفاصيل العميل المحتمل</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 md:flex-none">
                <Plus className="ml-1 h-4 w-4" />
                إضافة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddActivity}>
                <MessageSquare className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddTask}>
                <FileText className="ml-2 h-4 w-4" />
                إضافة مهمة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddAppointment}>
                <Calendar className="ml-2 h-4 w-4" />
                إضافة موعد
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onEdit} variant="default" className="flex-1 md:flex-none">
            <Edit className="ml-1 h-4 w-4" />
            تحرير
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Lead Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={lead.avatar_url || '/placeholder.svg'} alt={fullName} />
            <AvatarFallback>{fullName.charAt(0) || "؟"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              {lead.company && (
                <span className="text-sm text-muted-foreground">{lead.company}</span>
              )}
              {lead.position && (
                <>
                  <span className="text-muted-foreground mx-1">•</span>
                  <span className="text-sm text-muted-foreground">{lead.position}</span>
                </>
              )}
              <span className="text-muted-foreground mx-1">•</span>
              <span className="text-xs text-muted-foreground">تم الإنشاء في {createdDate}</span>
            </div>
          </div>
        </div>

        {/* Lead Status */}
        <div className="flex items-center gap-2 md:mr-auto">
          <Badge className={getStageColorClass(lead.status || 'جديد')}>
            {lead.status || 'جديد'}
          </Badge>
          {lead.source && (
            <Badge variant="outline">
              المصدر: {lead.source}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadProfileHeader;
