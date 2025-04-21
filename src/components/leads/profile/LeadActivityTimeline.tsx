
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Phone, Mail, Calendar, Clock } from 'lucide-react';
import { LeadActivity } from '@/types/leads';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  isLoading: boolean;
  onAddActivity: () => void;
}

const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({
  activities,
  isLoading,
  onAddActivity
}) => {
  // Format date with Arabic locale
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if the date is today
      const isToday = new Date().toDateString() === date.toDateString();
      
      if (isToday) {
        return `اليوم، ${format(date, 'hh:mm a', { locale: ar })}`;
      }
      return format(date, 'PPpp', { locale: ar });
    } catch (e) {
      return dateString;
    }
  };

  // Get appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-amber-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'task':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get activity type in Arabic
  const getActivityType = (type: string) => {
    switch (type) {
      case 'note':
        return 'ملاحظة';
      case 'call':
        return 'مكالمة هاتفية';
      case 'email':
        return 'بريد إلكتروني';
      case 'meeting':
        return 'اجتماع';
      case 'task':
        return 'مهمة';
      case 'whatsapp':
        return 'واتساب';
      case 'update':
        return 'تحديث';
      case 'create':
        return 'إنشاء';
      case 'delete':
        return 'حذف';
      default:
        return type;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">الأنشطة</CardTitle>
          <Button size="sm" onClick={onAddActivity}>
            <Plus className="h-4 w-4 ml-1.5" />
            إضافة نشاط
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">الأنشطة</CardTitle>
        <Button size="sm" onClick={onAddActivity}>
          <Plus className="h-4 w-4 ml-1.5" />
          إضافة نشاط
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">لا توجد أنشطة بعد</p>
            <Button variant="outline" className="mt-4" onClick={onAddActivity}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة أول نشاط
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className="absolute right-0 top-1.5 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />
                
                {/* Activity content */}
                <div className="border-r border-dashed border-muted pr-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {getActivityType(activity.type)}
                        {activity.created_by && typeof activity.created_by !== 'string' ? (
                          <span className="font-normal text-muted-foreground mr-1">
                            بواسطة {activity.created_by.first_name} {activity.created_by.last_name}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(activity.created_at)}
                        {activity.scheduled_at && (
                          <span className="mr-2">
                            (مجدول: {formatDate(activity.scheduled_at)})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadActivityTimeline;
