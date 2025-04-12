
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import LeadsOverview from "@/components/dashboard/LeadsOverview";
import RecentActivities from "@/components/dashboard/RecentActivities";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import TeamPerformance from "@/components/dashboard/TeamPerformance";
import { fetchDashboardStats, fetchRecentActivities, DashboardStats, RecentActivity } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  const { 
    data: stats, 
    isLoading: isStatsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['dashboardStats', selectedRegion],
    queryFn: () => fetchDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { 
    data: activities, 
    isLoading: isActivitiesLoading, 
    error: activitiesError 
  } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: fetchRecentActivities,
    staleTime: 60 * 1000, // 1 minute
  });

  useEffect(() => {
    if (statsError) {
      toast.error("فشل في تحميل إحصائيات لوحة التحكم");
    }
    
    if (activitiesError) {
      toast.error("فشل في تحميل الأنشطة الأخيرة");
    }
  }, [statsError, activitiesError]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">لوحة التحكم</h1>
              <div className="flex items-center gap-2">
                <select 
                  className="px-2 py-1 md:px-3 md:py-2 border rounded-md text-sm"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">جميع المناطق</option>
                  <option value="sa">السعودية</option>
                  <option value="ae">الإمارات</option>
                  <option value="eg">مصر</option>
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => {
                    toast.info("جاري تحديث البيانات...");
                    // We rely on React Query's refetch mechanism
                  }}
                >
                  {isStatsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "تحديث"
                  )}
                </Button>
              </div>
            </div>
            
            <StatsCards isLoading={isStatsLoading} stats={stats} />
            
            <Tabs defaultValue="overview">
              <TabsList className="mb-4 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="leads">العملاء المحتملين</TabsTrigger>
                <TabsTrigger value="sales">المبيعات</TabsTrigger>
                <TabsTrigger value="support">الدعم الفني</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>أداء المبيعات</CardTitle>
                      <CardDescription>إجمالي المبيعات والفرص للفترة الحالية</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SalesChart />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>أداء الفريق</CardTitle>
                      <CardDescription>تقييم أداء فريق المبيعات</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeamPerformance />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="leads">
                <LeadsOverview />
              </TabsContent>

              <TabsContent value="sales">
                <Card>
                  <CardHeader>
                    <CardTitle>تقرير المبيعات</CardTitle>
                    <CardDescription>تحليل المبيعات حسب المنطقة والفترة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <SalesChart showDetailed />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support">
                <Card>
                  <CardHeader>
                    <CardTitle>تقرير الدعم الفني</CardTitle>
                    <CardDescription>تحليل تذاكر الدعم وزمن الاستجابة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">سيتم توفير إحصاءات الدعم الفني قريباً</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>النشاطات الحديثة</CardTitle>
                <CardDescription>آخر الإجراءات والتفاعلات مع العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities 
                  isLoading={isActivitiesLoading} 
                  activities={activities || []} 
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
