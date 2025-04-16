
import React, { useState } from 'react';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivities, DashboardStats } from '@/services/dashboardService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, LineChart, BarChart4, ListChecks } from 'lucide-react';

const EnhancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: fetchRecentActivities,
  });

  return (
    <div className="space-y-6 p-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم الرئيسية</h1>
        <span className="text-sm text-muted-foreground">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')} {new Date().toLocaleTimeString('ar-SA')}
        </span>
      </div>
      
      <StatsCards isLoading={statsLoading} stats={stats} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart4 className="h-4 w-4" /> نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <LineChart className="h-4 w-4" /> تحليلات
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <ListChecks className="h-4 w-4" /> النشاطات
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" /> التقويم
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>نظرة عامة على النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  مرحباً بك في لوحة تحكم النظام، من هنا يمكنك متابعة وإدارة جميع الوظائف المتاحة.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">الكتالوج</h3>
                    <p className="text-sm text-muted-foreground">إدارة المنتجات، الباقات، والفواتير</p>
                    <div className="mt-4">
                      <a href="/catalog-management" className="text-primary hover:underline text-sm">
                        الانتقال إلى الكتالوج &rarr;
                      </a>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">الاشتراكات</h3>
                    <p className="text-sm text-muted-foreground">إدارة اشتراكات العملاء والباقات</p>
                    <div className="mt-4">
                      <a href="/subscription-management" className="text-primary hover:underline text-sm">
                        الانتقال إلى الاشتراكات &rarr;
                      </a>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">الفواتير</h3>
                    <p className="text-sm text-muted-foreground">إدارة الفواتير والمدفوعات</p>
                    <div className="mt-4">
                      <a href="/invoice-management" className="text-primary hover:underline text-sm">
                        الانتقال إلى الفواتير &rarr;
                      </a>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">التقارير</h3>
                    <p className="text-sm text-muted-foreground">عرض التقارير والإحصائيات</p>
                    <div className="mt-4">
                      <a href="/reports-management" className="text-primary hover:underline text-sm">
                        الانتقال إلى التقارير &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>النشاطات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivities 
                  isLoading={activitiesLoading} 
                  activities={activities.slice(0, 5)} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>سجل النشاطات</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivities 
                isLoading={activitiesLoading} 
                activities={activities} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>تقويم الأحداث</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <p className="text-center text-muted-foreground py-20">
                سيتم إضافة التقويم قريباً...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDashboard;
