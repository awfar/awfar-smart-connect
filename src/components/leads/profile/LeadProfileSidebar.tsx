
import React from 'react';
import { Lead } from '@/types/leads';
import { 
  MessageSquare, 
  FileText, 
  Calendar, 
  Mail, 
  Phone,
  User,
  CheckSquare,
  Briefcase,
  FileIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStageColorClass } from '@/services/leads/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LeadProfileSidebarProps {
  lead: Lead;
  onAddActivity: (type: 'note' | 'call' | 'meeting' | 'email' | 'task' | 'whatsapp') => void;
  onAddTask: () => void;
  onAddAppointment: () => void;
}

const LeadProfileSidebar: React.FC<LeadProfileSidebarProps> = ({
  lead,
  onAddActivity,
  onAddTask,
  onAddAppointment
}) => {
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
  const createdDate = lead.created_at ? format(new Date(lead.created_at), 'yyyy/MM/dd', { locale: ar }) : '';
  
  return (
    <div className="space-y-6">
      {/* Lead Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">معلومات العميل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center mb-4">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={lead.avatar_url || '/placeholder.svg'} alt={fullName} />
              <AvatarFallback>{fullName.charAt(0) || "؟"}</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">{fullName}</h3>
            <p className="text-sm text-muted-foreground">{lead.position || ''}</p>
            <div className="mt-2">
              <Badge className={getStageColorClass(lead.status || 'جديد')}>
                {lead.status || 'جديد'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {lead.email && (
              <div className="flex items-center">
                <Mail className="ml-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.email}</span>
              </div>
            )}
            
            {lead.phone && (
              <div className="flex items-center">
                <Phone className="ml-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.phone}</span>
              </div>
            )}
            
            {lead.company && (
              <div className="flex items-center">
                <Briefcase className="ml-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.company}</span>
              </div>
            )}
            
            {lead.owner && (
              <div className="flex items-center">
                <User className="ml-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.owner.name || 'غير محدد'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddActivity('note')}
          >
            <MessageSquare className="ml-2 h-4 w-4" />
            إضافة ملاحظة
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddTask}
          >
            <CheckSquare className="ml-2 h-4 w-4" />
            إضافة مهمة
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddAppointment}
          >
            <Calendar className="ml-2 h-4 w-4" />
            جدولة موعد
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddActivity('call')}
          >
            <Phone className="ml-2 h-4 w-4" />
            تسجيل مكالمة
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddActivity('email')}
          >
            <Mail className="ml-2 h-4 w-4" />
            تسجيل بريد إلكتروني
          </Button>
        </CardContent>
      </Card>

      {/* Lead Source and Creation Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">معلومات إضافية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">المصدر</p>
            <p>{lead.source || 'غير محدد'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</p>
            <p>{createdDate || 'غير محدد'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">آخر تحديث</p>
            <p>{lead.updated_at ? format(new Date(lead.updated_at), 'yyyy/MM/dd', { locale: ar }) : 'غير محدد'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">الدولة</p>
            <p>{lead.country || 'غير محدد'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">القطاع</p>
            <p>{lead.industry || 'غير محدد'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadProfileSidebar;
