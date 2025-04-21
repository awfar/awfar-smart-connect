
import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, Calendar, Clock, Mail, Phone, Check, 
  CheckCircle, FileText, Users, Building, DollarSign, Tags,
  Briefcase, XCircle, Edit, Trash2, User, PenTool
} from 'lucide-react';

export type TimelineItemType = 
  | 'note' 
  | 'task' 
  | 'call' 
  | 'meeting' 
  | 'email' 
  | 'whatsapp' 
  | 'update' 
  | 'create' 
  | 'delete' 
  | 'assign'
  | 'status_change'
  | 'company_link'
  | 'deal_link'
  | 'invoice_link'
  | 'ticket_create'
  | 'subscription_link'
  | 'appointment';

interface Creator {
  id?: string;
  name?: string;
  initials?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

interface LeadTimelineItemProps {
  id: string;
  type: TimelineItemType;
  description: string;
  created_at: string;
  created_by?: Creator | string;
  scheduled_at?: string;
  completed_at?: string;
  related_entity?: {
    type: string;
    id: string;
    name: string;
    status?: string;
  };
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isProcessing?: boolean;
}

const getInitials = (creator: any): string => {
  if (!creator) return '؟';
  
  if (typeof creator === 'string') {
    return creator.substring(0, 2).toUpperCase();
  }
  
  if (creator.initials) return creator.initials;
  
  if (creator.first_name || creator.last_name) {
    return `${(creator.first_name || '')[0] || ''}${(creator.last_name || '')[0] || ''}`.toUpperCase() || '؟';
  }
  
  if (creator.name) {
    return creator.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  return '؟';
};

const getCreatorName = (creator: any): string => {
  if (!creator) return 'غير معروف';
  
  if (typeof creator === 'string') {
    return creator;
  }
  
  if (creator.name) return creator.name;
  
  if (creator.first_name || creator.last_name) {
    return `${creator.first_name || ''} ${creator.last_name || ''}`.trim();
  }
  
  return 'غير معروف';
};

const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPpp', { locale: ar });
  } catch (error) {
    return date;
  }
};

const LeadTimelineItem: React.FC<LeadTimelineItemProps> = ({
  id,
  type,
  description,
  created_at,
  created_by,
  scheduled_at,
  completed_at,
  related_entity,
  onComplete,
  onDelete,
  onEdit,
  isProcessing
}) => {
  const renderTypeIcon = () => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'task':
        return <Clock className={`h-5 w-5 ${completed_at ? 'text-green-500' : 'text-amber-500'}`} />;
      case 'appointment':
      case 'meeting':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-600" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'create':
        return <PenTool className="h-5 w-5 text-blue-600" />;
      case 'update':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'delete':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'assign':
        return <User className="h-5 w-5 text-violet-500" />;
      case 'status_change':
        return <Tags className="h-5 w-5 text-orange-500" />;
      case 'company_link':
        return <Building className="h-5 w-5 text-slate-600" />;
      case 'deal_link':
        return <Briefcase className="h-5 w-5 text-emerald-600" />;
      case 'invoice_link':
        return <FileText className="h-5 w-5 text-gray-600" />;
      case 'ticket_create':
        return <MessageSquare className="h-5 w-5 text-red-600" />;
      case 'subscription_link':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'note': return 'ملاحظة';
      case 'task': return 'مهمة';
      case 'appointment': return 'موعد';
      case 'meeting': return 'اجتماع';
      case 'email': return 'بريد إلكتروني';
      case 'call': return 'مكالمة';
      case 'whatsapp': return 'واتساب';
      case 'create': return 'إنشاء';
      case 'update': return 'تحديث';
      case 'delete': return 'حذف';
      case 'assign': return 'تعيين';
      case 'status_change': return 'تغيير الحالة';
      case 'company_link': return 'ربط بشركة';
      case 'deal_link': return 'ربط بصفقة';
      case 'invoice_link': return 'ربط بفاتورة';
      case 'ticket_create': return 'إنشاء تذكرة';
      case 'subscription_link': return 'ربط باشتراك';
      default: return type;
    }
  };

  const renderBadgeWithStatus = () => {
    if (!related_entity?.status) return null;
    
    let color = 'bg-gray-200 text-gray-800';
    if (related_entity.status.includes('مكتمل') || related_entity.status.includes('مدفوع')) {
      color = 'bg-green-100 text-green-800';
    } else if (related_entity.status.includes('انتظار')) {
      color = 'bg-blue-100 text-blue-800';
    } else if (related_entity.status.includes('ملغي')) {
      color = 'bg-red-100 text-red-800';
    }
    
    return (
      <Badge variant="outline" className={`mr-2 ${color}`}>
        {related_entity.status}
      </Badge>
    );
  };

  return (
    <div className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          {renderTypeIcon()}
          <div>
            <div className="flex items-center">
              <span className="font-medium">{getTypeLabel()}</span>
              {type === 'task' && (
                <Badge variant={completed_at ? 'outline' : 'default'} className="mr-2">
                  {completed_at ? 'مكتمل' : 'قيد الانتظار'}
                </Badge>
              )}
              {related_entity && renderBadgeWithStatus()}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {related_entity && (
              <div className="mt-1 text-xs text-muted-foreground">
                {related_entity.type && related_entity.name && (
                  <span className="inline-flex items-center">
                    {related_entity.type === 'company' && <Building className="h-3 w-3 mr-1" />}
                    {related_entity.type === 'deal' && <Briefcase className="h-3 w-3 mr-1" />}
                    {related_entity.type === 'invoice' && <FileText className="h-3 w-3 mr-1" />}
                    {related_entity.type === 'ticket' && <MessageSquare className="h-3 w-3 mr-1" />}
                    {related_entity.name}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="inline-flex items-center text-xs text-muted-foreground">
                <Avatar className="h-4 w-4 mr-1">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(created_by)}
                  </AvatarFallback>
                </Avatar>
                {getCreatorName(created_by)}
              </div>
              
              <span className="text-xs text-muted-foreground">
                {formatDate(created_at)}
              </span>
              
              {scheduled_at && (
                <span className={`text-xs flex items-center ${completed_at ? 'line-through text-muted-foreground' : ''}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(scheduled_at)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          {type === 'task' && !completed_at && onComplete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={isProcessing}
              onClick={() => onComplete(id)}
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={isProcessing}
              onClick={() => onEdit(id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={isProcessing}
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadTimelineItem;
