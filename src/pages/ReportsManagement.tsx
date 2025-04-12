import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend
} from 'recharts';
import SalesPerformanceChart from '@/components/reports/SalesPerformanceChart';
import SalesComparisonChart from '@/components/reports/SalesComparisonChart';
import LeadSourcesChart from '@/components/reports/LeadSourcesChart';
import ProductsPerformanceChart from '@/components/reports/ProductsPerformanceChart';
import TeamPerformanceReport from '@/components/reports/TeamPerformanceReport';
import ActivityTimeline from '@/components/reports/ActivityTimeline';
import ReportFilters from '@/components/reports/ReportFilters';
import StatsCards from '@/components/dashboard/StatsCards';
import { Printer, Download, Calendar, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardNav from '@/components/dashboard/DashboardNav';

// Sample data for charts
interface SalesData {
  name: string;
  value: number;
}

interface IndustrySalesData {
  industry: string;
  value: number;
}

interface LeadsGrowthData {
  month: string;
  value: number;
}

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState('sales');

  // Sales Trends Data
  const salesTrendsData = [
    { name: 'يناير', total: 95000 },
    { name: 'فبراير', total: 76000 },
    { name: 'مارس', total: 125000 },
    { name: 'أبريل', total: 89000 },
    { name: 'مايو', total: 115000 },
    { name: 'يونيو', total: 138000 },
    { name: 'يوليو', total: 145000 },
    { name: 'أغسطس', total: 120000 },
    { name: 'سبتمبر', total: 160000 },
    { name: 'أكتوبر', total: 175000 },
    { name: 'نوفمبر', total: 190000 },
    { name: 'ديسمبر', total: 210000 },
  ];

  // Products Performance Data
  const productsData = [
    { name: 'منتج أ', value: 35 },
    { name: 'منتج ب', value: 25 },
    { name: 'منتج ج', value: 20 },
    { name: 'منتج د', value: 15 },
    { name: 'منتج هـ', value: 5 },
  ];

  // Lead Sources Data
  const leadSourcesData = [
    { name: 'وسائل التواصل', value: 45 },
    { name: 'بحث جوجل', value: 25 },
    { name: 'إحالات', value: 15 },
    { name: 'مبيعات مباشرة', value: 10 },
    { name: 'أخرى', value: 5 },
  ];

  // Industry Distribution Data
  const industryData: SalesData[] = [
    { name: 'تكنولوجيا', value: 35 },
    { name: 'صحة', value: 20 },
    { name: 'تعليم', value: 15 },
    { name: 'تصنيع', value: 10 },
    { name: 'ضيافة', value: 8 },
    { name: 'خدمات مالية', value: 7 },
    { name: 'أخرى', value: 5 },
  ];

  // Leads Growth Data
  const leadsGrowthData: SalesData[] = [
    { name: 'يناير', value: 45 },
    { name: 'فبراير', value: 52 },
    { name: 'مارس', value: 68 },
    { name: 'أبريل', value: 72 },
    { name: 'مايو', value: 89 },
    { name: 'يونيو', value: 95 },
    { name: 'يوليو', value: 120 },
    { name: 'أغسطس', value: 110 },
    { name: 'سبتمبر', value: 125 },
    { name: 'أكتوبر', value: 145 },
    { name: 'نوفمبر', value: 160 },
    { name: 'ديسمبر', value: 190 },
  ];

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">التقارير والإحصاءات</h1>
              <p className="text-muted-foreground mt-1">تحليل أداء المبيعات والعملاء والفريق</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>طباعة</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>تصدير</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>التاريخ</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>تصفية</span>
              </Button>
            </div>
          </div>

          <ReportFilters />

          <StatsCards
            stats={[
              { title: 'إجمالي المبيعات', value: '٢.٥ مليون ريال', trend: '+12.5%', trendDirection: 'up' },
              { title: 'العملاء المحتملين', value: '٧٦٣', trend: '+5.2%', trendDirection: 'up' },
              { title: 'الصفقات المغلقة', value: '١٢٤', trend: '+18%', trendDirection: 'up' },
              { title: 'متوسط قيمة الصفقة', value: '١٢,٠٠٠ ريال', trend: '-3.1%', trendDirection: 'down' },
            ]}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full md:w-auto overflow-auto flex justify-start border-b pb-px">
              <TabsTrigger value="sales" className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">المبيعات</TabsTrigger>
              <TabsTrigger value="leads" className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">العملاء المحتملين</TabsTrigger>
              <TabsTrigger value="products" className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">المنتجات</TabsTrigger>
              <TabsTrigger value="team" className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">الفريق</TabsTrigger>
              <TabsTrigger value="activities" className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">الأنشطة</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>اتجاهات المبيعات</CardTitle>
                    <CardDescription>تحليل المبيعات الشهرية للعام الحالي</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={salesTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="المبيعات" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع القطاعات</CardTitle>
                    <CardDescription>توزيع المبيعات حسب القطاع</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>مقارنة أداء المبيعات</CardTitle>
                  <CardDescription>مقارنة المبيعات بين العام الحالي والعام السابق</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesComparisonChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>مصادر العملاء المحتملين</CardTitle>
                    <CardDescription>توزيع العملاء المحتملين حسب المصدر</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LeadSourcesChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>نمو العملاء المحتملين</CardTitle>
                    <CardDescription>عدد العملاء المحتملين الجدد شهريًا</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={leadsGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="العملاء المحتملين" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>معدل تحويل العملاء المحتملين</CardTitle>
                  <CardDescription>نسبة تحويل العملاء المحتملين إلى عملاء</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conversion Rate Chart */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>أداء المنتجات</CardTitle>
                    <CardDescription>توزيع المبيعات حسب المنتج</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductsPerformanceChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>اتجاهات المنتجات</CardTitle>
                    <CardDescription>تحليل مبيعات المنتجات عبر الزمن</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Products Trends Chart */}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>أداء الفريق</CardTitle>
                  <CardDescription>مقارنة أداء أعضاء الفريق في المبيعات</CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamPerformanceReport />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>جدول الأنشطة</CardTitle>
                  <CardDescription>تسلسل زمني للأنشطة الأخيرة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ReportsManagement;
