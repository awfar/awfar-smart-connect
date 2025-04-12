
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import LeadsOverview from "@/components/dashboard/LeadsOverview";
import RecentActivities from "@/components/dashboard/RecentActivities";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import TeamPerformance from "@/components/dashboard/TeamPerformance";

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-2 border rounded-md text-sm"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">جميع المناطق</option>
                  <option value="sa">السعودية</option>
                  <option value="ae">الإمارات</option>
                  <option value="eg">مصر</option>
                </select>
              </div>
            </div>
            
            <StatsCards />
            
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
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
                <RecentActivities />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
