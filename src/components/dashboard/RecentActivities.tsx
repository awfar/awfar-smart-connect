
import React from 'react';
import { Loader2 } from 'lucide-react';
import { RecentActivity } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivitiesProps {
  activities: RecentActivity[];
  isLoading: boolean;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return '👤';
      case 'deal': return '💼';
      case 'invoice': return '📄';
      case 'subscription': return '🔄';
      case 'ticket': return '🎫';
      case 'task': return '✅';
      case 'appointment': return '📅';
      default: return '📝';
    }
  };

  const formatActivityAction = (action: string) => {
    switch (action) {
      case 'create': return 'إنشاء';
      case 'update': return 'تحديث';
      case 'delete': return 'حذف';
      case 'complete': return 'إكمال';
      case 'assign': return 'تعيين';
      case 'convert': return 'تحويل';
      default: return action;
    }
  };

  const formatEntityType = (type: string) => {
    switch (type) {
      case 'lead': return 'عميل محتمل';
      case 'deal': return 'صفقة';
      case 'invoice': return 'فاتورة';
      case 'subscription': return 'اشتراك';
      case 'ticket': return 'تذكرة';
      case 'task': return 'مهمة';
      case 'appointment': return 'موعد';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لا توجد أنشطة حديثة لعرضها
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b last:border-0 pb-3 last:pb-0">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-slate-100 h-9 w-9 flex items-center justify-center text-lg">
              {getActivityIcon(activity.entity_type)}
            </div>
            
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.user_name}</span>{' '}
                قام بـ{formatActivityAction(activity.action)}{' '}
                {formatEntityType(activity.entity_type)}
              </p>
              
              {activity.details && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.details}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(activity.created_at)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;
