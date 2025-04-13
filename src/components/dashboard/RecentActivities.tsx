
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RecentActivity } from "@/services/dashboardService";
import { formatDistanceToNow, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivitiesProps {
  isLoading: boolean;
  activities: RecentActivity[];
}

const RecentActivities = ({ isLoading, activities }: RecentActivitiesProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
          <CardTitle className="text-lg font-medium">آخر الأنشطة</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card className="shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
          <CardTitle className="text-lg font-medium">آخر الأنشطة</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">لا توجد أنشطة حديثة</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
        <CardTitle className="text-lg font-medium">آخر الأنشطة</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 hover:bg-gray-50 p-3 -mx-3 rounded-md transition-colors">
              <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                <AvatarImage src={activity.user.avatar || ""} />
                <AvatarFallback className="bg-awfar-primary text-white">{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm font-medium leading-none text-awfar-primary">{activity.user.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Badge variant="outline" className="text-xs border-gray-200 bg-gray-50">
                      {activity.type}
                    </Badge>
                    {activity.timestamp && (
                      <span className="text-gray-500">
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
                    <a href="#" className="text-awfar-accent hover:underline">
                      {activity.entity.name}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
