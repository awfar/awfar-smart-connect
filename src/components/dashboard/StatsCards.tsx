
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  PercentSquare, 
  CreditCard,
  Loader2
} from "lucide-react";
import { DashboardStats } from "@/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  isLoading: boolean;
  stats?: DashboardStats;
}

const StatsCards = ({ isLoading, stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي العملاء المحتملين</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats && stats.totalLeads > 0 
                  ? "+10% من الشهر الماضي" 
                  : "لا يوجد بيانات سابقة للمقارنة"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">عملاء محتملين جدد</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">+{stats?.newLeadsToday || 0}</div>
              <p className="text-xs text-muted-foreground">اليوم</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">نسبة التحويل</CardTitle>
          <PercentSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">من العملاء المحتملين إلى عملاء</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">العائد المالي</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.totalRevenue?.toLocaleString() || 0} ريال</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
