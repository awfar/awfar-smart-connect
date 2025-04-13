
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity } from "@/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns";
import { arSA } from "date-fns/locale";
import { MessageSquare, Phone, FileText, CalendarDays, Mail, Clock } from "lucide-react";

interface RecentActivitiesProps {
  activities: RecentActivity[];
  isLoading: boolean;
}

const activityTypeIcons: Record<string, React.ReactNode> = {
  "اتصال": <Phone size={16} />,
  "ملاحظة": <FileText size={16} />,
  "رسالة": <MessageSquare size={16} />,
  "إجتماع": <CalendarDays size={16} />,
  "بريد إلكتروني": <Mail size={16} />,
};

const getActivityIcon = (type: string) => {
  return activityTypeIcons[type] || <Clock size={16} />;
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
          <CardTitle className="text-lg font-medium text-awfar-primary">الأنشطة الحديثة</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 h-full">
      <CardHeader className="bg-gradient-to-r from-awfar-primary/5 to-white pb-2 border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-awfar-primary">الأنشطة الحديثة</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 group">
              <div className="bg-awfar-primary/10 p-2.5 rounded-full text-awfar-primary flex-shrink-0 group-hover:bg-awfar-primary group-hover:text-white transition-colors">
                {activity.user.avatar ? (
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-5 w-5 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                )}
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  <span>{activity.description}</span>{" "}
                  {activity.entity && (
                    <span className="text-awfar-primary font-medium">
                      {activity.entity.name}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDistance(new Date(activity.timestamp), new Date(), {
                    addSuffix: true,
                    locale: arSA,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
