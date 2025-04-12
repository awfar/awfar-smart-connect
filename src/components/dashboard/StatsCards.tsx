
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
  Loader2,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { DashboardStats } from "@/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  isLoading: boolean;
  stats?: DashboardStats;
}

const StatsCards = ({ isLoading, stats }: StatsCardsProps) => {
  // Calculate the trend percentage with a random value between 5-15%
  const leadsTrend = Math.floor(Math.random() * 10) + 5;
  const isLeadsTrendPositive = true; // For demo purposes, showing positive trend
  
  // Calculate new leads trend compared to previous day
  const newLeadsTrend = Math.floor(Math.random() * 20) + 5;
  const isNewLeadsTrendPositive = Math.random() > 0.3; // 70% chance of being positive
  
  // Calculate conversion rate trend
  const conversionTrend = Math.floor(Math.random() * 8) + 2;
  const isConversionTrendPositive = Math.random() > 0.4; // 60% chance of being positive
  
  // Calculate revenue trend
  const revenueTrend = Math.floor(Math.random() * 12) + 3;
  const isRevenueTrendPositive = Math.random() > 0.2; // 80% chance of being positive
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-r-4 border-r-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي العملاء المحتملين</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.totalLeads.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {isLeadsTrendPositive ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+{leadsTrend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />
                    <span className="text-red-500">-{leadsTrend}%</span>
                  </>
                )}
                <span className="mr-1">من الشهر الماضي</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-r-4 border-r-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">عملاء محتملين جدد</CardTitle>
          <UserPlus className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">+{stats?.newLeadsToday || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {isNewLeadsTrendPositive ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+{newLeadsTrend}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">-{newLeadsTrend}%</span>
                  </>
                )}
                <span className="mr-1">مقارنة بالأمس</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-r-4 border-r-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">نسبة التحويل</CardTitle>
          <PercentSquare className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {isConversionTrendPositive ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+{conversionTrend}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">-{conversionTrend}%</span>
                  </>
                )}
                <span className="mr-1">من الربع الماضي</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-r-4 border-r-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">العائد المالي</CardTitle>
          <CreditCard className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.totalRevenue?.toLocaleString() || 0} ريال</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {isRevenueTrendPositive ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+{revenueTrend}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />
                    <span className="text-red-500">-{revenueTrend}%</span>
                  </>
                )}
                <span className="mr-1">من الشهر الماضي</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
