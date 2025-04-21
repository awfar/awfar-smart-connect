
import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  Check, 
  Clock, 
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LeadActivity } from '@/types/leads';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  isLoading: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAddActivity: () => void;
}

const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({
  activities,
  isLoading,
  onComplete,
  onDelete,
  onAddActivity
}) => {
  const [processingActivity, setProcessingActivity] = useState<string | null>(null);

  const handleComplete = async (id: string) => {
    setProcessingActivity(id);
    try {
      await onComplete(id);
    } finally {
      setProcessingActivity(null);
    }
  };

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'task':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'meeting':
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-green-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-red-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'update':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'create':
        return <Plus className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'note': return 'ملاحظة';
      case 'task': return 'مهمة';
      case 'meeting': return 'اجتماع';
      case 'appointment': return 'موعد';
      case 'email': return 'بريد إلكتروني';
      case 'call': return 'مكالمة هاتفية';
      case 'whatsapp': return 'واتساب';
      case 'update': return 'تحديث';
      case 'create': return 'إنشاء';
      default: return type;
    }
  };

  // Get initials from user name
  const getCreatorInitials = (created_by: any): string => {
    if (!created_by) return '؟';
    
    if (typeof created_by === 'string') {
      return '؟';
    }
    
    if (created_by.profiles) {
      return (created_by.profiles.first_name?.charAt(0) || '') + 
             (created_by.profiles.last_name?.charAt(0) || '');
    }
    
    if (created_by.first_name) {
      return (created_by.first_name?.charAt(0) || '') + 
             (created_by.last_name?.charAt(0) || '');
    }
    
    return '؟';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">سجل الأنشطة</h2>
          <Button onClick={onAddActivity} size="sm">
            <Plus className="ml-1 h-4 w-4" />
            إضافة نشاط
          </Button>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">سجل الأنشطة</h2>
        <Button onClick={onAddActivity} size="sm">
          <Plus className="ml-1 h-4 w-4" />
          إضافة نشاط
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          لا توجد أنشطة مسجلة لهذا العميل
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {index > 0 && (
                <div className="absolute top-0 bottom-0 right-[19px] w-0.5 bg-muted -z-10"></div>
              )}
              <div className="flex gap-4">
                <div className="min-w-10 h-10 rounded-full flex items-center justify-center bg-muted/50">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {getCreatorInitials(activity.created_by)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <span className="font-medium">
                        {typeof activity.created_by === 'object' && 'first_name' in activity.created_by 
                          ? `${activity.created_by.first_name || ''} ${activity.created_by.last_name || ''}`
                          : (typeof activity.created_by === 'object' && 'profiles' in activity.created_by && activity.created_by.profiles
                            ? `${activity.created_by.profiles.first_name || ''} ${activity.created_by.profiles.last_name || ''}`
                            : 'مستخدم النظام')}
                      </span>
                      
                      <Badge variant="outline">
                        {getActivityTypeText(activity.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {activity.scheduled_at && !activity.completed_at && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={processingActivity === activity.id}
                          onClick={() => handleComplete(activity.id)}
                          className="h-8 w-8 p-0"
                        >
                          {processingActivity === activity.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(activity.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="whitespace-pre-wrap mb-2">{activity.description}</p>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>
                      {activity.created_at && (
                        <span>
                          {format(new Date(activity.created_at), 'yyyy/MM/dd HH:mm', { locale: ar })}
                        </span>
                      )}
                    </div>
                    
                    {activity.scheduled_at && (
                      <div className="flex items-center">
                        <Clock className="ml-1 h-3 w-3" />
                        <span className={activity.completed_at ? 'line-through' : ''}>
                          {format(new Date(activity.scheduled_at), 'yyyy/MM/dd', { locale: ar })}
                        </span>
                        {activity.completed_at && (
                          <div className="flex items-center text-green-500 mr-2">
                            <Check className="ml-1 h-3 w-3" />
                            <span>
                              {format(new Date(activity.completed_at), 'yyyy/MM/dd', { locale: ar })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {index < activities.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadActivityTimeline;
