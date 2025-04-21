
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { 
  fetchDashboardData, 
  fetchRecentActivities,
  DashboardStats,
  RecentActivity
} from "@/services/dashboardService";

const EnhancedDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard stats
        const stats = await fetchDashboardData();
        setStatsData(stats);
        
        // Fetch recent activities
        const recentActivities = await fetchRecentActivities();
        setActivities(recentActivities || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("فشل في تحميل بيانات لوحة المعلومات");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">لوحة المعلومات</h1>
          <p className="text-muted-foreground">نظرة عامة على نشاط الأعمال والأداء</p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards data={statsData} isLoading={isLoading} />
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activities Section */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>أحدث الأنشطة</CardTitle>
              <CardDescription>آخر الإجراءات والتحديثات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities 
                activities={activities && Array.isArray(activities) ? activities.slice(0, 10) : []} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
          
          {/* System Status Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>حالة النظام</CardTitle>
              <CardDescription>معلومات عن حالة الخدمات والوحدات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>قاعدة البيانات</span>
                  <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">متصل</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>خدمة البريد الإلكتروني</span>
                  <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">متصل</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>واجهة برمجة التطبيقات</span>
                  <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">متصل</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>نظام المهام الخلفي</span>
                  <span className="text-amber-600 text-sm font-medium bg-amber-100 px-2 py-1 rounded-full">تحذير</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>الوقت المنقضي منذ آخر إعادة تشغيل</span>
                  <span className="text-sm font-medium">3 أيام، 7 ساعات</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedDashboard;
