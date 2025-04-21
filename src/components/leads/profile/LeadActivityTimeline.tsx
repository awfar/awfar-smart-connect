
import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  Mail, 
  CheckSquare, 
  MessageCircle, 
  Clock, 
  Check, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadActivity } from '@/types/leads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, differenceInDays } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';

interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  isLoading: boolean;
  onComplete: (activityId: string) => void;
  onDelete: (activityId: string) => void;
  onAddActivity: () => void;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'note':
      return <MessageSquare className="h-4 w-4" />;
    case 'call':
      return <Phone className="h-4 w-4" />;
    case 'meeting':
      return <Calendar className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'task':
      return <CheckSquare className="h-4 w-4" />;
    case 'whatsapp':
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const ActivityBadge = ({ activity }: { activity: LeadActivity }) => {
  // Activity types with status
  if (activity.type === 'task' || activity.type === 'meeting' || activity.type === 'call') {
    if (activity.completed_at) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="h-3 w-3 mr-1" /> مكتمل
        </Badge>
      );
    } else if (activity.scheduled_at) {
      const scheduled = new Date(activity.scheduled_at);
      const now = new Date();
      
      if (scheduled < now) {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Clock className="h-3 w-3 mr-1" /> متأخر
          </Badge>
        );
      } else {
        const days = differenceInDays(scheduled, now);
        if (days === 0) {
          return (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Clock className="h-3 w-3 mr-1" /> اليوم
            </Badge>
          );
        } else if (days === 1) {
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="h-3 w-3 mr-1" /> غدًا
            </Badge>
          );
        } else {
          return (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              <Clock className="h-3 w-3 mr-1" /> بعد {days} أيام
            </Badge>
          );
        }
      }
    }
  }
  
  return null;
};

const getActivityTitle = (activity: LeadActivity) => {
  const typeLabels = {
    note: 'ملاحظة',
    call: 'مكالمة هاتفية',
    meeting: 'اجتماع',
    email: 'بريد إلكتروني',
    task: 'مهمة',
    whatsapp: 'رسالة واتساب',
    update: 'تحديث',
    create: 'إنشاء',
    delete: 'حذف'
  };
  
  return typeLabels[activity.type as keyof typeof typeLabels] || 'نشاط';
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'yyyy/MM/dd - HH:mm');
  } catch (e) {
    return 'تاريخ غير صالح';
  }
};

const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({
  activities,
  isLoading,
  onComplete,
  onDelete,
  onAddActivity
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>سجل الأنشطة</span>
            <Skeleton className="h-9 w-9" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>سجل الأنشطة</span>
          <Button size="sm" onClick={onAddActivity}>
            <Plus className="h-4 w-4 mr-1" />
            إضافة نشاط
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {activity.created_by && typeof activity.created_by !== 'string' ? 
                        `${activity.created_by.first_name?.charAt(0) || ''}${activity.created_by.last_name?.charAt(0) || ''}` : 
                        '??'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <span className="inline-flex items-center justify-center p-1 bg-gray-100 rounded-full mr-1">
                            <ActivityIcon type={activity.type} />
                          </span>
                          {getActivityTitle(activity)}
                          <ActivityBadge activity={activity} />
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.created_by && typeof activity.created_by !== 'string' ? 
                            `${activity.created_by.first_name || ''} ${activity.created_by.last_name || ''}` : 
                            'مستخدم غير معروف'} | {formatDate(activity.created_at)}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(activity.type === 'task' || activity.type === 'meeting' || activity.type === 'call') && 
                           !activity.completed_at && (
                            <DropdownMenuItem onClick={() => onComplete(activity.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              <span>تحديد كمكتمل</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onDelete(activity.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>حذف</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="mt-2 text-sm">{activity.description}</p>
                    
                    {activity.scheduled_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 inline-block mr-1" /> 
                        الموعد المجدول: {formatDate(activity.scheduled_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">لا توجد أنشطة مسجلة بعد</p>
            <Button onClick={onAddActivity} variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              إضافة نشاط جديد
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadActivityTimeline;
