
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from '@/components/ui/button';
import { Download, Filter, PlusSquare, FileBarChart, BarChart2, PieChart, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import SalesPerformanceChart from "@/components/reports/SalesPerformanceChart";
import LeadSourcesChart from "@/components/reports/LeadSourcesChart";
import TeamPerformanceReport from "@/components/reports/TeamPerformanceReport";
import ActivityTimeline from "@/components/reports/ActivityTimeline";
import ProductsPerformanceChart from "@/components/reports/ProductsPerformanceChart";
import SalesComparisonChart from "@/components/reports/SalesComparisonChart";
import { useQuery } from '@tanstack/react-query';
import { fetchReportData } from '@/services/reportsService';
import ReportFilters from '@/components/reports/ReportFilters';

const ReportsManagement = () => {
  const [period, setPeriod] = useState('yearly');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reportData', period],
    queryFn: () => fetchReportData(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBarChart className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">التقارير التحليلية</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  فلترة
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
                <Button variant="default" size="sm" className="gap-1">
                  <PlusSquare className="h-4 w-4" />
                  تقرير جديد
                </Button>
              </div>
            </div>
            
            {showFilters && <ReportFilters />}
            
            <div className="flex items-center">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">اليوم</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="mb-4 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="sales">المبيعات</TabsTrigger>
                <TabsTrigger value="leads">العملاء المحتملين</TabsTrigger>
                <TabsTrigger value="performance">الأداء</TabsTrigger>
                <TabsTrigger value="products">المنتجات</TabsTrigger>
                <TabsTrigger value="activities">الأنشطة</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>أداء المبيعات</CardTitle>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <SalesPerformanceChart data={reportData?.salesData} period={period} isLoading={isLoading} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>مصادر العملاء المحتملين</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <LeadSourcesChart data={reportData?.leadSources} isLoading={isLoading} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>أداء المنتجات</CardTitle>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ProductsPerformanceChart data={reportData?.productsData} isLoading={isLoading} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>أداء الفريق</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <TeamPerformanceReport data={reportData?.teamData} isLoading={isLoading} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>تحليل المبيعات</CardTitle>
                      <CardDescription>مقارنة المبيعات والإيرادات حسب الفترة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <SalesComparisonChart data={reportData?.salesComparisonData} isLoading={isLoading} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>المبيعات حسب القطاع</CardTitle>
                      <CardDescription>توزيع المبيعات على القطاعات المختلفة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        {/* Industry-specific sales chart */}
                        <SalesPerformanceChart 
                          data={reportData?.industrySalesData} 
                          period={period} 
                          isLoading={isLoading}
                          showByIndustry={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>معدل إغلاق الصفقات</CardTitle>
                      <CardDescription>تحليل معدلات تحويل الفرص إلى صفقات</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <SalesComparisonChart 
                          data={reportData?.conversionRateData}
                          isLoading={isLoading}
                          showConversionRate={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="leads">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>تحليل العملاء المحتملين</CardTitle>
                      <CardDescription>مصادر وحالات العملاء المحتملين</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <LeadSourcesChart data={reportData?.leadSources} isLoading={isLoading} showDetailed={true} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>مسار تحويل العملاء</CardTitle>
                      <CardDescription>تحليل مراحل تحويل العملاء المحتملين</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <LeadSourcesChart 
                          data={reportData?.leadFunnelData}
                          isLoading={isLoading}
                          showFunnel={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>نمو العملاء المحتملين</CardTitle>
                      <CardDescription>تحليل نمو قاعدة العملاء المحتملين</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <SalesPerformanceChart
                          data={reportData?.leadsGrowthData}
                          period={period}
                          isLoading={isLoading}
                          showLeadsGrowth={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>أداء الفريق التفصيلي</CardTitle>
                      <CardDescription>تحليل أداء أعضاء فريق المبيعات</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <TeamPerformanceReport data={reportData?.teamData} isLoading={isLoading} showDetailed={true} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>أهداف الفريق</CardTitle>
                      <CardDescription>مقارنة الأهداف مع الإنجازات الفعلية</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <TeamPerformanceReport 
                          data={reportData?.teamTargetsData}
                          isLoading={isLoading}
                          showTargets={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>فعالية الفريق</CardTitle>
                      <CardDescription>تحليل كفاءة أداء الفريق ومعدلات التحويل</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <TeamPerformanceReport 
                          data={reportData?.teamEfficiencyData}
                          isLoading={isLoading}
                          showEfficiency={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>أداء المنتجات</CardTitle>
                      <CardDescription>تحليل مبيعات المنتجات الرئيسية</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ProductsPerformanceChart data={reportData?.productsData} isLoading={isLoading} showDetailed={true} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>مقارنة المنتجات</CardTitle>
                      <CardDescription>مقارنة أداء المنتجات المختلفة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ProductsPerformanceChart 
                          data={reportData?.productComparisonData}
                          isLoading={isLoading}
                          showComparison={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>توزيع المبيعات حسب المنتج</CardTitle>
                      <CardDescription>تحليل حصة كل منتج من إجمالي المبيعات</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ProductsPerformanceChart 
                          data={reportData?.productDistributionData}
                          isLoading={isLoading}
                          showDistribution={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>سجل الأنشطة</CardTitle>
                      <CardDescription>تحليل أنشطة المبيعات والتواصل مع العملاء</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="min-h-[400px]">
                        <ActivityTimeline data={reportData?.activitiesData} isLoading={isLoading} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>أنواع الأنشطة</CardTitle>
                      <CardDescription>توزيع الأنشطة حسب النوع</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ActivityTimeline 
                          data={reportData?.activityTypesData}
                          isLoading={isLoading}
                          showByType={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>كفاءة الأنشطة</CardTitle>
                      <CardDescription>تحليل فعالية الأنشطة في تحويل الفرص</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ActivityTimeline 
                          data={reportData?.activityEfficiencyData}
                          isLoading={isLoading}
                          showEfficiency={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsManagement;
