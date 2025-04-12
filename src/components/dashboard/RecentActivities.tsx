
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RecentActivity } from "@/services/dashboardService";
import { formatDistanceToNow, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivitiesProps {
  isLoading: boolean;
  activities: RecentActivity[];
}

const RecentActivities = ({ isLoading, activities }: RecentActivitiesProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لا توجد أنشطة حديثة</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.user.avatar || ""} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm font-medium leading-none">{activity.user.name}</p>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
                {activity.timestamp && (
                  <span>
                    {formatDistanceToNow(parseISO(activity.timestamp), {
                      addSuffix: true,
                      locale: arSA
                    })}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            {activity.entity && (
              <p className="text-xs">
                مرتبط بـ:{" "}
                <a href="#" className="text-primary hover:underline">
                  {activity.entity.name}
                </a>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;
