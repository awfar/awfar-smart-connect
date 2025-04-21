
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/leads';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LeadProfileSidebarProps {
  lead: Lead;
}

const LeadProfileSidebar: React.FC<LeadProfileSidebarProps> = ({ lead }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: ar });
    } catch (e) {
      return dateString || 'غير متوفر';
    }
  };

  // Calculate time since lead creation
  const getTimeSinceCreation = (dateString: string) => {
    try {
      const now = new Date();
      const createdAt = new Date(dateString);
      const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'اليوم';
      if (diffInDays === 1) return 'منذ يوم واحد';
      if (diffInDays < 30) return `منذ ${diffInDays} يوم`;
      if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
      }
      const years = Math.floor(diffInDays / 365);
      return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
    } catch (e) {
      return 'غير متوفر';
    }
  };

  return (
    <div className="space-y-4">
      {/* Lead Owner Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">مسؤول العميل المحتمل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {lead.owner?.avatar ? (
              <img 
                src={lead.owner.avatar} 
                alt={lead.owner.name || "صورة المسؤول"} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium">{lead.owner?.name || 'غير معين'}</p>
              <p className="text-xs text-muted-foreground">مسؤول العميل المحتمل</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Statistics Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">إحصائيات العميل المحتمل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">تاريخ الإنشاء</span>
            </div>
            <span className="text-sm font-medium">{formatDate(lead.created_at)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">مرت منذ الإنشاء</span>
            </div>
            <span className="text-sm font-medium">{getTimeSinceCreation(lead.created_at)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Source Card */}
      {lead.source && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">مصدر العميل المحتمل</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              {lead.source}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadProfileSidebar;
