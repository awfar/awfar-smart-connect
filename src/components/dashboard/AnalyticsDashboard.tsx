
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceAnalytics } from '@/services/catalog/invoiceService';
import { getActivityAnalytics } from '@/services/loggingService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsDashboard: React.FC = () => {
  const { data: invoiceAnalytics, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoiceAnalytics'],
    queryFn: getInvoiceAnalytics
  });

  const { data: activityAnalytics, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['activityAnalytics'],
    queryFn: getActivityAnalytics
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">نظرة عامة على النظام</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">إجمالي الفواتير</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInvoice ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{invoiceAnalytics?.totalCount || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {invoiceAnalytics?.paidAmount.toFixed(2) || 0} ر.س إجمالي المدفوعات
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">المستحقات المتأخرة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInvoice ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{invoiceAnalytics?.overdueAmount.toFixed(2) || 0} ر.س</div>
                <div className="text-sm text-red-500 mt-1">
                  يجب متابعة التحصيل
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">النشاطات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {activityAnalytics?.actionCounts.reduce((acc, item) => acc + item.count, 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  عملية في النظام
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">الإيرادات الشهرية</TabsTrigger>
          <TabsTrigger value="activities">تحليل النشاطات</TabsTrigger>
          <TabsTrigger value="entities">تحليل البيانات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoadingInvoice ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : invoiceAnalytics?.monthlyRevenue && invoiceAnalytics.monthlyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={invoiceAnalytics.monthlyRevenue}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} ر.س`]} />
                    <Legend />
                    <Bar dataKey="amount" name="الإيرادات" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  لا توجد بيانات إيرادات متاحة
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع النشاطات حسب النوع</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingActivity ? (
                  <Skeleton className="h-full w-full" />
                ) : activityAnalytics?.actionCounts && activityAnalytics.actionCounts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityAnalytics.actionCounts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ action, percent }) => `${action}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="action"
                      >
                        {activityAnalytics.actionCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} نشاط`]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    لا توجد بيانات نشاطات متاحة
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>توزيع النشاطات حسب المستخدم</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingActivity ? (
                  <Skeleton className="h-full w-full" />
                ) : activityAnalytics?.userCounts && activityAnalytics.userCounts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityAnalytics.userCounts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ userName, percent }) => `${userName}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="userName"
                      >
                        {activityAnalytics.userCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} نشاط`]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    لا توجد بيانات مستخدمين متاحة
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="entities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع البيانات حسب النوع</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoadingActivity ? (
                <Skeleton className="h-[300px] w-full" />
              ) : activityAnalytics?.entityCounts && activityAnalytics.entityCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityAnalytics.entityCounts}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="entityType" />
                    <Tooltip formatter={(value) => [`${value} عنصر`]} />
                    <Legend />
                    <Bar dataKey="count" name="عدد العناصر" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  لا توجد بيانات كافية للتحليل
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
