
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityData } from '@/services/reportsService';

interface ActivityTimelineProps {
  data?: ActivityData[];
  isLoading: boolean;
  showByType?: boolean;
  showEfficiency?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  data, 
  isLoading,
  showByType = false,
  showEfficiency = false
}) => {
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        لا توجد بيانات متاحة
      </div>
    );
  }

  // Default activity timeline
  return (
    <div className="space-y-4">
      {data.map((activity) => (
        <div key={activity.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs`}>
              {activity.user.initials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{activity.type}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString('ar-SA', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <p className="mt-1 text-sm">{activity.description}</p>
              {activity.entity && (
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">العميل: </span>
                  <span className="font-medium">{activity.entity.name}</span>
                </div>
              )}
              {activity.result && (
                <div className="mt-1 text-xs">
                  <span className="text-muted-foreground">النتيجة: </span>
                  <span className="font-medium">{activity.result}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ActivityTimeline };
